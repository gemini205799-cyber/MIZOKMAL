/// MIZO Firestore Data Models (Production Real-Time Engine)
/// Supports real-time Firestore sync with:
/// - Host Throne (pos: 1000)
/// - Boss Seat (pos: 1001)
/// - Regular Seats (pos: 1..12)
library;

import 'package:cloud_firestore/cloud_firestore.dart';

enum FirestoreSeatStatus {
  empty,
  occupied,
  locked,
}

class FirestoreSeatParticipant {
  final String userId;
  final String name;
  final String avatar;
  final int level;
  final String role; // 'host', 'boss', 'vip', 'speaker'
  final bool isMuted;
  final bool isSpeaking;
  final int? rentCoins; // Used for Boss Seat bidding (pos: 1001)
  final int contribution;

  const FirestoreSeatParticipant({
    required this.userId,
    required this.name,
    required this.avatar,
    this.level = 1,
    this.role = 'speaker',
    this.isMuted = false,
    this.isSpeaking = false,
    this.rentCoins,
    this.contribution = 0,
  });

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'name': name,
      'avatar': avatar,
      'level': level,
      'role': role,
      'isMuted': isMuted,
      'isSpeaking': isSpeaking,
      if (rentCoins != null) 'rentCoins': rentCoins,
      'contribution': contribution,
    };
  }

  factory FirestoreSeatParticipant.fromMap(Map<String, dynamic> map) {
    return FirestoreSeatParticipant(
      userId: map['userId'] ?? '',
      name: map['name'] ?? '',
      avatar: map['avatar'] ?? '',
      level: (map['level'] as num?)?.toInt() ?? 1,
      role: map['role'] ?? 'speaker',
      isMuted: map['isMuted'] ?? false,
      isSpeaking: map['isSpeaking'] ?? false,
      rentCoins: (map['rentCoins'] as num?)?.toInt(),
      contribution: (map['contribution'] as num?)?.toInt() ?? 0,
    );
  }

  FirestoreSeatParticipant copyWith({
    String? userId,
    String? name,
    String? avatar,
    int? level,
    String? role,
    bool? isMuted,
    bool? isSpeaking,
    int? rentCoins,
    int? contribution,
  }) {
    return FirestoreSeatParticipant(
      userId: userId ?? this.userId,
      name: name ?? this.name,
      avatar: avatar ?? this.avatar,
      level: level ?? this.level,
      role: role ?? this.role,
      isMuted: isMuted ?? this.isMuted,
      isSpeaking: isSpeaking ?? this.isSpeaking,
      rentCoins: rentCoins ?? this.rentCoins,
      contribution: contribution ?? this.contribution,
    );
  }
}

class FirestoreSeatModel {
  static const int posHostThrone = 1000;
  static const int posBossSeat = 1001;

  final int pos; // 1..12 or 1000 (Host) or 1001 (Boss)
  final FirestoreSeatStatus status;
  final bool isLocked;
  final bool isMutedByHost;
  final FirestoreSeatParticipant? participant;
  final DateTime? updatedAt;

  const FirestoreSeatModel({
    required this.pos,
    this.status = FirestoreSeatStatus.empty,
    this.isLocked = false,
    this.isMutedByHost = false,
    this.participant,
    this.updatedAt,
  });

  bool get isHostSeat => pos == posHostThrone;
  bool get isBossSeat => pos == posBossSeat;
  bool get isOccupied => status == FirestoreSeatStatus.occupied && participant != null;

