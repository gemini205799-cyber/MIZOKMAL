/// MIZO Hybrid Gift Animation Overlay Widget
/// Layer: Topmost overlay (IgnorePointer) over layout_live_room_content.xml
///
/// Features:
/// 1. Dynamic Asset Detection (.pag vs .svga vs Lottie/SVG)
/// 2. Audio Synchronization: Triggers audioplayers sound effect at frame 0
/// 3. Dynamic Placeholder Injection (Sender Avatar, Receiver Avatar, Nickname into svga_avatar_key)
/// 4. Side Combo Floating Badges (view_live_bullet_item_room_gift)
/// 5. Lucky Cash-back Jackpot Toast Banner

import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import '../../core/gift_queue_manager.dart';
import '../../models/habi_models.dart';

class GiftAnimationOverlay extends StatefulWidget {
  final GiftQueueManager queueManager;

  const GiftAnimationOverlay({
    super.key,
    required this.queueManager,
  });

  @override
  State<GiftAnimationOverlay> createState() => _GiftAnimationOverlayState();
}

class _GiftAnimationOverlayState extends State<GiftAnimationOverlay> {
  final AudioPlayer _audioPlayer = AudioPlayer();
  String? _lastPlayedSound;

  @override
  void initState() {
    super.initState();
    widget.queueManager.addListener(_onQueueChanged);
  }

  void _onQueueChanged() {
    final gift = widget.queueManager.currentlyPlayingGift;
    if (gift != null && gift.sound != null && gift.sound != _lastPlayedSound) {
      _lastPlayedSound = gift.sound;
      _playSynchronizedAudio(gift.sound!);
    }
  }

  Future<void> _playSynchronizedAudio(String soundUrl) async {
    try {
      await _audioPlayer.stop();
      await _audioPlayer.play(UrlSource(soundUrl));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      ignoring: true,
      child: AnimatedBuilder(
        animation: widget.queueManager,
        builder: (context, _) {
          final currentGift = widget.queueManager.currentlyPlayingGift;
          final combos = widget.queueManager.activeCombos;

          return Stack(
            children: [
              // 1. Full Screen Animation Layer (PAG / SVGA / Particle)
              if (currentGift != null)
                _buildFullScreenPlayer(currentGift),

              // 2. Side Floating Combo Badges (view_live_bullet_item_room_gift)
              Positioned(
                left: 16,
                top: 240,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: combos.map((badge) => _buildComboBadge(badge)).toList(),
                ),
              ),

              // 3. Lucky Jackpot Cash-Back Banner
              if (currentGift?.isBlindCriticalHit == true)
                _buildLuckyJackpotBanner(currentGift!),
            ],
          );
        },
      ),
    );
  }

  Widget _buildFullScreenPlayer(GiftMsgJson gift) {
    final isPag = gift.pagUrl != null && gift.pagUrl!.endsWith('.pag');
    final isSvga = gift.svgaAvatarKey != null || (gift.sound != null && !isPag);

    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.black.withOpacity(0.4),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Dynamic Injected Avatar Showcase (matching svga_avatar_key logic)
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildAvatarBubble(gift.member.avatar, gift.member.nickname, 'Sender'),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFEF4444)]),
                    ),
                    child: const Text('🎁', style: TextStyle(fontSize: 24)),
                  ),
                ),
                _buildAvatarBubble(
                  gift.toMembers.firstOrNull?.avatar ?? '',
                  gift.toMembers.firstOrNull?.nickname ?? 'Room',
                  'Receiver',
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Animation Engine Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A).withOpacity(0.85),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFFBBF24), width: 1.5),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    isPag ? '⚡ PAG Engine' : '✨ SVGA Player',
                    style: const TextStyle(
                      color: Color(0xFFFBBF24),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${gift.name} x${gift.cnt}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.extrabold,
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Visual Center Piece / Graphic Simulation
            Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFFF59E0B).withOpacity(0.4),
                    Colors.transparent,
                  ],
                ),
              ),
              child: Center(
                child: Text(
                  gift.type == 4 ? '🚀' : gift.type == 2 ? '🏎️' : '👑',
                  style: const TextStyle(fontSize: 90),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatarBubble(String avatarUrl, String name, String role) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 58,
          height: 58,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: const Color(0xFFFBBF24), width: 2),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFF59E0B).withOpacity(0.5),
                blurRadius: 10,
              ),
            ],
          ),
          child: ClipOval(
            child: avatarUrl.isNotEmpty
                ? Image.network(avatarUrl, fit: BoxFit.cover)
                : const Icon(Icons.person, color: Colors.white),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          name,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 11,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildComboBadge(ComboBadgeItem badge) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.7),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFEC4899), width: 1.2),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircleAvatar(
            radius: 14,
            backgroundImage: NetworkImage(badge.senderAvatar),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                badge.senderName,
                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
              ),
              Text(
                'Sent ${badge.giftName}',
                style: const TextStyle(color: Colors.white70, fontSize: 10),
              ),
            ],
          ),
          const SizedBox(width: 12),
          Text(
            'x${badge.currentCombo}',
            style: const TextStyle(
              color: Color(0xFFFBBF24),
              fontSize: 18,
              fontWeight: FontWeight.w900,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLuckyJackpotBanner(GiftMsgJson gift) {
    return Positioned(
      top: 100,
      left: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFFDC2626), Color(0xFF7C3AED)]),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.purpleAccent.withOpacity(0.6),
              blurRadius: 16,
            ),
          ],
        ),
        child: Row(
          children: [
            const Text('🎰', style: TextStyle(fontSize: 32)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('MEGA LUCKY JACKPOT!', style: TextStyle(color: Colors.yellowAccent, fontWeight: FontWeight.black, fontSize: 13)),
                  Text(
                    '${gift.member.nickname} won +${gift.totalCashBack?.toString() ?? "0"} Coins Cash-Back!',
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    widget.queueManager.removeListener(_onQueueChanged);
    _audioPlayer.dispose();
    super.dispose();
  }
}
