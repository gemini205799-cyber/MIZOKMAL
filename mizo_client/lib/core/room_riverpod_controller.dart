/// MIZO Flutter Riverpod Room State Controller
/// Matches layout_live_room_content.xml layer architecture:
/// 1. Background layer (LiveBgView)
/// 2. Audio Seats Matrix (fl_microphone -> anchor_mic + boss_mic + mic_list)
/// 3. Chat & Bullet Stream (LiveBulletView)
/// 4. Full-screen Gift Animation Engine (LiveGiftNewView - PAG / SVGA / Lottie)
/// 5. Bottom Navigation & Audio Controls (ll_bottom)

import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:livekit_client/livekit_client.dart';
import '../models/habi_models.dart';

class RoomUiState {
  final bool isConnecting;
  final bool isConnected;
  final bool isMicMuted;
  final String? roomId;
  final RoomMic? roomMic;
  final List<String> chatBulletMessages;
  final GiftMsgJson? activeGiftAnimation;
  final Map<String, double> speakerLevels; // identity -> volume level (0.0 to 1.0)

  const RoomUiState({
    this.isConnecting = false,
    this.isConnected = false,
    this.isMicMuted = true,
    this.roomId,
    this.roomMic,
    this.chatBulletMessages = const [],
    this.activeGiftAnimation,
    this.speakerLevels = const {},
  });

  RoomUiState copyWith({
    bool? isConnecting,
    bool? isConnected,
    bool? isMicMuted,
    String? roomId,
    RoomMic? roomMic,
    List<String>? chatBulletMessages,
    GiftMsgJson? activeGiftAnimation,
    bool clearGiftAnimation = false,
    Map<String, double>? speakerLevels,
  }) {
    return RoomUiState(
      isConnecting: isConnecting ?? this.isConnecting,
      isConnected: isConnected ?? this.isConnected,
      isMicMuted: isMicMuted ?? this.isMicMuted,
      roomId: roomId ?? this.roomId,
      roomMic: roomMic ?? this.roomMic,
      chatBulletMessages: chatBulletMessages ?? this.chatBulletMessages,
      activeGiftAnimation: clearGiftAnimation ? null : (activeGiftAnimation ?? this.activeGiftAnimation),
      speakerLevels: speakerLevels ?? this.speakerLevels,
    );
  }
}

class RoomControllerNotifier extends StateNotifier<RoomUiState> {
  Room? _livekitRoom;
  EventsListener<RoomEvent>? _livekitListener;

  RoomControllerNotifier() : super(const RoomUiState());

  Future<void> joinRoom({
    required String sfuUrl,
    required String token,
    required String roomId,
    required MemberJson currentMember,
  }) async {
    state = state.copyWith(isConnecting: true, roomId: roomId);

    try {
      final roomOptions = RoomOptions(
        adaptiveStream: true,
        dynacast: true,
        defaultAudioPublishOptions: const AudioPublishOptions(
          audioBitrate: 64000,
          dtx: true,
        ),
      );

      _livekitRoom = Room(roomOptions: roomOptions);
      _livekitListener = _livekitRoom!.createListener();

      _livekitListener!
        ..on<ActiveSpeakersChangedEvent>((event) {
          final levels = <String, double>{};
          for (final sp in event.speakers) {
            levels[sp.identity] = sp.audioLevel;
          }
          state = state.copyWith(speakerLevels: levels);
        })
        ..on<RoomDisconnectedEvent>((_) {
          state = state.copyWith(isConnected: false);
        });

      await _livekitRoom!.connect(sfuUrl, token);

      // Initialize default RoomMic structure matching Habi
      final initialRoomMic = RoomMic(
        micList: List.generate(12, (index) => MicJson(pos: index + 1)),
        anchorMic: const MicJson(
          pos: 1000,
          member: MemberJson(
            id: 'host_01',
            nickname: 'Tanisha (Host)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            level: 26,
          ),
          closeStatus: 0,
        ),
        bossMic: const MicJson(pos: 1001),
        maxMicCnt: 12,
      );

      state = state.copyWith(
        isConnecting: false,
        isConnected: true,
        roomMic: initialRoomMic,
        chatBulletMessages: ['System: Connected to MIZO LiveKit SFU'],
      );
    } catch (e) {
      state = state.copyWith(isConnecting: false, isConnected: false);
    }
  }

  /// Atomic "On mic" request (Position 1..12 or 1001 Boss Seat)
  void onMicClaim(int targetPos, MemberJson user) {
    if (state.roomMic == null) return;

    final updatedList = state.roomMic!.micList.map((s) {
      if (s.pos == targetPos) {
        return s.copyWith(member: user, closeStatus: 0, closeSource: 'self');
      } else if (s.member?.id == user.id) {
        return s.copyWith(member: null);
      }
      return s;
    }).toList();

    state = state.copyWith(
      roomMic: RoomMic(
        micList: updatedList,
        anchorMic: state.roomMic!.anchorMic,
        bossMic: targetPos == 1001 ? state.roomMic!.bossMic?.copyWith(member: user) : state.roomMic!.bossMic,
      ),
      isMicMuted: false,
    );

    // Unmute mic on LiveKit track
    _livekitRoom?.localParticipant?.setMicrophoneEnabled(true);
  }

  /// Toggle Microphone Mute
  Future<void> toggleMic() async {
    final nextMute = !state.isMicMuted;
    await _livekitRoom?.localParticipant?.setMicrophoneEnabled(!nextMute);
    state = state.copyWith(isMicMuted: nextMute);
  }

  /// Trigger Gift Celebration Animation (PAG / SVGA / Lottie)
  void triggerGiftPacket(GiftMsgJson giftMsg) {
    state = state.copyWith(
      activeGiftAnimation: giftMsg,
      chatBulletMessages: [
        ...state.chatBulletMessages,
        '🎁 ${giftMsg.member.nickname} sent ${giftMsg.cnt}x ${giftMsg.name} to ${giftMsg.toMembers.firstOrNull?.nickname ?? "Room"}',
      ],
    );

    // Auto clear full-screen overlay after 4 seconds
    Timer(const Duration(seconds: 4), () {
      state = state.copyWith(clearGiftAnimation: true);
    });
  }

  @override
  void dispose() {
    _livekitListener?.dispose();
    _livekitRoom?.disconnect();
    _livekitRoom?.dispose();
    super.dispose();
  }
}

final roomControllerProvider =
    StateNotifierProvider<RoomControllerNotifier, RoomUiState>((ref) {
  return RoomControllerNotifier();
});