  Map<String, dynamic> toMap() {
    return {
      'pos': pos,
      'status': status.name,
      'isLocked': isLocked,
      'isMutedByHost': isMutedByHost,
      'participant': participant?.toMap(),
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }

  factory FirestoreSeatModel.fromMap(Map<String, dynamic> map, int posNumber) {
    return FirestoreSeatModel(
      pos: (map['pos'] as num?)?.toInt() ?? posNumber,
      status: _parseStatus(map['status']),
      isLocked: map['isLocked'] ?? false,
      isMutedByHost: map['isMutedByHost'] ?? false,
      participant: map['participant'] != null
          ? FirestoreSeatParticipant.fromMap(Map<String, dynamic>.from(map['participant']))
          : null,
      updatedAt: (map['updatedAt'] as Timestamp?)?.toDate(),
    );
  }

  static FirestoreSeatStatus _parseStatus(dynamic s) {
    switch (s) {
      case 'occupied':
        return FirestoreSeatStatus.occupied;
      case 'locked':
        return FirestoreSeatStatus.locked;
      default:
        return FirestoreSeatStatus.empty;
    }
  }

  FirestoreSeatModel copyWith({
    int? pos,
    FirestoreSeatStatus? status,
    bool? isLocked,
    bool? isMutedByHost,
    FirestoreSeatParticipant? participant,
    DateTime? updatedAt,
  }) {
    return FirestoreSeatModel(
      pos: pos ?? this.pos,
      status: status ?? this.status,
      isLocked: isLocked ?? this.isLocked,
      isMutedByHost: isMutedByHost ?? this.isMutedByHost,
      participant: participant ?? this.participant,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class FirestoreRoomModel {
  final String roomId;
  final String title;
  final String hostId;
  final String hostName;
  final String hostAvatar;
  final int seatCapacity; // 8 or 12
  final String category;
  final int listenerCount;
  final String? country;
  final String? countryFlag;
  
  // Boss Seat Configuration
  final int bossRentCost;
  final String? bossId;
  final String? bossName;
  final String? bossAvatar;

  // PK Arena Status
  final bool isPkActive;
  final int bluePkScore;
  final int redPkScore;
  final DateTime? pkEndsAt;

  final DateTime? createdAt;
  final DateTime? updatedAt;

  const FirestoreRoomModel({
    required this.roomId,
    required this.title,
    required this.hostId,
    required this.hostName,
    required this.hostAvatar,
    this.seatCapacity = 12,
    this.category = 'Popular',
    this.listenerCount = 1,
    this.country,
    this.countryFlag,
    this.bossRentCost = 50000,
    this.bossId,
    this.bossName,
    this.bossAvatar,
    this.isPkActive = false,
    this.bluePkScore = 0,
    this.redPkScore = 0,
    this.pkEndsAt,
    this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'roomId': roomId,
      'title': title,
      'hostId': hostId,
      'hostName': hostName,
      'hostAvatar': hostAvatar,
      'seatCapacity': seatCapacity,
      'category': category,
      'listenerCount': listenerCount,
      'country': country,
      'countryFlag': countryFlag,
      'bossRentCost': bossRentCost,
      'bossId': bossId,
      'bossName': bossName,
      'bossAvatar': bossAvatar,
      'isPkActive': isPkActive,
      'bluePkScore': bluePkScore,
      'redPkScore': redPkScore,
      'pkEndsAt': pkEndsAt != null ? Timestamp.fromDate(pkEndsAt!) : null,
      'createdAt': createdAt != null ? Timestamp.fromDate(createdAt!) : FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }

  factory FirestoreRoomModel.fromFirestore(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data() ?? {};
    return FirestoreRoomModel(
      roomId: doc.id,
      title: data['title'] ?? 'MIZO Voice Party',
      hostId: data['hostId'] ?? '',
      hostName: data['hostName'] ?? 'Host',
      hostAvatar: data['hostAvatar'] ?? '',
      seatCapacity: (data['seatCapacity'] as num?)?.toInt() ?? 12,
      category: data['category'] ?? 'Popular',
      listenerCount: (data['listenerCount'] as num?)?.toInt() ?? 1,
      country: data['country'],
      countryFlag: data['countryFlag'],
      bossRentCost: (data['bossRentCost'] as num?)?.toInt() ?? 50000,
      bossId: data['bossId'],
      bossName: data['bossName'],
      bossAvatar: data['bossAvatar'],
      isPkActive: data['isPkActive'] ?? false,
      bluePkScore: (data['bluePkScore'] as num?)?.toInt() ?? 0,
      redPkScore: (data['redPkScore'] as num?)?.toInt() ?? 0,
      pkEndsAt: (data['pkEndsAt'] as Timestamp?)?.toDate(),
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
    );
  }
}
