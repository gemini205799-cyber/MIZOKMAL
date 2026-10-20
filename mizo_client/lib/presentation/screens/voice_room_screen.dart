/// MIZO Full Voice Room Screen (Flutter Core)
/// Replicates the live voice entertainment room matching the user's uploaded screenshot.
///
/// Base Reference: https://github.com/gemini205799-cyber/yari

import 'package:flutter/material.dart';
import '../../models/seat_model.dart';
import '../../core/livekit_room_controller.dart';
import '../widgets/room_seats_grid.dart';
import '../widgets/gift_sheet_dialog.dart';

class VoiceRoomScreen extends StatefulWidget {
  final String roomId;
  final String roomTitle;
  final String hostName;
  final String hostAvatar;
  final int userCoins;

  const VoiceRoomScreen({
    super.key,
    this.roomId = '16701257',
    this.roomTitle = '《MERI JAAN》',
    this.hostName = 'Tanisha',
    this.hostAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    this.userCoins = 12000,
  });

  @override
  State<VoiceRoomScreen> createState() => _VoiceRoomScreenState();
}

class _VoiceRoomScreenState extends State<VoiceRoomScreen> {
  late final LiveKitRoomController _livekitController;
  final List<SeatModel> _seats = [];
  final List<String> _chatMessages = [];
  bool _isRoomMinimized = false;
  int _crystalBallCoins = 345;
  String? _activeGiftAnimation;

  @override
  void initState() {
    super.initState();
    _livekitController = LiveKitRoomController();
    _initSeats();
    _connectLiveKit();
    _seedChat();
  }

  void _initSeats() {
    for (int i = 1; i <= 12; i++) {
      _seats.add(SeatModel(index: i));
    }
  }

  Future<void> _connectLiveKit() async {
    // In production, token is retrieved from /api/livekit/token
    await _livekitController.joinRoom(
      serverUrl: 'wss://livekit.mizo.live',
      token: 'sample_jwt_token',
      roomId: widget.roomId,
      identity: 'user_${DateTime.now().millisecondsSinceEpoch}',
    );
  }

  void _seedChat() {
    _chatMessages.addAll([
      'System: Welcome to MIZO Voice Room. Maintain respect.',
      'Rohan VIP: Hey everyone! Welcome to the stage 🎵',
      'Zara Queen: Sent 🌹 Eternal Rose to Host',
    ]);
  }

  void _handleTakeSeat(int seatIndex) {
    setState(() {
      final index = seatIndex - 1;
      _seats[index] = _seats[index].copyWith(
        status: SeatStatus.occupied,
        participant: const ParticipantModel(
          userId: 'usr_me',
          name: 'Me',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: UserRole.speaker,
          level: 5,
          isMuted: false,
          isSpeaking: true,
        ),
      );
    });
    _livekitController.setMicrophoneMute(false);
  }

  void _handleToggleLock(int seatIndex) {
    setState(() {
      final index = seatIndex - 1;
      final current = _seats[index];
      _seats[index] = current.copyWith(
        isLocked: !current.isLocked,
        status: !current.isLocked ? SeatStatus.locked : SeatStatus.empty,
      );
    });
  }

  void _handleLockAll(bool lock) {
    setState(() {
      for (int i = 0; i < _seats.length; i++) {
        _seats[i] = _seats[i].copyWith(
          isLocked: lock,
          status: lock && !_seats[i].isOccupied ? SeatStatus.locked : _seats[i].status,
        );
      }
    });
  }

  void _handleToggleMute(int seatIndex) {
    setState(() {
      final index = seatIndex - 1;
      _seats[index] = _seats[index].copyWith(
        isMutedByHost: !_seats[index].isMutedByHost,
      );
    });
  }

  void _openGiftSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => GiftSheetDialog(
        userCoins: widget.userCoins,
        receiverName: widget.hostName,
        onSendGift: (gift, combo) {
          setState(() {
            _activeGiftAnimation = gift.name;
            _chatMessages.add('🎁 Me sent $combo x ${gift.name} to ${widget.hostName}!');
          });
          // Clear animation after 4 seconds
          Future.delayed(const Duration(seconds: 4), () {
            if (mounted) setState(() => _activeGiftAnimation = null);
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isRoomMinimized) {
      return _buildFloatingMiniPlayer();
    }

    return Scaffold(
      body: Stack(
        children: [
          // Background Palace / Romantic Wallpaper (matches screenshot)
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF6B21A8), // Deep purple
                    Color(0xFF9F1239), // Rose wine
                    Color(0xFF881337), // Crimson
                  ],
                ),
              ),
              child: Opacity(
                opacity: 0.25,
                child: Image.network(
                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                // 1. Room Top Bar
                _buildTopBar(),

                // 2. Host Throne & Crystal Ball
                _buildHostThroneSection(),

                const SizedBox(height: 12),

                // 3. 12 Seats Matrix
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        RoomSeatsGrid(
                          seats: _seats,
                          capacity: 12,
                          livekitController: _livekitController,
                          onTakeSeat: _handleTakeSeat,
                          onToggleLock: _handleToggleLock,
                          onLockAll: _handleLockAll,
                          onToggleMute: _handleToggleMute,
                        ),
                        const SizedBox(height: 16),
                        // Live Chat Stream
                        _buildChatStream(),
                      ],
                    ),
                  ),
                ),

