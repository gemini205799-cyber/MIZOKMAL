/// MIZO Production Firestore Room Service
/// Manages real-time room sessions, atomic seat reservations,
/// Boss Seat auctions, and moderator controls using Google Cloud Firestore.
library;

import 'package:cloud_firestore/cloud_firestore.dart';
import '../../models/firestore_room_model.dart';

class FirestoreRoomService {
  final FirebaseFirestore _firestore;

  FirestoreRoomService({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  // Collection References
  CollectionReference<Map<String, dynamic>> get _roomsCollection =>
      _firestore.collection('rooms');

  DocumentReference<Map<String, dynamic>> _roomDoc(String roomId) =>
      _roomsCollection.doc(roomId);

  CollectionReference<Map<String, dynamic>> _seatsCollection(String roomId) =>
      _roomDoc(roomId).collection('seats');

  DocumentReference<Map<String, dynamic>> _seatDoc(String roomId, int pos) =>
      _seatsCollection(roomId).doc('$pos');

  // =========================================================================
  // 1. REAL-TIME STREAMS (Room & Seats)
  // =========================================================================

  /// Stream single room document updates (listeners count, PK status, Boss rent)
  Stream<FirestoreRoomModel> streamRoom(String roomId) {
    return _roomDoc(roomId).snapshots().map((snapshot) {
      if (!snapshot.exists) {
        throw Exception('Room $roomId does not exist in Firestore');
      }
      return FirestoreRoomModel.fromFirestore(snapshot);
    });
  }

  /// Stream all seats in real-time (pos 1..12, 1000 Host, 1001 Boss)
  Stream<List<FirestoreSeatModel>> streamSeats(String roomId) {
    return _seatsCollection(roomId)
        .orderBy('pos')
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) {
        final pos = int.tryParse(doc.id) ?? (doc.data()['pos'] as num).toInt();
        return FirestoreSeatModel.fromMap(doc.data(), pos);
      }).toList();
    });
  }

  /// Stream a single seat document (e.g. Host Throne or Boss Seat)
  Stream<FirestoreSeatModel?> streamSeat(String roomId, int pos) {
    return _seatDoc(roomId, pos).snapshots().map((snapshot) {
      if (!snapshot.exists || snapshot.data() == null) return null;
      return FirestoreSeatModel.fromMap(snapshot.data()!, pos);
    });
  }

  // =========================================================================
  // 2. ATOMIC SEAT TRANSACTIONS (Prevents Race Conditions)
  // =========================================================================

  /// Take an empty seat atomically using Firestore Transaction.
  /// If two users tap the same seat at the exact same millisecond,
  /// only the first one succeeds; the second receives false.
  Future<bool> takeSeat({
    required String roomId,
    required int pos,
    required FirestoreSeatParticipant participant,
  }) async {
    final seatRef = _seatDoc(roomId, pos);

    try {
      return await _firestore.runTransaction<bool>((transaction) async {
        final seatSnap = await transaction.get(seatRef);

        if (!seatSnap.exists) {
          throw Exception('Seat position $pos does not exist');
        }

        final data = seatSnap.data()!;
        final status = data['status'] as String? ?? 'empty';
        final isLocked = data['isLocked'] as bool? ?? false;

        // Seat must be empty and unlocked
        if (status != 'empty' || isLocked) {
          return false;
        }

        // Atomically occupy seat
        transaction.update(seatRef, {
          'status': 'occupied',
          'participant': participant.toMap(),
          'updatedAt': FieldValue.serverTimestamp(),
        });

        return true;
      });
    } catch (e) {
      return false;
    }
  }

  /// Leave an occupied seat atomically
  Future<bool> leaveSeat({
    required String roomId,
    required int pos,
    required String userId,
  }) async {
    final seatRef = _seatDoc(roomId, pos);

    try {
      return await _firestore.runTransaction<bool>((transaction) async {
        final seatSnap = await transaction.get(seatRef);
        if (!seatSnap.exists) return false;

        final data = seatSnap.data()!;
        final currentParticipant = data['participant'] as Map<String, dynamic>?;

        // Verify the user leaving is the actual occupant (or host/admin)
        if (currentParticipant == null || currentParticipant['userId'] != userId) {
          return false;
        }

        // Reset seat to empty
        transaction.update(seatRef, {
          'status': 'empty',
          'participant': FieldValue.delete(),
          'updatedAt': FieldValue.serverTimestamp(),
        });

        return true;
      });
    } catch (e) {
      return false;
    }
  }

  /// Rent or Outbid the Imperial Boss Seat (pos: 1001)
  /// Checks coin bid > current rent price, then updates seat & room doc atomically.
  Future<bool> rentBossSeat({
    required String roomId,
    required FirestoreSeatParticipant participant,
    required int bidCoins,
  }) async {
    final roomRef = _roomDoc(roomId);
    final bossSeatRef = _seatDoc(roomId, FirestoreSeatModel.posBossSeat);

    try {
      return await _firestore.runTransaction<bool>((transaction) async {
        final roomSnap = await transaction.get(roomRef);
        final bossSeatSnap = await transaction.get(bossSeatRef);

        if (!roomSnap.exists || !bossSeatSnap.exists) {
          return false;
        }

        final roomData = roomSnap.data()!;
        final currentRentCost = (roomData['bossRentCost'] as num?)?.toInt() ?? 50000;

        // Bid must be higher than current rent cost
        if (bidCoins <= currentRentCost) {
          return false;
        }

        final bossParticipant = participant.copyWith(
          role: 'boss',
          rentCoins: bidCoins,
        );

        // 1. Update Boss Seat Doc (pos: 1001)
        transaction.update(bossSeatRef, {
          'status': 'occupied',
          'participant': bossParticipant.toMap(),
          'updatedAt': FieldValue.serverTimestamp(),
        });

        // 2. Update Room Header Doc with new Boss metadata & next minimum bid
        transaction.update(roomRef, {
          'bossRentCost': bidCoins + 10000, // Increase outbid threshold by +10k
          'bossId': participant.userId,
          'bossName': participant.name,
          'bossAvatar': participant.avatar,
          'updatedAt': FieldValue.serverTimestamp(),
        });

        return true;
      });
    } catch (e) {
      return false;
    }
  }

  // =========================================================================
  // 3. MODERATION & HOST CONTROLS
  // =========================================================================

  /// Toggle lock on a specific seat
  Future<void> toggleSeatLock({
    required String roomId,
    required int pos,
    required bool lock,
  }) async {
    await _seatDoc(roomId, pos).update({
      'isLocked': lock,
      if (lock) 'status': 'locked' else 'status': 'empty',
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// Lock or Unlock all regular guest seats (pos 1..capacity) in a single batch
  Future<void> lockAllGuestSeats({
    required String roomId,
    required int capacity,
    required bool lock,
  }) async {
    final batch = _firestore.batch();

    for (int i = 1; i <= capacity; i++) {
      final seatRef = _seatDoc(roomId, i);
      batch.update(seatRef, {
        'isLocked': lock,
        if (lock) 'status': 'locked' else 'status': 'empty',
        'updatedAt': FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
  }

  /// Host mutes or unmutes a speaker on a specific seat
  Future<void> toggleSeatMute({
    required String roomId,
    required int pos,
    required bool mute,
  }) async {
    await _seatDoc(roomId, pos).update({
      'isMutedByHost': mute,
      'participant.isMuted': mute,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// Sync local microphone active energy to Firestore
  Future<void> updateSpeakingStatus({
    required String roomId,
    required int pos,
    required bool isSpeaking,
  }) async {
    await _seatDoc(roomId, pos).update({
      'participant.isSpeaking': isSpeaking,
    });
  }

  // =========================================================================
  // 4. INITIALIZATION & SETUP
  // =========================================================================

  /// Initialize all seats when a host starts a new room:
  /// - pos 1000: Host Anchor Throne (Occupied by Host)
  /// - pos 1001: Boss Seat (Empty, base rent 50k)
  /// - pos 1..capacity: Guest Seats (Empty)
  Future<void> initializeRoomSeats({
    required String roomId,
    required int capacity,
    required FirestoreSeatParticipant hostParticipant,
  }) async {
    final batch = _firestore.batch();

    // 1. Host Throne (pos: 1000)
    final hostSeatRef = _seatDoc(roomId, FirestoreSeatModel.posHostThrone);
    batch.set(hostSeatRef, {
      'pos': FirestoreSeatModel.posHostThrone,
      'status': 'occupied',
      'isLocked': false,
      'isMutedByHost': false,
      'participant': hostParticipant.copyWith(role: 'host').toMap(),
      'updatedAt': FieldValue.serverTimestamp(),
    });

    // 2. Boss Seat (pos: 1001)
    final bossSeatRef = _seatDoc(roomId, FirestoreSeatModel.posBossSeat);
    batch.set(bossSeatRef, {
      'pos': FirestoreSeatModel.posBossSeat,
      'status': 'empty',
      'isLocked': false,
      'isMutedByHost': false,
      'updatedAt': FieldValue.serverTimestamp(),
    });

    // 3. Regular Guest Seats (1..capacity)
    for (int i = 1; i <= capacity; i++) {
      final seatRef = _seatDoc(roomId, i);
      batch.set(seatRef, {
        'pos': i,
        'status': 'empty',
        'isLocked': false,
        'isMutedByHost': false,
        'updatedAt': FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
  }
}
