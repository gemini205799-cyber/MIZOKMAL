/// MIZO Full Live Voice Entertainment Room Screen
/// Luxury Royal Cyberpunk Theme Skinning (Habi & Yari Parity)
///
/// Features:
/// 1. Deep Royal Obsidian canvas: [#0D0B18 -> #160D29 -> #08060E] with atmospheric lighting
/// 2. Header Bar with Royal Gold Bezel, Room ID copy, and member counter
/// 3. Cyberpunk Energy Beam PK Battle Arena with clash spark & digital neon ticker
/// 4. Center Voice Seats Matrix (Host Throne + Boss Mic + 8/12 Seats Grid)
/// 5. Translucent Bullet Chat with Tiered Level Badges (Bronze, Silver, Gold, SVIP) & High-Tier Gift Sparkle Tickers
/// 6. Bottom User Action Bar: Cyber Emerald mic toggle, Neon Velvet Pink Gift CTA, In-ear monitor
/// 7. Topmost Non-Blocking Hybrid Gift Animation Overlay (PAG / SVGA / Audio Sync)
library;

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../models/habi_models.dart';
import '../../core/gift_queue_manager.dart';
import '../../core/livekit_room_controller.dart';
import '../widgets/room_seats_grid.dart';
import '../widgets/gift_animation_overlay.dart';
import '../widgets/gift_selection_bottom_sheet.dart';

class VoiceRoomScreen extends StatefulWidget {
  final VoiceRoomSession roomSession;
  final Function(VoiceRoomSession)? onMinimize;

  const VoiceRoomScreen({
    super.key,
    required this.roomSession,
    this.onMinimize,
  });

  @override
  State<VoiceRoomScreen> createState() => _VoiceRoomScreenState();
}

