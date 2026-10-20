/// MIZO Ultra-Luxury 3D Gift Vector Art Widget (Tencent libpag Parity)
/// Replaces outdated flat emojis with high-end hardware-accelerated 3D vector graphics,
/// metallic gold/emerald gradients, dynamic highlights, and glowing pedestals.
library;

import 'dart:math' as math;
import 'package:flutter/material.dart';

class Gift3DVectorArt extends StatelessWidget {
  final String giftId;
  final double size;

  const Gift3DVectorArt({
    super.key,
    required this.giftId,
    this.size = 52.0,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _Gift3DPainter(giftId: giftId),
      ),
    );
  }
}

class _Gift3DPainter extends CustomPainter {
  final String giftId;

  _Gift3DPainter({required this.giftId});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final center = Offset(w / 2, h / 2);

    switch (giftId) {
      case 'gift_super_car':
        _paintSuperCar(canvas, size);
        break;
      case 'gift_bugatti':
        _paintBugatti(canvas, size);
        break;
      case 'gift_golden_bike':
        _paintGoldenBike(canvas, size);
        break;
      case 'gift_space_rocket':
        _paintSpaceRocket(canvas, size);
        break;
      case 'gift_cyber_dragon':
        _paintCyberDragon(canvas, size);
        break;
      case 'gift_phoenix':
        _paintPhoenix(canvas, size);
        break;
      case 'gift_private_jet':
        _paintPrivateJet(canvas, size);
        break;
      case 'gift_luxury_yacht':
        _paintLuxuryYacht(canvas, size);
        break;
      case 'gift_lucky_wheel':
        _paintLuckyWheel(canvas, size);
        break;
      case 'gift_lucky_chest':
        _paintLuckyChest(canvas, size);
        break;
      case 'gift_money_gun':
        _paintMoneyGun(canvas, size);
        break;
      case 'gift_super_fans_crest':
        _paintCrown(canvas, size);
        break;
      case 'gift_diamond_ring':
        _paintDiamondRing(canvas, size);
        break;
      case 'gift_love_carriage':
        _paintLoveCarriage(canvas, size);
        break;
      case 'gift_magic_wand':
        _paintMagicWand(canvas, size);
        break;
      case 'gift_red_rose':
      default:
        _paintRose(canvas, size);
        break;
    }
  }

  void _paintSuperCar(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Ambient ground neon glow
    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFF00F5A0).withOpacity(0.6),
          Colors.transparent,
        ],
      ).createShader(Rect.fromCenter(center: Offset(w / 2, h * 0.8), width: w * 0.9, height: h * 0.3));
    canvas.drawOval(Rect.fromCenter(center: Offset(w / 2, h * 0.8), width: w * 0.85, height: h * 0.25), glowPaint);

    // Wheels
    final tirePaint = Paint()..color = const Color(0xFF1E293B);
    final rimPaint = Paint()
      ..color = const Color(0xFFFFD700)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(Offset(w * 0.28, h * 0.72), w * 0.1, tirePaint);
    canvas.drawCircle(Offset(w * 0.28, h * 0.72), w * 0.1, rimPaint);
    canvas.drawCircle(Offset(w * 0.72, h * 0.72), w * 0.1, tirePaint);
    canvas.drawCircle(Offset(w * 0.72, h * 0.72), w * 0.1, rimPaint);

    // Gold McLaren Aerodynamic Chassis
    final carPath = Path()
      ..moveTo(w * 0.14, h * 0.64)
      ..cubicTo(w * 0.16, h * 0.54, w * 0.26, h * 0.50, w * 0.36, h * 0.50)
      ..lineTo(w * 0.44, h * 0.40)
      ..cubicTo(w * 0.50, h * 0.34, w * 0.64, h * 0.34, w * 0.72, h * 0.40)
      ..lineTo(w * 0.82, h * 0.50)
      ..cubicTo(w * 0.90, h * 0.52, w * 0.94, h * 0.58, w * 0.92, h * 0.65)
      ..lineTo(w * 0.86, h * 0.70)
      ..lineTo(w * 0.22, h * 0.70)
      ..close();

    final goldPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFFF2A3), Color(0xFFFFD700), Color(0xFFD97706)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(carPath, goldPaint);

    // Windshield
    final glassPath = Path()
      ..moveTo(w * 0.44, h * 0.42)
      ..cubicTo(w * 0.50, h * 0.36, w * 0.62, h * 0.36, w * 0.68, h * 0.42)
      ..lineTo(w * 0.74, h * 0.50)
      ..lineTo(w * 0.38, h * 0.50)
      ..close();
    final glassPaint = Paint()..color = const Color(0xFF38BDF8).withOpacity(0.85);
    canvas.drawPath(glassPath, glassPaint);

    // Cyan & Pink Neon Beams
    final lightCyan = Paint()..color = const Color(0xFF00F5A0);
    final lightPink = Paint()..color = const Color(0xFFFF2E93);
    canvas.drawCircle(Offset(w * 0.12, h * 0.62), 2.5, lightCyan);
    canvas.drawCircle(Offset(w * 0.92, h * 0.62), 2.5, lightPink);
  }

  void _paintBugatti(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Cyan plasma ground
    final cyanGlow = Paint()
      ..shader = RadialGradient(
        colors: [const Color(0xFF00E5FF).withOpacity(0.6), Colors.transparent],
      ).createShader(Rect.fromCenter(center: Offset(w / 2, h * 0.82), width: w * 0.9, height: h * 0.3));
    canvas.drawOval(Rect.fromCenter(center: Offset(w / 2, h * 0.82), width: w * 0.9, height: h * 0.25), cyanGlow);

    // Wheels
    final tire = Paint()..color = const Color(0xFF0F172A);
    final cyanRing = Paint()
      ..color = const Color(0xFF00E5FF)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;
    canvas.drawCircle(Offset(w * 0.26, h * 0.70), w * 0.1, tire);
    canvas.drawCircle(Offset(w * 0.26, h * 0.70), w * 0.1, cyanRing);
    canvas.drawCircle(Offset(w * 0.74, h * 0.70), w * 0.1, tire);
    canvas.drawCircle(Offset(w * 0.74, h * 0.70), w * 0.1, cyanRing);

    // Carbon Body
    final body = Path()
      ..moveTo(w * 0.12, h * 0.62)
      ..cubicTo(w * 0.16, h * 0.50, w * 0.25, h * 0.46, w * 0.36, h * 0.46)
      ..lineTo(w * 0.46, h * 0.38)
      ..cubicTo(w * 0.54, h * 0.32, w * 0.66, h * 0.32, w * 0.74, h * 0.38)
      ..lineTo(w * 0.84, h * 0.46)
      ..lineTo(w * 0.92, h * 0.64)
      ..lineTo(w * 0.18, h * 0.68)
      ..close();
    final bodyPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFF1E293B), Color(0xFF0F172A), Color(0xFF020617)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(body, bodyPaint);

    // Signature Bugatti Cyan Horseshoe C-Line
    final cLine = Path()
      ..moveTo(w * 0.70, h * 0.40)
      ..cubicTo(w * 0.80, h * 0.44, w * 0.84, h * 0.58, w * 0.78, h * 0.68)
      ..lineTo(w * 0.66, h * 0.68)
      ..close();
    final cPaint = Paint()..color = const Color(0xFF00E5FF);
    canvas.drawPath(cLine, cPaint);
  }

  void _paintGoldenBike(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final goldStroke = Paint()
      ..shader = const LinearGradient(colors: [Color(0xFFFFF2A3), Color(0xFFFFD700), Color(0xFFD97706)])
          .createShader(Rect.fromLTWH(0, 0, w, h))
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke;

    final tire = Paint()..color = const Color(0xFF0F172A);
    canvas.drawCircle(Offset(w * 0.24, h * 0.65), w * 0.14, tire);
    canvas.drawCircle(Offset(w * 0.24, h * 0.65), w * 0.14, goldStroke);
    canvas.drawCircle(Offset(w * 0.76, h * 0.65), w * 0.14, tire);
    canvas.drawCircle(Offset(w * 0.76, h * 0.65), w * 0.14, goldStroke);

    // Bike Frame
    final frame = Path()
      ..moveTo(w * 0.24, h * 0.65)
      ..lineTo(w * 0.45, h * 0.54)
      ..lineTo(w * 0.64, h * 0.42)
      ..lineTo(w * 0.76, h * 0.65);
    canvas.drawPath(frame, goldStroke);

    // High Handlebars
    final bars = Path()
      ..moveTo(w * 0.64, h * 0.42)
      ..lineTo(w * 0.70, h * 0.26)
      ..lineTo(w * 0.64, h * 0.22);
    canvas.drawPath(bars, goldStroke);

    // Teardrop Tank
    final tank = Path()
      ..moveTo(w * 0.46, h * 0.44)
      ..cubicTo(w * 0.52, h * 0.38, w * 0.62, h * 0.40, w * 0.62, h * 0.46)
      ..close();
    final tankPaint = Paint()..color = const Color(0xFFFFD700);
    canvas.drawPath(tank, tankPaint);
  }

  void _paintSpaceRocket(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Thruster Flames
    final flame = Path()
      ..moveTo(w * 0.42, h * 0.74)
      ..cubicTo(w * 0.40, h * 0.90, w * 0.50, h * 0.98, w * 0.50, h * 0.98)
      ..cubicTo(w * 0.50, h * 0.98, w * 0.60, h * 0.90, w * 0.58, h * 0.74)
      ..close();
    final flamePaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFFD700), Color(0xFFFF2E93), Color(0xFF7C3AED)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(flame, flamePaint);

    // Fins
    final finPaint = Paint()..color = const Color(0xFFFF2E93);
    final leftFin = Path()
      ..moveTo(w * 0.34, h * 0.58)
      ..lineTo(w * 0.20, h * 0.74)
      ..lineTo(w * 0.36, h * 0.74)
      ..close();
    final rightFin = Path()
      ..moveTo(w * 0.66, h * 0.58)
      ..lineTo(w * 0.80, h * 0.74)
      ..lineTo(w * 0.64, h * 0.74)
      ..close();
    canvas.drawPath(leftFin, finPaint);
    canvas.drawPath(rightFin, finPaint);

    // Rocket Body
    final body = Path()
      ..moveTo(w * 0.50, h * 0.12)
      ..cubicTo(w * 0.40, h * 0.28, w * 0.36, h * 0.50, w * 0.36, h * 0.74)
      ..lineTo(w * 0.64, h * 0.74)
      ..cubicTo(w * 0.64, h * 0.50, w * 0.60, h * 0.28, w * 0.50, h * 0.12)
      ..close();
    final bodyPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFFFFFF), Color(0xFFE2E8F0), Color(0xFF94A3B8)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(body, bodyPaint);

    // Porthole
    canvas.drawCircle(Offset(w * 0.50, h * 0.42), w * 0.08, Paint()..color = const Color(0xFF0284C7));
    canvas.drawCircle(
        Offset(w * 0.50, h * 0.42),
        w * 0.08,
        Paint()
          ..color = const Color(0xFFFFD700)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2.0);
  }

  void _paintCyberDragon(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Coiled Dragon Serpent Body
    final dragonPath = Path()
      ..moveTo(w * 0.20, h * 0.75)
      ..cubicTo(w * 0.15, h * 0.55, w * 0.30, h * 0.40, w * 0.50, h * 0.45)
      ..cubicTo(w * 0.70, h * 0.50, w * 0.85, h * 0.35, w * 0.75, h * 0.20)
      ..cubicTo(w * 0.65, h * 0.10, w * 0.45, h * 0.15, w * 0.45, h * 0.25)
      ..cubicTo(w * 0.45, h * 0.35, w * 0.60, h * 0.40, w * 0.55, h * 0.58)
      ..close();

    final dragonPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFA7F3D0), Color(0xFF10B981), Color(0xFF047857)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(dragonPath, dragonPaint);

    // Emerald Glow Outline
    final glow = Paint()
      ..color = const Color(0xFF00F5A0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;
    canvas.drawPath(dragonPath, glow);

    // Golden Horns & Fire
    final hornPaint = Paint()..color = const Color(0xFFFFD700);
    canvas.drawCircle(Offset(w * 0.75, h * 0.22), 4, hornPaint);
    canvas.drawCircle(Offset(w * 0.85, h * 0.16), 3, Paint()..color = const Color(0xFFFF2E93));
  }

  void _paintPhoenix(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Halo
    final halo = Paint()
      ..shader = RadialGradient(
        colors: [const Color(0xFFFFD700).withOpacity(0.8), const Color(0xFFFF2E93).withOpacity(0.0)],
      ).createShader(Rect.fromCircle(center: Offset(w / 2, h / 2), radius: w * 0.45));
    canvas.drawCircle(Offset(w / 2, h / 2), w * 0.45, halo);

    // Wings
    final wingPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFFFBEB), Color(0xFFFBBF24), Color(0xFFF43F5E), Color(0xFF881337)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, w, h));

    final leftWing = Path()
      ..moveTo(w * 0.50, h * 0.55)
      ..cubicTo(w * 0.35, h * 0.45, w * 0.12, h * 0.40, w * 0.10, h * 0.20)
      ..cubicTo(w * 0.18, h * 0.32, w * 0.30, h * 0.38, w * 0.44, h * 0.46)
      ..close();
    final rightWing = Path()
      ..moveTo(w * 0.50, h * 0.55)
      ..cubicTo(w * 0.65, h * 0.45, w * 0.88, h * 0.40, w * 0.90, h * 0.20)
      ..cubicTo(w * 0.82, h * 0.32, w * 0.70, h * 0.38, w * 0.56, h * 0.46)
      ..close();

    canvas.drawPath(leftWing, wingPaint);
    canvas.drawPath(rightWing, wingPaint);

    // Crown
    canvas.drawCircle(Offset(w * 0.50, h * 0.30), 5, Paint()..color = const Color(0xFFFFD700));
  }

  void _paintPrivateJet(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final gold = Paint()..color = const Color(0xFFFFD700);
    final wing = Path()
      ..moveTo(w * 0.48, h * 0.48)
      ..lineTo(w * 0.10, h * 0.68)
      ..lineTo(w * 0.24, h * 0.68)
      ..lineTo(w * 0.54, h * 0.54)
      ..close();
    final wingR = Path()
      ..moveTo(w * 0.52, h * 0.48)
      ..lineTo(w * 0.90, h * 0.68)
      ..lineTo(w * 0.76, h * 0.68)
      ..lineTo(w * 0.46, h * 0.54)
      ..close();
    canvas.drawPath(wing, gold);
    canvas.drawPath(wingR, gold);

    final fuse = Path()
      ..moveTo(w * 0.50, h * 0.14)
      ..cubicTo(w * 0.44, h * 0.26, w * 0.42, h * 0.56, w * 0.44, h * 0.80)
      ..lineTo(w * 0.56, h * 0.80)
      ..cubicTo(w * 0.58, h * 0.56, w * 0.56, h * 0.26, w * 0.50, h * 0.14)
      ..close();
    canvas.drawPath(fuse, Paint()..color = Colors.white);
    canvas.drawPath(
        fuse,
        Paint()
          ..color = const Color(0xFF94A3B8)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2);
  }

  void _paintLuxuryYacht(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Ocean Waves
    final wave = Path()
      ..moveTo(w * 0.06, h * 0.76)
      ..quadraticBezierTo(w * 0.26, h * 0.72, w * 0.50, h * 0.76)
      ..quadraticBezierTo(w * 0.74, h * 0.80, w * 0.94, h * 0.76);
    canvas.drawPath(
        wave,
        Paint()
          ..color = const Color(0xFF38BDF8)
          ..strokeWidth = 3.0
          ..style = PaintingStyle.stroke);

    // Hull
    final hull = Path()
      ..moveTo(w * 0.12, h * 0.66)
      ..lineTo(w * 0.22, h * 0.76)
      ..lineTo(w * 0.78, h * 0.76)
      ..lineTo(w * 0.90, h * 0.56)
      ..lineTo(w * 0.68, h * 0.56)
      ..close();
    canvas.drawPath(hull, Paint()..color = Colors.white);
    canvas.drawPath(
        hull,
        Paint()
          ..color = const Color(0xFFFFD700)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.5);

    // Deck
    canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromLTWH(w * 0.28, h * 0.46, w * 0.46, h * 0.12), const Radius.circular(3)),
        Paint()..color = const Color(0xFFFFD700));
  }

  void _paintLuckyWheel(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final r = w * 0.42;

    // Rim
    canvas.drawCircle(
        Offset(w / 2, h / 2),
        r,
        Paint()
          ..color = const Color(0xFFFFD700)
          ..strokeWidth = 4.0
          ..style = PaintingStyle.stroke);

    // Wheel Sectors
    final colors = [
      const Color(0xFFDC2626),
      const Color(0xFF7C3AED),
      const Color(0xFF059669),
      const Color(0xFFD97706),
      const Color(0xFF2563EB),
      const Color(0xFFBE123C),
    ];
    for (int i = 0; i < 6; i++) {
      final sweepAngle = (math.pi * 2) / 6;
      final startAngle = i * sweepAngle;
      final sector = Paint()..color = colors[i];
      canvas.drawArc(Rect.fromCircle(center: Offset(w / 2, h / 2), radius: r - 2), startAngle, sweepAngle, true, sector);
    }

    // Center Gem
    canvas.drawCircle(Offset(w / 2, h / 2), w * 0.14, Paint()..color = const Color(0xFFFF2E93));
    canvas.drawCircle(
        Offset(w / 2, h / 2),
        w * 0.14,
        Paint()
          ..color = const Color(0xFFFFD700)
          ..strokeWidth = 2.0
          ..style = PaintingStyle.stroke);
  }

  void _paintLuckyChest(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Base Box
    final boxRect = RRect.fromRectAndRadius(Rect.fromLTWH(w * 0.22, h * 0.46, w * 0.56, h * 0.34), const Radius.circular(6));
    canvas.drawRRect(boxRect, Paint()..color = const Color(0xFF581C87));
    canvas.drawRRect(
        boxRect,
        Paint()
          ..color = const Color(0xFFFFD700)
          ..strokeWidth = 2.5
          ..style = PaintingStyle.stroke);

    // Open Lid
    final lid = Path()
      ..moveTo(w * 0.22, h * 0.42)
      ..cubicTo(w * 0.22, h * 0.26, w * 0.78, h * 0.26, w * 0.78, h * 0.42)
      ..lineTo(w * 0.74, h * 0.46)
      ..lineTo(w * 0.26, h * 0.46)
      ..close();
    canvas.drawPath(lid, Paint()..color = const Color(0xFFFFD700));

    // Glowing Jewels inside
    canvas.drawCircle(Offset(w * 0.42, h * 0.44), 3.5, Paint()..color = const Color(0xFF00F5A0));
    canvas.drawCircle(Offset(w * 0.56, h * 0.44), 4.0, Paint()..color = const Color(0xFFFF2E93));
    canvas.drawCircle(Offset(w * 0.50, h * 0.40), 3.0, Paint()..color = const Color(0xFF38BDF8));
  }

  void _paintMoneyGun(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Flying Cash
    final cashPaint = Paint()..color = const Color(0xFF10B981);
    canvas.drawRect(Rect.fromLTWH(w * 0.56, h * 0.16, w * 0.18, h * 0.10), cashPaint);
    canvas.drawRect(Rect.fromLTWH(w * 0.72, h * 0.24, w * 0.18, h * 0.10), cashPaint);

    // Gun Chassis
    final gun = RRect.fromRectAndRadius(Rect.fromLTWH(w * 0.22, h * 0.36, w * 0.54, h * 0.26), const Radius.circular(4));
    canvas.drawRRect(gun, Paint()..color = const Color(0xFFFFD700));
    canvas.drawRRect(
        gun,
        Paint()
          ..color = const Color(0xFF78350F)
          ..strokeWidth = 1.5
          ..style = PaintingStyle.stroke);

    // Handle
    final handle = Path()
      ..moveTo(w * 0.28, h * 0.62)
      ..lineTo(w * 0.24, h * 0.84)
      ..lineTo(w * 0.40, h * 0.84)
      ..lineTo(w * 0.42, h * 0.62)
      ..close();
    canvas.drawPath(handle, Paint()..color = const Color(0xFFFFD700));
  }

  void _paintCrown(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Base Rim
    canvas.drawOval(Rect.fromCenter(center: Offset(w / 2, h * 0.74), width: w * 0.68, height: h * 0.14),
        Paint()..color = const Color(0xFFFFD700));

    // Spires
    final crown = Path()
      ..moveTo(w * 0.18, h * 0.72)
      ..lineTo(w * 0.22, h * 0.36)
      ..lineTo(w * 0.36, h * 0.54)
      ..lineTo(w * 0.50, h * 0.24)
      ..lineTo(w * 0.64, h * 0.54)
      ..lineTo(w * 0.78, h * 0.36)
      ..lineTo(w * 0.82, h * 0.72)
      ..close();
    canvas.drawPath(crown, Paint()..color = const Color(0xFFFFD700));

    // Crown Jewels
    canvas.drawCircle(Offset(w * 0.50, h * 0.24), 5, Paint()..color = const Color(0xFFDC2626));
    canvas.drawCircle(Offset(w * 0.22, h * 0.36), 4, Paint()..color = const Color(0xFF38BDF8));
    canvas.drawCircle(Offset(w * 0.78, h * 0.36), 4, Paint()..color = const Color(0xFF38BDF8));
    canvas.drawCircle(Offset(w * 0.50, h * 0.62), 4, Paint()..color = const Color(0xFF00F5A0));
  }

  void _paintDiamondRing(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Ring Band
    canvas.drawOval(
        Rect.fromCenter(center: Offset(w / 2, h * 0.62), width: w * 0.56, height: h * 0.48),
        Paint()
          ..color = const Color(0xFFE2E8F0)
          ..strokeWidth = 6.0
          ..style = PaintingStyle.stroke);

    // Diamond Gem
    final gem = Path()
      ..moveTo(w * 0.34, h * 0.28)
      ..lineTo(w * 0.66, h * 0.28)
      ..lineTo(w * 0.74, h * 0.40)
      ..lineTo(w * 0.50, h * 0.54)
      ..lineTo(w * 0.26, h * 0.40)
      ..close();
    canvas.drawPath(
        gem,
        Paint()
          ..shader = const LinearGradient(colors: [Color(0xFFFFFFFF), Color(0xFFBAE6FD), Color(0xFF0284C7)])
              .createShader(Rect.fromLTWH(0, 0, w, h)));
    canvas.drawPath(
        gem,
        Paint()
          ..color = Colors.white
          ..strokeWidth = 1.0
          ..style = PaintingStyle.stroke);
  }

  void _paintLoveCarriage(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Wheels
    final gold = Paint()
      ..color = const Color(0xFFFFD700)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(Offset(w * 0.26, h * 0.72), w * 0.12, gold);
    canvas.drawCircle(Offset(w * 0.74, h * 0.72), w * 0.12, gold);

    // Carriage Body
    canvas.drawCircle(Offset(w * 0.50, h * 0.46), w * 0.22, Paint()..color = const Color(0xFFFDA4AF));
    canvas.drawCircle(
        Offset(w * 0.50, h * 0.46),
        w * 0.22,
        Paint()
          ..color = const Color(0xFFFFD700)
          ..strokeWidth = 2.0
          ..style = PaintingStyle.stroke);
    canvas.drawCircle(Offset(w * 0.50, h * 0.46), w * 0.10, Paint()..color = const Color(0xFF38BDF8));
  }

  void _paintMagicWand(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Wand Shaft
    final shaft = Paint()
      ..color = const Color(0xFFA855F7)
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(Offset(w * 0.25, h * 0.75), Offset(w * 0.65, h * 0.35), shaft);

    // Star Top
    canvas.drawCircle(Offset(w * 0.68, h * 0.32), 8, Paint()..color = const Color(0xFFFFD700));
    canvas.drawCircle(Offset(w * 0.68, h * 0.32), 4, Paint()..color = const Color(0xFFFF2E93));
    canvas.drawCircle(Offset(w * 0.35, h * 0.30), 2.5, Paint()..color = const Color(0xFF00F5A0));
  }

  void _paintRose(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Stem
    final stem = Path()
      ..moveTo(w * 0.50, h * 0.56)
      ..quadraticBezierTo(w * 0.52, h * 0.74, w * 0.46, h * 0.90);
    canvas.drawPath(
        stem,
        Paint()
          ..color = const Color(0xFF059669)
          ..strokeWidth = 3.5
          ..strokeCap = StrokeCap.round
          ..style = PaintingStyle.stroke);

    // Rose Petal
    canvas.drawCircle(
        Offset(w * 0.50, h * 0.38),
        w * 0.22,
        Paint()
          ..shader = const RadialGradient(colors: [Color(0xFFFDA4AF), Color(0xFFF43F5E), Color(0xFFBE123C)])
              .createShader(Rect.fromCircle(center: Offset(w * 0.50, h * 0.38), radius: w * 0.22)));
    canvas.drawCircle(Offset(w * 0.50, h * 0.38), w * 0.10, Paint()..color = const Color(0xFF881337));
  }

  @override
  bool shouldRepaint(covariant _Gift3DPainter oldDelegate) => oldDelegate.giftId != giftId;
}
