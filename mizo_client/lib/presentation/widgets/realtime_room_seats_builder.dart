/// MIZO Realtime Room Seats Builder
/// Bridges Cloud Firestore Streams directly to the Luxury RoomSeatsGrid widget.
library;

import 'package:flutter/material.dart';
import '../../models/firestore_room_model.dart';
import '../../models/seat_model.dart';
import '../../core/services/firestore_room_service.dart';
import 'room_seats_grid.dart';

class RealtimeRoomSeatsBuilder extends StatelessWidget {
  final String roomId;
  final int seatCapacity;
  final FirestoreRoomService roomService;
  final FirestoreSeatParticipant currentUser;

  const RealtimeRoomSeatsBuilder({
    super.key,
    required this.roomId,
    this.seatCapacity = 12,
    required this.roomService,
    required this.currentUser,
  });

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<FirestoreSeatModel>>(
      stream: roomService.streamSeats(roomId),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Center(
            child: Text(
              'Firestore Error: ${snapshot.error}',
              style: const TextStyle(color: Colors.redAccent, fontSize: 12),
            ),
          );
        }

        if (!snapshot.hasData) {
          return const Center(
            child: CircularProgressIndicator(
              color: Color(0xFFFFD700),
              strokeWidth: 2,
            ),
          );
        }

        final seatDocs = snapshot.data!;

        // 1. Extract Host Throne (pos: 1000)
        final hostDoc = seatDocs.cast<FirestoreSeatModel?>().firstWhere(
              (s) => s?.pos == FirestoreSeatModel.posHostThrone,
              orElse: () => null,
            );

        // 2. Extract Boss Seat (pos: 1001)
        final bossDoc = seatDocs.cast<FirestoreSeatModel?>().firstWhere(
              (s) => s?.pos == FirestoreSeatModel.posBossSeat,
              orElse: () => null,
            );

        // 3. Extract Regular Seats (pos: 1..capacity)
        final regularSeats = List<SeatModel>.generate(seatCapacity, (index) {
          final seatPos = index + 1;
          final match = seatDocs.cast<FirestoreSeatModel?>().firstWhere(
                (s) => s?.pos == seatPos,
                orElse: () => null,
              );

          if (match == null || match.status == FirestoreSeatStatus.empty) {
            return SeatModel(
              index: seatPos,
              status: SeatStatus.empty,
              isLocked: match?.isLocked ?? false,
              isMutedByHost: match?.isMutedByHost ?? false,
            );
          }

          if (match.status == FirestoreSeatStatus.locked) {
            return SeatModel(
              index: seatPos,
              status: SeatStatus.locked,
              isLocked: true,
            );
          }

          final p = match.participant;
          return SeatModel(
            index: seatPos,
            status: SeatStatus.occupied,
            isLocked: match.isLocked,
            isMutedByHost: match.isMutedByHost,
            participant: p != null
                ? ParticipantModel(
                    userId: p.userId,
                    name: p.name,
                    avatarUrl: p.avatar,
                    role: p.role == 'vip' ? UserRole.vip : UserRole.speaker,
                    level: p.level,
                    isMuted: p.isMuted,
                    isSpeaking: p.isSpeaking,
                  )
                : null,
          );
        });

        return RoomSeatsGrid(
          seatCapacity: seatCapacity,
          hostName: hostDoc?.participant?.name ?? 'Host Queen',
          hostAvatar: hostDoc?.participant?.avatar ??
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          bossName: bossDoc?.participant?.name,
          bossAvatar: bossDoc?.participant?.avatar,
          bossRentCoins: bossDoc?.participant?.rentCoins ?? 50000,
          seats: regularSeats,
          onTakeSeat: (pos) async {
            final success = await roomService.takeSeat(
              roomId: roomId,
              pos: pos,
              participant: currentUser,
            );

            if (!context.mounted) return;
            if (success) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Mic No.$pos claimed successfully!'),
                  backgroundColor: const Color(0xFF00F5A0),
                ),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Seat is already occupied or locked!'),
                  backgroundColor: Color(0xFFEF4444),
                ),
              );
            }
          },
          onToggleLock: (pos) {
            final match = seatDocs.cast<FirestoreSeatModel?>().firstWhere(
                  (s) => s?.pos == pos,
                  orElse: () => null,
                );
            final newLockState = !(match?.isLocked ?? false);
            roomService.toggleSeatLock(
              roomId: roomId,
              pos: pos,
              lock: newLockState,
            );
          },
          onLockAll: (lock) {
            roomService.lockAllGuestSeats(
              roomId: roomId,
              capacity: seatCapacity,
              lock: lock,
            );
          },
          onToggleMute: (pos) {
            final match = seatDocs.cast<FirestoreSeatModel?>().firstWhere(
                  (s) => s?.pos == pos,
                  orElse: () => null,
                );
            final newMuteState = !(match?.isMutedByHost ?? false);
            roomService.toggleSeatMute(
              roomId: roomId,
              pos: pos,
              mute: newMuteState,
            );
          },
        );
      },
    );
  }
}
