/// MIZO LiveKit SFU Room Controller
/// Manages WebRTC audio sessions, track subscriptions, and active speaker listeners.
///
/// Reference:
/// - https://github.com/livekit/client-sdk-flutter
/// - https://github.com/gemini205799-cyber/yari

import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:livekit_client/livekit_client.dart';
import '../models/seat_model.dart';

class LiveKitRoomController extends ChangeNotifier {
  Room? _room;
  EventsListener<RoomEvent>? _listener;
  
  bool _isConnecting = false;
  bool _isConnected = false;
  bool _isMicMuted = true;
  String? _activeRoomId;
  String? _currentIdentity;

  // Active speaker IDs mapped to their audio level (0.0 to 1.0)
  final Map<String, double> _activeSpeakers = {};

  bool get isConnecting => _isConnecting;
  bool get isConnected => _isConnected;
  bool get isMicMuted => _isMicMuted;
  String? get activeRoomId => _activeRoomId;
  Room? get room => _room;
  Map<String, double> get activeSpeakers => _activeSpeakers;

  bool isSpeaking(String identity) => (_activeSpeakers[identity] ?? 0.0) > 0.15;
  double getAudioLevel(String identity) => _activeSpeakers[identity] ?? 0.0;

  /// Connect to LiveKit SFU Audio Room
  Future<bool> joinRoom({
    required String serverUrl,
    required String token,
    required String roomId,
    required String identity,
  }) async {
    try {
      _isConnecting = true;
      _activeRoomId = roomId;
      _currentIdentity = identity;
      notifyListeners();

      // Configure audio-optimized room options
      final roomOptions = RoomOptions(
        adaptiveStream: true,
        dynacast: true,
        defaultAudioPublishOptions: const AudioPublishOptions(
          audioBitrate: 64000,
          dtx: true,
          stopMicTrackOnMute: false,
        ),
      );

      _room = Room(roomOptions: roomOptions);
      _listener = _room!.createListener();

      _setupRoomEventListeners();

      // Connect to LiveKit SFU node
      await _room!.connect(serverUrl, token);

      _isConnected = true;
      _isConnecting = false;
      notifyListeners();

      debugPrint('[LiveKit] Successfully connected to room: $roomId as $identity');
      return true;
    } catch (e) {
      _isConnecting = false;
      _isConnected = false;
      notifyListeners();
      debugPrint('[LiveKit] Connection error: $e');
      return false;
    }
  }

  /// Setup WebRTC event stream listeners
  void _setupRoomEventListeners() {
    if (_listener == null) return;

    _listener!
      ..on<RoomDisconnectedEvent>((event) {
        debugPrint('[LiveKit] Room disconnected: ${event.reason}');
        _isConnected = false;
        _activeSpeakers.clear();
        notifyListeners();
      })
      ..on<ParticipantConnectedEvent>((event) {
        debugPrint('[LiveKit] Participant connected: ${event.participant.identity}');
        notifyListeners();
      })
      ..on<ParticipantDisconnectedEvent>((event) {
        debugPrint('[LiveKit] Participant disconnected: ${event.participant.identity}');
        _activeSpeakers.remove(event.participant.identity);
        notifyListeners();
      })
      ..on<ActiveSpeakersChangedEvent>((event) {
        // High-frequency speaking energy detection for avatar glow rings
        _activeSpeakers.clear();
        for (final speaker in event.speakers) {
          // LiveKit supplies audioLevel between 0.0 and 1.0
          _activeSpeakers[speaker.identity] = speaker.audioLevel;
        }
        notifyListeners();
      })
      ..on<TrackSubscribedEvent>((event) {
        if (event.track is AudioTrack) {
          debugPrint('[LiveKit] Audio track subscribed: ${event.track.sid}');
        }
      })
      ..on<TrackMutedEvent>((event) {
        notifyListeners();
      })
      ..on<TrackUnmutedEvent>((event) {
        notifyListeners();
      });
  }

  /// Toggle local microphone publishing
  Future<void> toggleMicrophone() async {
    if (_room == null || _room!.localParticipant == null) return;

    try {
      final shouldEnable = _isMicMuted;
      await _room!.localParticipant!.setMicrophoneEnabled(shouldEnable);
      _isMicMuted = !shouldEnable;
      notifyListeners();
    } catch (e) {
      debugPrint('[LiveKit] Toggle mic error: $e');
    }
  }

  /// Publish or unpublish audio when host grants/revokes seat
  Future<void> setMicrophoneMute(bool muted) async {
    if (_room == null || _room!.localParticipant == null) return;

    try {
      await _room!.localParticipant!.setMicrophoneEnabled(!muted);
      _isMicMuted = muted;
      notifyListeners();
    } catch (e) {
      debugPrint('[LiveKit] Set mic mute error: $e');
    }
  }

  /// Disconnect and clean up resources
  Future<void> leaveRoom() async {
    try {
      await _listener?.dispose();
      await _room?.disconnect();
      await _room?.dispose();
    } catch (e) {
      debugPrint('[LiveKit] Leave room error: $e');
    } finally {
      _room = null;
      _listener = null;
      _isConnected = false;
      _isConnecting = false;
      _activeSpeakers.clear();
      _activeRoomId = null;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    leaveRoom();
    super.dispose();
  }
}
