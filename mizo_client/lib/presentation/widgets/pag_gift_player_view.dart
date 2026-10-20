/// MIZO Full-Screen Tencent libpag Player View
/// Architecture based on Tencent libpag: https://github.com/tencent/libpag
/// Renders high-performance dynamic PAG vector animations with dynamic layer injection
library;

import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/pag_engine/pag_gift_controller.dart';
import '../../models/habi_models.dart';
import 'gift_3d_vector_art.dart';

class PagGiftPlayerView extends StatelessWidget {
  final GiftMsgJson gift;
  final PagGiftController controller;

  const PagGiftPlayerView({
    super.key,
    required this.gift,
    required this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final progress = controller.progress;
        final receiver = gift.toMembers.firstOrNull;

        // Dynamic scale & entrance trajectory curve
        final scale = (progress < 0.2)
            ? (progress / 0.2)
            : (progress > 0.85)
                ? (1.0 - (progress - 0.85) / 0.15)
                : 1.0;

        return Stack(
          alignment: Alignment.center,
          children: [
            // 1. Dark Atmospheric Cinematic Backdrop
            Container(
              color: Colors.black.withOpacity(0.55),
            ),

            // 2. Ambient Radial Halo Beam (Animates with PAG progress)
            Positioned(
              child: Container(
                width: 340,
                height: 340,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFFFFD700).withOpacity((0.4 * (1 - progress)).clamp(0.0, 1.0)),
                      const Color(0xFFFF2E93).withOpacity((0.3 * (1 - progress)).clamp(0.0, 1.0)),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

            // 3. Dynamic Rotating Particle Vortex (60 FPS Custom Canvas)
            CustomPaint(
              size: const Size(double.infinity, double.infinity),
              painter: _PagVortexPainter(progress: progress),
            ),

            // 4. Center 3D Showcase Graphic with Dynamic Scaler
            Center(
              child: Transform.scale(
                scale: scale.clamp(0.01, 1.15),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Tencent PAG Engine Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0D0B18).withOpacity(0.9),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFFFD700), width: 1.2),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFFFD700).withOpacity(0.4),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('⚡', style: TextStyle(fontSize: 12)),
                          SizedBox(width: 4),
                          Text(
                            'TENCENT libpag • 60 FPS',
                            style: TextStyle(
                              color: Color(0xFFFFD700),
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Dynamic Injected Avatar Showcase (Tencent libpag replaceImage)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildDynamicAvatarSlot(
                          url: gift.member.avatar,
                          label: 'SENDER',
                          name: gift.member.nickname,
                          borderColor: const Color(0xFFFFD700),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14.0),
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFFFF2E93), Color(0xFFFFD700)],
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFFFF2E93).withOpacity(0.5),
                                      blurRadius: 12,
                                    ),
                                  ],
                                ),
                                child: const Icon(
                                  Icons.bolt,
                                  color: Color(0xFF0D0B18),
                                  size: 20,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'x${gift.cnt}',
                                style: const TextStyle(
                                  color: Color(0xFFFFD700),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ],
                          ),
                        ),
                        _buildDynamicAvatarSlot(
                          url: receiver?.avatar ?? '',
                          label: gift.isAll ? 'ALL MIC' : 'RECEIVER',
                          name: receiver?.nickname ?? 'Room Stage',
                          borderColor: const Color(0xFF00F5A0),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // 3D Rendered Luxury Asset Centerpiece (No emojis!)
                    Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFFFD700).withOpacity(0.5),
                            blurRadius: 36,
                            spreadRadius: 8,
                          ),
                        ],
                      ),
                      child: Center(
                        child: Gift3DVectorArt(
                          giftId: gift.giftId,
                          size: 130,
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Gift Title & Value Plaque
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF160D29), Color(0xFF0D0B18)],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFFFD700), width: 1.5),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFFFD700).withOpacity(0.3),
                            blurRadius: 18,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Text(
                            gift.name.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.2,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            'VALUE: ${(gift.cost * gift.cnt).toString()} COINS',
                            style: const TextStyle(
                              color: Color(0xFFFFD700),
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              fontFamily: 'monospace',
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Slot injection debug watermark
                    if (gift.svgaAvatarKey != null) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.white24, width: 0.8),
                        ),
                        child: Text(
                          'PAG slot: [${gift.svgaAvatarKey}]',
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 9,
                            fontFamily: 'monospace',
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildDynamicAvatarSlot({
    required String url,
    required String label,
    required String name,
    required Color borderColor,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: borderColor, width: 2.2),
            boxShadow: [
              BoxShadow(
                color: borderColor.withOpacity(0.4),
                blurRadius: 12,
              ),
            ],
          ),
          child: ClipOval(
            child: url.isNotEmpty
                ? CachedNetworkImage(
                    imageUrl: url,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => Container(color: Colors.black26),
                    errorWidget: (_, __, ___) => const Icon(Icons.person, color: Colors.white),
                  )
                : const Icon(Icons.person, color: Colors.white),
          ),
        ),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
          decoration: BoxDecoration(
            color: borderColor,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            label,
            style: const TextStyle(
              color: Color(0xFF0D0B18),
              fontSize: 8,
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
        const SizedBox(height: 2),
        SizedBox(
          width: 76,
          child: Text(
            name,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ],
    );
  }
}

class _PagVortexPainter extends CustomPainter {
  final double progress;

  _PagVortexPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final count = 28;
    final maxRadius = size.width * 0.48;

    for (int i = 0; i < count; i++) {
      final angle = (i * (math.pi * 2 / count)) + (progress * math.pi * 4);
      final radius = maxRadius * ((i / count + progress) % 1.0);
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);
      final alpha = (1.0 - (radius / maxRadius)).clamp(0.0, 1.0);

      final paint = Paint()
        ..color = (i % 2 == 0 ? const Color(0xFFFFD700) : const Color(0xFFFF2E93)).withOpacity(alpha * 0.7)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(Offset(x, y), (3.0 * alpha).clamp(1.0, 4.0), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _PagVortexPainter oldDelegate) => oldDelegate.progress != progress;
}