class _VoiceRoomScreenState extends State<VoiceRoomScreen>
    with TickerProviderStateMixin {
  late final GiftQueueManager _giftQueueManager;
  late final LiveKitRoomController _livekitController;

  // Animation controller for PK clash point spark
  late final AnimationController _pkClashController;

  // Animation controller for gift button pulse
  late final AnimationController _giftPulseController;

  bool _isMicMuted = false;
  bool _isEarMonitorOn = false;
  bool _isFollowingHost = false;
  int _userCoins = 148000;

  // PK Battle simulation
  int _pkScoreBlue = 18400;
  int _pkScoreRed = 16200;
  int _pkSecondsRemaining = 175;
  Timer? _pkTimer;

  // Active room messages
  final List<Map<String, dynamic>> _messages = [
    {
      'type': 'system',
      'text': '👑 Welcome to MIZO Royal Stage! Respect performers & enjoy gifting.',
    },
    {
      'type': 'chat',
      'sender': 'Zara Queen',
      'avatar':
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      'level': 42,
      'text': 'Good evening everyone! Excited for the PK match 🔥',
    },
    {
      'type': 'gift',
      'sender': 'Sheikh Hamdan',
      'giftName': 'Gold McLaren P1',
      'count': 1,
      'cost': 18000,
      'receiver': 'Tanisha (Host)',
    },
    {
      'type': 'chat',
      'sender': 'Rohan VIP',
      'avatar':
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'level': 85,
      'text': 'Dropping support for the host stage right now! 💎',
    },
  ];

  final TextEditingController _chatController = TextEditingController();
  final ScrollController _chatScrollController = ScrollController();

  // Catalog of gifts matching Habi DTOs
  final List<GiftJson> _catalogGifts = [
    const GiftJson(
      id: 'gift_super_car',
      name: 'Gold McLaren P1',
      cost: 18000,
      giftType: 2,
      sound: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
      svgaAvatarKey: 'avatar_driver_seat',
      pagUrl: 'https://mizo-assets.live/pag/mclaren_p1.pag',
      isCombo: false,
    ),
    const GiftJson(
      id: 'gift_golden_bike',
      name: 'Cruiser Golden Bike',
      cost: 12000,
      giftType: 2,
      sound: 'https://assets.mixkit.co/active_storage/sfx/2875/2875-preview.mp3',
      svgaAvatarKey: 'avatar_rider_seat',
      isCombo: false,
    ),
    const GiftJson(
      id: 'gift_lucky_wheel',
      name: 'Sultan Lucky Wheel',
      cost: 1000,
      giftType: 3,
      sound: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
      svgaAvatarKey: 'avatar_lucky_winner',
      pagUrl: 'https://mizo-assets.live/pag/lucky_wheel.pag',
      isCombo: true,
      luckyScore: LuckyScore(luckyRate: 0.15, jackpotPool: 250000),
    ),
    const GiftJson(
      id: 'gift_space_rocket',
      name: 'Falcon Galactic Rocket',
      cost: 50000,
      giftType: 4,
      sound: 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
      svgaAvatarKey: 'avatar_astronaut',
      pagUrl: 'https://mizo-assets.live/pag/falcon_rocket.pag',
      isCombo: false,
      world: true,
    ),
    const GiftJson(
      id: 'gift_red_rose',
      name: 'Eternal Velvet Rose',
      cost: 100,
      giftType: 1,
      sound: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
      isCombo: true,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _giftQueueManager = GiftQueueManager();
    _livekitController = LiveKitRoomController();

    // Connect to room WebRTC SFU
    _livekitController.connect(
      url: 'wss://livekit.mizo-social.com',
      token: 'jwt_mock_client_token',
      roomName: widget.roomSession.roomId,
    );

    _pkClashController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..repeat(reverse: true);

    _giftPulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    // PK battle countdown timer
    _pkTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_pkSecondsRemaining > 0) {
        setState(() => _pkSecondsRemaining--);
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _pkTimer?.cancel();
    _pkClashController.dispose();
    _giftPulseController.dispose();
    _chatController.dispose();
    _chatScrollController.dispose();
    _giftQueueManager.dispose();
    _livekitController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        'type': 'chat',
        'sender': 'Eyad Trader (Me)',
        'avatar':
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        'level': 88,
        'text': text,
      });
    });

    _chatController.clear();
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_chatScrollController.hasClients) {
        _chatScrollController.animateTo(
          _chatScrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _openGiftBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) {
        return GiftSelectionBottomSheet(
          userCoins: _userCoins,
          availableGifts: _catalogGifts,
          onMicMembers: [
            MemberJson(
              id: 'usr_tanisha_01',
              nickname: widget.roomSession.hostName,
              avatar: widget.roomSession.hostAvatar,
              level: 66,
            ),
            const MemberJson(
              id: 'usr_boss_01',
              nickname: 'Sultan (Boss)',
              avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              level: 88,
            ),
          ],
          onSend: (gift, combo, targets) {
            final totalCost =
                gift.cost * combo * (targets.isEmpty ? 1 : targets.length);
            if (_userCoins < totalCost) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Insufficient coin balance! Please recharge.'),
                  backgroundColor: Color(0xFFEF4444),
                ),
              );
              return;
            }

            setState(() {
              _userCoins -= totalCost;
            });

            // Lucky cash-back calculation
            bool isJackpot = false;
            int? coinsWon;
            if (gift.giftType == 3) {
              final roll = DateTime.now().millisecond % 100;
              if (roll < 6) {
                isJackpot = true;
                coinsWon = gift.cost * combo * 50; // 50x Mega win
                setState(() => _userCoins += coinsWon!);
              } else if (roll < 25) {
                coinsWon = gift.cost * combo * 2;
                setState(() => _userCoins += coinsWon!);
              }
            }

            // Construct Habi GiftMsgJson
            final giftMsg = GiftMsgJson(
              id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
              member: const MemberJson(
                id: 'usr_me',
                nickname: 'Eyad Trader',
                avatar:
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                level: 88,
              ),
              toMembers: [
                MemberJson(
                  id: 'usr_tanisha_01',
                  nickname: widget.roomSession.hostName,
                  avatar: widget.roomSession.hostAvatar,
                  level: 66,
                ),
              ],
              giftId: gift.id,
              name: gift.name,
              cnt: combo,
              cost: totalCost,
              anchorIncome: (totalCost * 0.7).toInt(),
              sound: gift.sound,
              svgaAvatarKey: gift.svgaAvatarKey,
              pagUrl: gift.pagUrl,
              type: gift.giftType,
              lucky: coinsWon != null,
              totalCashBack: coinsWon,
              isBlindCriticalHit: isJackpot,
            );

            // Feed to Queue Manager
            _giftQueueManager.handleIncomingGift(giftMsg);

            // Add to chat feed
            setState(() {
              _messages.add({
                'type': 'gift',
                'sender': 'Eyad Trader',
                'giftName': gift.name,
                'count': combo,
                'cost': totalCost,
                'receiver': widget.roomSession.hostName,
              });
              if (isJackpot) {
                _messages.add({
                  'type': 'jackpot',
                  'sender': 'Eyad Trader',
                  'coinsWon': coinsWon,
                });
              }
            });
          },
        );
      },
    );
  }

  void _showExitConfirmation() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0D0B18),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: const Color(0xFFFFD700).withOpacity(0.3),
            width: 1,
          ),
        ),
        title: const Row(
          children: [
            Text('👑', style: TextStyle(fontSize: 18)),
            SizedBox(width: 8),
            Text(
              'Leave Voice Room?',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        content: const Text(
          'You can minimize the room to keep listening with background audio.',
          style: TextStyle(color: Colors.white70, fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              if (widget.onMinimize != null) {
                widget.onMinimize!(widget.roomSession);
              }
              Navigator.pop(context);
            },
            child: const Text(
              'Minimize',
              style: TextStyle(
                color: Color(0xFF00F5A0),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pop(context);
            },
            child: const Text('Leave Room'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF08060E),
      body: Stack(
        children: [
          // 1. Deep Royal Obsidian Multi-Stop Gradient Canvas
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFF0D0B18), // Deep Obsidian Purple
                  Color(0xFF160D29), // Royal Velvet Indigo
                  Color(0xFF08060E), // Abyss Black
                ],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                stops: [0.0, 0.45, 1.0],
              ),
            ),
          ),

          // Ambient Lighting Scrims (Gold & Purple Radial Glows)
          Positioned(
            top: -60,
            left: -40,
            child: Container(
              width: 240,
              height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFFFFD700).withOpacity(0.12),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: 140,
            right: -60,
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFFFF2E93).withOpacity(0.09),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // 2. Safe Area Content Layer
          SafeArea(
            child: Column(
              children: [
                // Top Header Bar
                _buildLuxuryHeaderBar(),

                // PK Battle Arena (Cyberpunk Energy Beam & Monospace Glass Pill)
                _buildCyberpunkPkArena(),

                // Center Seat Matrix (Host Throne + Boss Mic + 8/12 Seats Grid)
                Expanded(
                  flex: 5,
                  child: RoomSeatsGrid(
                    seatCapacity: widget.roomSession.seatCapacity,
                    hostName: widget.roomSession.hostName,
                    hostAvatar: widget.roomSession.hostAvatar,
                    bossName: 'Sultan (VIP)',
                    bossRentCoins: 50000,
                    livekitController: _livekitController,
                    onSeatTap: (pos) {
                      // Handled by luxury sheet inside widget
                    },
                  ),
                ),

                // Translucent Bullet Chat with Tiered Badges & Gift Sparkle Banners
                Expanded(
                  flex: 3,
                  child: _buildLuxuryChatAndBulletSection(),
                ),

                // Bottom User Action Bar
                _buildLuxuryBottomActionBar(),
              ],
            ),
          ),

          // 3. Topmost Non-Blocking Hybrid Gift Animation Overlay (PAG & SVGA)
          Positioned.fill(
            child: GiftAnimationOverlay(
              queueManager: _giftQueueManager,
            ),
          ),
        ],
      ),
    );
  }

  /// Header Bar with Royal Gold Bezel, Mono Room ID, and Member Counter
  Widget _buildLuxuryHeaderBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
      child: Row(
        children: [
          // Host Avatar with Royal Gold / Velvet Pink Bezel & Follow CTA
          Container(
            padding: const EdgeInsets.all(2.5),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const SweepGradient(
                colors: [
                  Color(0xFFFFD700), // Gold
                  Color(0xFFFF2E93), // Pink
                  Color(0xFFFFA500), // Orange
                  Color(0xFFFFD700),
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFFD700).withOpacity(0.4),
                  blurRadius: 8,
                ),
              ],
            ),
            child: CircleAvatar(
              radius: 17,
              backgroundImage: NetworkImage(widget.roomSession.hostAvatar),
            ),
          ),
          const SizedBox(width: 8),

          // Title & Monospace Room ID
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        widget.roomSession.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          fontSize: 13,
                          letterSpacing: 0.2,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 6),
                    GestureDetector(
                      onTap: () =>
                          setState(() => _isFollowingHost = !_isFollowingHost),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          gradient: _isFollowingHost
                              ? null
                              : const LinearGradient(
                                  colors: [
                                    Color(0xFFFF2E93),
                                    Color(0xFFFF5376)
                                  ],
                                ),
                          color: _isFollowingHost
                              ? Colors.white.withOpacity(0.15)
                              : null,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: _isFollowingHost
                                ? Colors.white30
                                : const Color(0xFFFF2E93).withOpacity(0.5),
                          ),
                        ),
                        child: Text(
                          _isFollowingHost ? 'Joined' : '+ Follow',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 8.5,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 1),
                GestureDetector(
                  onTap: () {
                    Clipboard.setData(
                        ClipboardData(text: widget.roomSession.roomId));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                            'Copied Room ID: ${widget.roomSession.roomId}'),
                        backgroundColor: const Color(0xFF160D29),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'ID: ${widget.roomSession.roomId}',
                        style: const TextStyle(
                          color: Color(0xFFFFD700),
                          fontSize: 10,
                          fontFamily: 'monospace',
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.copy_rounded,
                          color: Colors.white54, size: 10),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Online member reels + Minimize + Exit
          Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                decoration: BoxDecoration(
                  color: const Color(0xFF160D29).withOpacity(0.7),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFFFFD700).withOpacity(0.3),
                    width: 0.8,
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.headphones,
                        color: Color(0xFFFFD700), size: 11),
                    const SizedBox(width: 4),
                    Text(
                      '${widget.roomSession.listenerCount}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              GestureDetector(
                onTap: () {
                  if (widget.onMinimize != null) {
                    widget.onMinimize!(widget.roomSession);
                  }
                  Navigator.pop(context);
                },
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.08),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white12),
                  ),
                  child: const Icon(Icons.minimize_rounded,
                      color: Colors.white70, size: 15),
                ),
              ),
              const SizedBox(width: 6),
              GestureDetector(
                onTap: _showExitConfirmation,
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.08),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white12),
                  ),
                  child: const Icon(Icons.close_rounded,
                      color: Colors.white70, size: 15),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Cyberpunk Energy Beam PK Arena with Clash Spark & Monospace Digital Neon Ticker
  Widget _buildCyberpunkPkArena() {
    final minutes = _pkSecondsRemaining ~/ 60;
    final seconds = _pkSecondsRemaining % 60;
    final timeStr =
        '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';

    final totalScore = (_pkScoreBlue + _pkScoreRed).clamp(1, 9999999);
    final blueRatio = (_pkScoreBlue / totalScore).clamp(0.1, 0.9);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0D0B18).withOpacity(0.85),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFFFD700).withOpacity(0.25),
          width: 0.8,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7C3AED).withOpacity(0.15),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header of PK: Title vs Countdown Pill
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Text('⚔️', style: TextStyle(fontSize: 12)),
                  SizedBox(width: 4),
                  Text(
                    'PK BATTLE ARENA',
                    style: TextStyle(
                      color: Color(0xFFFFD700),
                      fontWeight: FontWeight.w900,
                      fontSize: 10.5,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),

              // Countdown Clock: Monospace digital neon ticker inside a translucent glass pill
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                decoration: BoxDecoration(
                  color: const Color(0xFF160D29),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFF00F5A0).withOpacity(0.7),
                    width: 0.9,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF00F5A0).withOpacity(0.35),
                      blurRadius: 6,
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.timer_outlined,
                        color: Color(0xFF00F5A0), size: 10),
                    const SizedBox(width: 4),
                    Text(
                      timeStr,
                      style: const TextStyle(
                        color: Color(0xFF00F5A0),
                        fontSize: 10.5,
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Cyberpunk Energy Beam Progress Bar (Cyan Neon vs Crimson Flame)
          Stack(
            alignment: Alignment.center,
            children: [
              // Energy Beam Container
              Container(
                height: 10,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.5),
                      blurRadius: 4,
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: Row(
                    children: [
                      // Cyan Neon Beam (Blue team)
                      Expanded(
                        flex: (blueRatio * 1000).toInt(),
                        child: Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Color(0xFF00E5FF), // Cyan Neon
                                Color(0xFF0284C7),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Crimson Flame Beam (Red team)
                      Expanded(
                        flex: ((1 - blueRatio) * 1000).toInt(),
                        child: Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Color(0xFFBE123C),
                                Color(0xFFFF2E93), // Crimson Flame
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Glowing Spark Particle at Clash Point
              AnimatedBuilder(
                animation: _pkClashController,
                builder: (context, child) {
                  final sparkScale = 1.0 + (_pkClashController.value * 0.4);
                  return Align(
                    alignment: Alignment((blueRatio * 2) - 1.0, 0),
                    child: Transform.scale(
                      scale: sparkScale,
                      child: Container(
                        width: 14,
                        height: 14,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFFFD700).withOpacity(0.9),
                              blurRadius: 10,
                              spreadRadius: 2,
                            ),
                            BoxShadow(
                              color: const Color(0xFF00E5FF).withOpacity(0.8),
                              blurRadius: 12,
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.bolt,
                            size: 10,
                            color: Color(0xFF0D0B18),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),

          const SizedBox(height: 4),

          // Scores Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '💙 $_pkScoreBlue',
                style: const TextStyle(
                  color: Color(0xFF00E5FF),
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'monospace',
                ),
              ),
              const Text(
                'TARGET 25,000 PTS',
                style: TextStyle(
                  color: Colors.white38,
                  fontSize: 8.5,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
              Text(
                '$_pkScoreRed 💖',
                style: const TextStyle(
                  color: Color(0xFFFF2E93),
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'monospace',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Translucent Bullet Chat with Tiered Level Badges & Luxury Sparkle Banners
  Widget _buildLuxuryChatAndBulletSection() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      child: ShaderMask(
        shaderCallback: (Rect bounds) {
          return const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.transparent, Colors.white, Colors.white],
            stops: [0.0, 0.12, 1.0],
          ).createShader(bounds);
        },
        blendMode: BlendMode.dstIn,
        child: ListView.builder(
          controller: _chatScrollController,
          itemCount: _messages.length,
          itemBuilder: (context, index) {
            final msg = _messages[index];

            // 1. System Notice
            if (msg['type'] == 'system') {
              return Container(
                margin: const EdgeInsets.only(bottom: 5),
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF160D29).withOpacity(0.6),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFFFFD700).withOpacity(0.3),
                    width: 0.7,
                  ),
                ),
                child: Text(
                  msg['text'],
                  style: const TextStyle(
                    color: Color(0xFFFFD700),
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              );
            }

            // 2. High-Tier Gift Announcement (Full-width translucent banner with gold gradient border & particle sparkle)
            if (msg['type'] == 'gift') {
              return Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF7C3AED).withOpacity(0.45),
                      const Color(0xFFFF2E93).withOpacity(0.45),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: const Color(0xFFFFD700).withOpacity(0.7),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFFD700).withOpacity(0.18),
                      blurRadius: 10,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Text('✨🎁✨', style: TextStyle(fontSize: 12)),
                    const SizedBox(width: 6),
                    Expanded(
                      child: RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: '${msg['sender']} ',
                              style: const TextStyle(
                                color: Color(0xFFFFD700),
                                fontWeight: FontWeight.w900,
                                fontSize: 11,
                              ),
                            ),
                            const TextSpan(
                              text: 'sent ',
                              style: TextStyle(
                                  color: Colors.white70, fontSize: 10.5),
                            ),
                            TextSpan(
                              text: '${msg['count']}x ${msg['giftName']} ',
                              style: const TextStyle(
                                color: Color(0xFFFF2E93),
                                fontWeight: FontWeight.w900,
                                fontSize: 11,
                              ),
                            ),
                            const TextSpan(
                              text: 'to ',
                              style: TextStyle(
                                  color: Colors.white70, fontSize: 10.5),
                            ),
                            TextSpan(
                              text: '${msg['receiver']}',
                              style: const TextStyle(
                                color: Color(0xFF00F5A0),
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }

            // 3. Lucky Jackpot Banner
            if (msg['type'] == 'jackpot') {
              return Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFDC2626), Color(0xFFD97706)],
                  ),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFFFD700), width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFFD700).withOpacity(0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Text('🎰', style: TextStyle(fontSize: 14)),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'MEGA JACKPOT: ${msg['sender']} won +${msg['coinsWon']} COINS!',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }

            // 4. Regular Bullet Chat with Tiered Level Badge
            final level = (msg['level'] as int?) ?? 1;
            return Container(
              margin: const EdgeInsets.only(bottom: 5),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.3),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  _buildChatLevelBadge(level),
                  const SizedBox(width: 6),
                  Text(
                    '${msg['sender']}: ',
                    style: const TextStyle(
                      color: Color(0xFFFFD700),
                      fontWeight: FontWeight.w800,
                      fontSize: 11,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      msg['text'] ?? '',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  /// Tiered Level Badge Capsule (Bronze, Silver, Gold, SVIP)
  Widget _buildChatLevelBadge(int level) {
    List<Color> gradientColors;
    String tierName;

    if (level >= 70) {
      // SVIP
      gradientColors = const [Color(0xFFFF2E93), Color(0xFF7C3AED)];
      tierName = 'SVIP';
    } else if (level >= 40) {
      // Gold
      gradientColors = const [Color(0xFFFFD700), Color(0xFFFFA500)];
      tierName = 'Gold';
    } else if (level >= 20) {
      // Silver
      gradientColors = const [Color(0xFF94A3B8), Color(0xFF64748B)];
      tierName = 'Silver';
    } else {
      // Bronze
      gradientColors = const [Color(0xFFD97706), Color(0xFF78350F)];
      tierName = 'Bronze';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: gradientColors),
        borderRadius: BorderRadius.circular(6),
        boxShadow: [
          BoxShadow(
            color: gradientColors.first.withOpacity(0.4),
            blurRadius: 4,
          ),
        ],
      ),
      child: Text(
        '$tierName.$level',
        style: const TextStyle(
          color: Colors.white,
          fontSize: 7.5,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  /// Luxury Bottom Action Bar with Cyber Emerald Mic & Velvet Pink Gift CTA
  Widget _buildLuxuryBottomActionBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0D0B18).withOpacity(0.92),
        border: Border(
          top: BorderSide(
            color: const Color(0xFFFFD700).withOpacity(0.2),
            width: 0.8,
          ),
        ),
      ),
      child: Row(
        children: [
          // Chat input field (Glassmorphic)
          Expanded(
            child: Container(
              height: 38,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF160D29).withOpacity(0.85),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: Colors.white.withOpacity(0.12),
                  width: 0.8,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _chatController,
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                      decoration: const InputDecoration(
                        hintText: 'Say something friendly to stage...',
                        hintStyle:
                            TextStyle(color: Colors.white38, fontSize: 11),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  GestureDetector(
                    onTap: _sendMessage,
                    child: const Icon(
                      Icons.send_rounded,
                      color: Color(0xFFFF2E93),
                      size: 17,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),

          // In-Ear Monitor Audio FX Toggle
          GestureDetector(
            onTap: () {
              setState(() => _isEarMonitorOn = !_isEarMonitorOn);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    _isEarMonitorOn
                        ? '🎧 In-ear monitor & reverb FX enabled'
                        : '🎧 In-ear monitor muted',
                  ),
                  backgroundColor: const Color(0xFF160D29),
                  duration: const Duration(seconds: 1),
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.all(9),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _isEarMonitorOn
                    ? const Color(0xFF7C3AED)
                    : Colors.white.withOpacity(0.08),
                border: Border.all(
                  color: _isEarMonitorOn
                      ? const Color(0xFFFF2E93)
                      : Colors.white24,
                  width: 1,
                ),
                boxShadow: _isEarMonitorOn
                    ? [
                        BoxShadow(
                          color: const Color(0xFF7C3AED).withOpacity(0.6),
                          blurRadius: 8,
                        ),
                      ]
                    : null,
              ),
              child: Icon(
                _isEarMonitorOn ? Icons.headphones : Icons.headphones_outlined,
                color: Colors.white,
                size: 17,
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Mic Mute / Unmute Toggle (Cyber Emerald Glow when active)
          GestureDetector(
            onTap: () {
              setState(() => _isMicMuted = !_isMicMuted);
              _livekitController.toggleMicrophone();
            },
            child: Container(
              padding: const EdgeInsets.all(9),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: _isMicMuted
                    ? const LinearGradient(
                        colors: [Color(0xFFEF4444), Color(0xFFB91C1C)],
                      )
                    : const LinearGradient(
                        colors: [Color(0xFF00F5A0), Color(0xFF059669)],
                      ),
                boxShadow: [
                  BoxShadow(
                    color: (_isMicMuted
                            ? const Color(0xFFEF4444)
                            : const Color(0xFF00F5A0))
                        .withOpacity(0.55),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: Icon(
                _isMicMuted ? Icons.mic_off_rounded : Icons.mic_rounded,
                color: const Color(0xFF0D0B18),
                size: 17,
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Gift Trigger CTA (Neon Velvet Pink & Metallic Gold with Radial Pulse)
          AnimatedBuilder(
            animation: _giftPulseController,
            builder: (context, child) {
              final glowSpread = 2.0 + (_giftPulseController.value * 4.0);
              return GestureDetector(
                onTap: _openGiftBottomSheet,
                child: Container(
                  padding: const EdgeInsets.all(9),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFF2E93), Color(0xFFFFD700)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFF2E93).withOpacity(0.6),
                        blurRadius: 10 + glowSpread,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.card_giftcard_rounded,
                    color: Color(0xFF0D0B18),
                    size: 18,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