                // 4. Bottom Action Bar
                _buildBottomActionBar(),
              ],
            ),
          ),

          // 5. Full-Screen Gift Overlay Animation (SVGA / Lottie simulation)
          if (_activeGiftAnimation != null)
            _buildGiftCelebrationOverlay(),
        ],
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        children: [
          // Host Avatar & Title Badge
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              widget.hostAvatar,
              width: 38,
              height: 38,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    widget.roomTitle,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text('26', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              Text(
                'ID: ${widget.roomId} · 👤 142 · 📶 42ms',
                style: const TextStyle(color: Colors.white70, fontSize: 11),
              ),
            ],
          ),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.settings, color: Colors.white),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.share, color: Colors.white),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.power_settings_new, color: Colors.white),
            onPressed: () => setState(() => _isRoomMinimized = true),
          ),
        ],
      ),
    );
  }

  Widget _buildHostThroneSection() {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            // Gold floral heart frame
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFFBBF24), width: 3),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFF59E0B).withOpacity(0.5),
                    blurRadius: 16,
                  ),
                ],
              ),
              child: ClipOval(
                child: Image.network(widget.hostAvatar, fit: BoxFit.cover),
              ),
            ),
            // Lv.6 crown badge on top
            Positioned(
              top: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFFDC2626), Color(0xFFB91C1C)]),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text('Lv.6 👑', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ),
            // Floating crystal ball on right (+345)
            Positioned(
              right: -60,
              child: GestureDetector(
                onTap: () {
                  setState(() => _crystalBallCoins += 10);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.purple.shade900.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.purpleAccent),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('🔮', style: TextStyle(fontSize: 14)),
                      const SizedBox(width: 4),
                      Text('+${_crystalBallCoins}', style: const TextStyle(color: Color(0xFFFBBF24), fontWeight: FontWeight.bold, fontSize: 11)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          widget.hostName,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ],
    );
  }

  Widget _buildChatStream() {
    return Container(
      height: 120,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.builder(
        reverse: true,
        itemCount: _chatMessages.length,
        itemBuilder: (context, index) {
          final msg = _chatMessages[_chatMessages.length - 1 - index];
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 2.0),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.4),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                msg,
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildBottomActionBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.6),
      ),
      child: Row(
        children: [
          // Chat input bubble
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Row(
                children: [
                  Icon(Icons.chat_bubble_outline, color: Colors.white70, size: 16),
                  SizedBox(width: 6),
                  Text('Say something...', style: TextStyle(color: Colors.white54, fontSize: 12)),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Mic Toggle
          IconButton(
            icon: Icon(
              _livekitController.isMicMuted ? Icons.mic_off : Icons.mic,
              color: _livekitController.isMicMuted ? Colors.redAccent : Colors.greenAccent,
            ),
            onPressed: () => _livekitController.toggleMicrophone(),
          ),

          // Raise Hand / Request Seat
          IconButton(
            icon: const Icon(Icons.pan_tool_outlined, color: Colors.amberAccent),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Hand raised! Host notified.')),
              );
            },
          ),

          // Gift Box Button (Glowing)
          GestureDetector(
            onTap: _openGiftSheet,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(colors: [Color(0xFFEC4899), Color(0xFFF43F5E)]),
              ),
              child: const Icon(Icons.card_giftcard, color: Colors.white, size: 22),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFloatingMiniPlayer() {
    return Positioned(
      bottom: 20,
      left: 16,
      right: 16,
      child: Material(
        elevation: 12,
        borderRadius: BorderRadius.circular(24),
        color: const Color(0xFF1E293B),
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: () => setState(() => _isRoomMinimized = false),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(widget.hostAvatar, width: 36, height: 36, fit: BoxFit.cover),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(widget.roomTitle, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                      const Text('Playing audio in background...', style: TextStyle(color: Colors.greenAccent, fontSize: 11)),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.fullscreen, color: Colors.white),
                  onPressed: () => setState(() => _isRoomMinimized = false),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white54),
                  onPressed: () => Navigator.of(context).maybePop(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGiftCelebrationOverlay() {
    return Positioned.fill(
      child: Container(
        color: Colors.black.withOpacity(0.7),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('🎉', style: TextStyle(fontSize: 80)),
              Text(
                '$_activeGiftAnimation SENT!',
                style: const TextStyle(
                  color: Color(0xFFFBBF24),
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Full Screen Lottie / SVGA Rendered to All Room Participants',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _livekitController.dispose();
    super.dispose();
  }
}
