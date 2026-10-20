/// MIZO Room Seats Grid Widget (Luxury Royal Cyberpunk Edition)
/// Implements Habi & Yari parity with:
/// - Host Throne (pos: 1000 / anchor_mic) with Golden Crown, Triple-Ring Pulse, Ambient Gold Glow
/// - Dynamic Boss Seat (pos: 1001 / boss_mic) with Imperial Purple-Gold Crest & Coin Rent Pill
/// - 8 / 12 Regular Seats Matrix with Breathing Opacity, Glassmorphism, and Level Badges
/// - Luxury Obsidian Action Bottom Sheet
library;

import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../models/seat_model.dart';
import '../../core/livekit_room_controller.dart';

class RoomSeatsGrid extends StatefulWidget {
  final int seatCapacity; // 8 or 12
  final String? hostName;
  final String? hostAvatar;
  final String? bossName;
  final String? bossAvatar;
  final int bossRentCoins;
  final List<SeatModel>? seats;
  final LiveKitRoomController? livekitController;
  final Function(int pos)? onSeatTap;
  final Function(int seatIndex)? onTakeSeat;
  final Function(int seatIndex)? onToggleLock;
  final Function(bool lock)? onLockAll;
  final Function(int seatIndex)? onToggleMute;

  const RoomSeatsGrid({
    super.key,
    this.seatCapacity = 12,
    this.hostName,
    this.hostAvatar,
    this.bossName,
    this.bossAvatar,
    this.bossRentCoins = 50000,
    this.seats,
    this.livekitController,
    this.onSeatTap,
    this.onTakeSeat,
    this.onToggleLock,
    this.onLockAll,
    this.onToggleMute,
  });

  @override
  State<RoomSeatsGrid> createState() => _RoomSeatsGridState();
}

class _RoomSeatsGridState extends State<RoomSeatsGrid>
    with TickerProviderStateMixin {
  // Animation controller for the breathing empty seats
  late final AnimationController _breathingController;
  late final Animation<double> _breathingAnimation;

  // Animation controller for the triple-ring pulse (active speaking)
  late final AnimationController _pulseController;

  // Animation controller for the boss seat shimmer
  late final AnimationController _shimmerController;

  @override
  void initState() {
    super.initState();

    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);
    _breathingAnimation = Tween<double>(begin: 0.45, end: 0.95).animate(
      CurvedAnimation(parent: _breathingController, curve: Curves.easeInOut),
    );

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();

    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat();
  }

  @override
  void dispose() {
    _breathingController.dispose();
    _pulseController.dispose();
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Ambient Scrim behind the seats
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: RadialGradient(
                  center: const Alignment(0, -0.2),
                  radius: 0.9,
                  colors: [
                    const Color(0xFF7C3AED).withOpacity(0.12),
                    const Color(0xFFFFD700).withOpacity(0.05),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // Main Column: Top VIP Tier (Host Throne & Boss Mic) + Regular Grid (8 or 12)
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 1. Top Royalty Tier: Host Throne (Anchor pos: 1000) & Imperial Boss Seat (pos: 1001)
              _buildRoyaltyRow(),
              const SizedBox(height: 12),

              // 2. Regular Seats Matrix (pos: 1 .. seatCapacity)
              _buildRegularSeatsMatrix(),
            ],
          ),
        ],
      ),
    );
  }

  /// Top Royalty Row: Host Anchor Throne + Boss Rent Seat
  Widget _buildRoyaltyRow() {
    final hostAvatarUrl = widget.hostAvatar ??
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
    final hostDisplayName = widget.hostName ?? 'Host Queen';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF160D29).withOpacity(0.55),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFFFFD700).withOpacity(0.25),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFFD700).withOpacity(0.08),
            blurRadius: 18,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          // Host Anchor Throne (pos: 1000)
          _buildHostThrone(hostDisplayName, hostAvatarUrl),

          // Center Crown Divider / Versus Sparkle
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFFD700).withOpacity(0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.auto_awesome,
                  size: 14,
                  color: Color(0xFF0D0B18),
                ),
              ),
              const SizedBox(height: 3),
              const Text(
                'ROYAL VIP',
                style: TextStyle(
                  color: Color(0xFFFFD700),
                  fontSize: 8,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),

          // Imperial Boss Seat (pos: 1001)
          _buildBossSeat(),
        ],
      ),
    );
  }

  /// Host Throne with Triple-Ring Audio Pulsing & Gold Bezel
  Widget _buildHostThrone(String name, String avatarUrl) {
    const isSpeaking = true; // Host active energy

    return GestureDetector(
      onTap: () {
        if (widget.onSeatTap != null) {
          widget.onSeatTap!(1000);
        } else {
          _showActionSheet(
            title: '👑 Anchor Throne (Host)',
            pos: 1000,
            isHost: true,
          );
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            alignment: Alignment.center,
            clipBehavior: Clip.none,
            children: [
              // Triple-Ring Pulsating Energy Ripple
              if (isSpeaking)
                AnimatedBuilder(
                  animation: _pulseController,
                  builder: (context, child) {
                    return SizedBox(
                      width: 76,
                      height: 76,
                      child: Stack(
                        alignment: Alignment.center,
                        children: List.generate(3, (i) {
                          final progress =
                              (_pulseController.value + (i * 0.33)) % 1.0;
                          final size = 58.0 + (progress * 22.0);
                          final opacity =
                              (1.0 - progress).clamp(0.0, 1.0) * 0.55;
                          return Container(
                            width: size,
                            height: size,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: const Color(0xFFFFD700)
                                    .withOpacity(opacity),
                                width: 2 - (progress * 1.2),
                              ),
                            ),
                          );
                        }),
                      ),
                    );
                  },
                ),

              // Crown Badge Floating Above
              Positioned(
                top: -12,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
                    ),
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFFD700).withOpacity(0.6),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('👑', style: TextStyle(fontSize: 9)),
                      SizedBox(width: 2),
                      Text(
                        'HOST',
                        style: TextStyle(
                          color: Color(0xFF0D0B18),
                          fontSize: 8,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Golden Multi-layered Avatar Bezel
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const SweepGradient(
                    colors: [
                      Color(0xFFFFD700),
                      Color(0xFFFFA500),
                      Color(0xFFFFE082),
                      Color(0xFFFFD700),
                    ],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFFD700).withOpacity(0.5),
                      blurRadius: 14,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(2.5),
                child: Container(
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFF0D0B18),
                  ),
                  padding: const EdgeInsets.all(2.0),
                  child: ClipOval(
                    child: Image.network(
                      avatarUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Icon(
                        Icons.person,
                        color: Color(0xFFFFD700),
                      ),
                    ),
                  ),
                ),
              ),

              // Speaking Wave Indicator Badge
              Positioned(
                bottom: -2,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00F5A0),
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF00F5A0).withOpacity(0.6),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.mic, size: 9, color: Color(0xFF0D0B18)),
                      SizedBox(width: 2),
                      Text(
                        'ON AIR',
                        style: TextStyle(
                          color: Color(0xFF0D0B18),
                          fontSize: 7,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            name,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              shadows: [
                Shadow(color: Colors.black, blurRadius: 4),
              ],
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  /// Boss Seat (pos: 1001) with Imperial Purple-Gold Crest & Coin Rent Pill
  Widget _buildBossSeat() {
    final hasBoss = widget.bossName != null && widget.bossName!.isNotEmpty;
    final bossAvatar = widget.bossAvatar ??
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';

    return GestureDetector(
      onTap: () {
        if (widget.onSeatTap != null) {
          widget.onSeatTap!(1001);
        } else {
          _showActionSheet(
            title: '💎 Imperial Boss Seat (pos: 1001)',
            pos: 1001,
            isBoss: true,
          );
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            alignment: Alignment.center,
            clipBehavior: Clip.none,
            children: [
              // Shimmering Imperial Violet/Gold Ring
              AnimatedBuilder(
                animation: _shimmerController,
                builder: (context, child) {
                  return Container(
                    width: 62,
                    height: 62,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: SweepGradient(
                        transform: GradientRotation(
                            _shimmerController.value * 2 * math.pi),
                        colors: const [
                          Color(0xFF7C3AED), // Imperial Purple
                          Color(0xFFFFD700), // Gold
                          Color(0xFFFF2E93), // Neon Pink
                          Color(0xFF7C3AED),
                        ],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF7C3AED).withOpacity(0.55),
                          blurRadius: 12,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(2.5),
                    child: Container(
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFF0D0B18),
                      ),
                      padding: const EdgeInsets.all(2),
                      child: ClipOval(
                        child: hasBoss
                            ? Image.network(
                                bossAvatar,
                                fit: BoxFit.cover,
                              )
                            : Container(
                                decoration: const BoxDecoration(
                                  gradient: RadialGradient(
                                    colors: [
                                      Color(0xFF4C1D95),
                                      Color(0xFF1E0A24),
                                    ],
                                  ),
                                ),
                                child: const Center(
                                  child: Icon(
                                    Icons.diamond,
                                    color: Color(0xFFFFD700),
                                    size: 24,
                                  ),
                                ),
                              ),
                      ),
                    ),
                  );
                },
              ),

              // Top VIP Boss Crest
              Positioned(
                top: -10,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF7C3AED), Color(0xFFFF2E93)],
                    ),
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF7C3AED).withOpacity(0.6),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: const Text(
                    'BOSS',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.8,
                    ),
                  ),
                ),
              ),

              // Floating Coin Rent Badge Pill (Current Outbid Coins)
              Positioned(
                bottom: -4,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0D0B18),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: const Color(0xFFFFD700).withOpacity(0.8),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.8),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('🪙', style: TextStyle(fontSize: 8)),
                      const SizedBox(width: 2),
                      Text(
                        '${widget.bossRentCoins ~/ 1000}k',
                        style: const TextStyle(
                          color: Color(0xFFFFD700),
                          fontSize: 8,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            hasBoss ? widget.bossName! : 'Rent Seat',
            style: TextStyle(
              color: hasBoss ? Colors.white : const Color(0xFFFFD700),
              fontSize: 11,
              fontWeight: FontWeight.w700,
              shadows: const [
                Shadow(color: Colors.black, blurRadius: 4),
              ],
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  /// Regular Seats Matrix (2 rows of 4 = 8, or 3 rows of 4 = 12)
  Widget _buildRegularSeatsMatrix() {
    final count = widget.seatCapacity;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: count,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        mainAxisSpacing: 10.0,
        crossAxisSpacing: 10.0,
        childAspectRatio: 0.82,
      ),
      itemBuilder: (context, index) {
        final seatIndex = index + 1;
        SeatModel? seat;
        if (widget.seats != null && index < widget.seats!.length) {
          seat = widget.seats![index];
        }

        return _buildRegularSeatItem(seatIndex, seat);
      },
    );
  }

  /// Individual Regular Seat with Glassmorphism, Breathing Opacity, & Level Badges
  Widget _buildRegularSeatItem(int seatIndex, SeatModel? seat) {
    final isOccupied = seat?.isOccupied ?? false;
    final isLocked = seat?.isLocked ?? false;
    final participant = seat?.participant;
    final isSpeaking = isOccupied &&
        (participant?.isSpeaking == true ||
            (widget.livekitController != null &&
                participant != null &&
                widget.livekitController!.isSpeaking(participant.userId)));

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        GestureDetector(
          onTap: () {
            if (widget.onSeatTap != null) {
              widget.onSeatTap!(seatIndex);
            } else if (widget.onTakeSeat != null && !isOccupied && !isLocked) {
              widget.onTakeSeat!(seatIndex);
            } else {
              _showActionSheet(
                title: 'Mic No.$seatIndex',
                pos: seatIndex,
                seat: seat,
              );
            }
          },
          child: Stack(
            alignment: Alignment.center,
            clipBehavior: Clip.none,
            children: [
              // Active Speaking Cyber-Emerald Glow
              if (isSpeaking)
                Container(
                  width: 58,
                  height: 58,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF00F5A0).withOpacity(0.65),
                        blurRadius: 14,
                        spreadRadius: 3,
                      ),
                    ],
                  ),
                ),

              // Seat Circle
              if (isOccupied)
                // Occupied State: Glassmorphism container with Level capsule
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSpeaking
                          ? const Color(0xFF00F5A0)
                          : const Color(0xFFFFD700).withOpacity(0.6),
                      width: isSpeaking ? 2.5 : 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.6),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: Image.network(
                      participant!.avatarUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const Icon(
                        Icons.person,
                        color: Colors.white,
                      ),
                    ),
                  ),
                )
              else
                // Empty / Locked State: Neon Dashed Breathing Bezel
                AnimatedBuilder(
                  animation: _breathingAnimation,
                  builder: (context, child) {
                    final opacity = _breathingAnimation.value;
                    return Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFF160D29).withOpacity(0.65),
                        border: Border.all(
                          color: isLocked
                              ? const Color(0xFFEF4444).withOpacity(opacity)
                              : const Color(0xFF00F5A0)
                                  .withOpacity(opacity * 0.7),
                          width: 1.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isLocked
                                ? const Color(0xFFEF4444)
                                    .withOpacity(opacity * 0.25)
                                : const Color(0xFF00F5A0)
                                    .withOpacity(opacity * 0.2),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                      child: Center(
                        child: isLocked
                            ? const Icon(
                                Icons.lock_outline_rounded,
                                color: Color(0xFFEF4444),
                                size: 20,
                              )
                            : Icon(
                                Icons.add_rounded,
                                color: const Color(0xFF00F5A0)
                                    .withOpacity(opacity),
                                size: 22,
                              ),
                      ),
                    );
                  },
                ),

              // Occupied Muted Icon
              if (isOccupied &&
                  (participant!.isMuted || seat?.isMutedByHost == true))
                Positioned(
                  bottom: -1,
                  right: -1,
                  child: Container(
                    padding: const EdgeInsets.all(2.5),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEF4444),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.mic_off,
                      size: 9,
                      color: Colors.white,
                    ),
                  ),
                ),

              // Level Badge Capsule
              if (isOccupied && participant != null)
                Positioned(
                  top: -6,
                  child: _buildLevelBadge(participant.level),
                ),
            ],
          ),
        ),
        const SizedBox(height: 4),

        // Seat Label: Name or "No.X"
        Text(
          isOccupied ? participant!.name : 'No.$seatIndex',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 10,
            fontWeight: isOccupied ? FontWeight.w700 : FontWeight.w400,
            color: isOccupied ? Colors.white : Colors.white60,
            shadows: const [
              Shadow(color: Colors.black, blurRadius: 3),
            ],
          ),
        ),
      ],
    );
  }

  /// Level Badge Capsule (Metallic Blue / Gold / Cyberpunk)
  Widget _buildLevelBadge(int level) {
    List<Color> gradientColors;
    if (level >= 80) {
      gradientColors = const [Color(0xFFFF2E93), Color(0xFFFFD700)]; // SVIP
    } else if (level >= 50) {
      gradientColors = const [Color(0xFFFFD700), Color(0xFFFFA500)]; // Gold
    } else if (level >= 25) {
      gradientColors = const [Color(0xFF38BDF8), Color(0xFF2563EB)]; // Blue
    } else {
      gradientColors = const [Color(0xFF10B981), Color(0xFF047857)]; // Emerald
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: gradientColors),
        borderRadius: BorderRadius.circular(6),
        boxShadow: [
          BoxShadow(
            color: gradientColors.first.withOpacity(0.5),
            blurRadius: 4,
          ),
        ],
      ),
      child: Text(
        'Lv.$level',
        style: const TextStyle(
          color: Colors.white,
          fontSize: 7.5,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  /// Luxury Obsidian Action Bottom Sheet
  void _showActionSheet({
    required String title,
    required int pos,
    bool isHost = false,
    bool isBoss = false,
    SeatModel? seat,
  }) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          decoration: BoxDecoration(
            color: const Color(0xFF0D0B18),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(24),
              topRight: Radius.circular(24),
            ),
            border: Border.all(
              color: const Color(0xFFFFD700).withOpacity(0.3),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.8),
                blurRadius: 24,
              ),
            ],
          ),
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Drag Handle
                Container(
                  margin: const EdgeInsets.only(top: 10, bottom: 6),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),

                // Sheet Header
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: Color(0xFFFFD700),
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close,
                            color: Colors.white60, size: 20),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                ),
                const Divider(color: Colors.white12, height: 1),

                if (isBoss) ...[
                  _buildLuxuryTile(
                    icon: Icons.diamond_outlined,
                    iconColor: const Color(0xFFFFD700),
                    title: 'Rent Boss Seat (50,000 Coins / 10m)',
                    subtitle: 'Acquire exclusive VIP spotlight and audio priority',
                    onTap: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('💎 Outbid request submitted for Boss Seat!'),
                          backgroundColor: Color(0xFF7C3AED),
                        ),
                      );
                    },
                  ),
                  _buildLuxuryTile(
                    icon: Icons.gavel_rounded,
                    iconColor: const Color(0xFFFF2E93),
                    title: 'Outbid Current Boss',
                    subtitle: 'Raise rent bid by +10,000 coins',
                    onTap: () {
                      Navigator.pop(ctx);
                    },
                  ),
                ] else ...[
                  _buildLuxuryTile(
                    icon: Icons.mic_none_rounded,
                    iconColor: const Color(0xFF00F5A0),
                    title: 'Take This Microphone',
                    subtitle: 'Start speaking to all listeners',
                    onTap: () {
                      Navigator.pop(ctx);
                      if (widget.onTakeSeat != null) widget.onTakeSeat!(pos);
                    },
                  ),
                  _buildLuxuryTile(
                    icon: Icons.person_add_alt_1_rounded,
                    iconColor: const Color(0xFF38BDF8),
                    title: 'Invite Guest to Mic',
                    subtitle: 'Send on-mic invitation to audience member',
                    onTap: () {
                      Navigator.pop(ctx);
                    },
                  ),
                  _buildLuxuryTile(
                    icon: seat?.isLocked == true
                        ? Icons.lock_open_rounded
                        : Icons.lock_outline_rounded,
                    iconColor: const Color(0xFFFFD700),
                    title: seat?.isLocked == true ? 'Unlock Seat' : 'Lock Seat',
                    subtitle: 'Control public seat accessibility',
                    onTap: () {
                      Navigator.pop(ctx);
                      if (widget.onToggleLock != null) {
                        widget.onToggleLock!(pos);
                      }
                    },
                  ),
                  _buildLuxuryTile(
                    icon: Icons.lock_clock_rounded,
                    iconColor: const Color(0xFFEF4444),
                    title: 'Lock All Guest Seats',
                    subtitle: 'Host only broadcast mode',
                    onTap: () {
                      Navigator.pop(ctx);
                      if (widget.onLockAll != null) widget.onLockAll!(true);
                    },
                  ),
                  _buildLuxuryTile(
                    icon: seat?.isMutedByHost == true
                        ? Icons.volume_up_rounded
                        : Icons.volume_off_rounded,
                    iconColor: const Color(0xFFFF2E93),
                    title: seat?.isMutedByHost == true
                        ? 'Unmute Mic'
                        : 'Mute Mic',
                    subtitle: 'Toggle audio permissions for this position',
                    onTap: () {
                      Navigator.pop(ctx);
                      if (widget.onToggleMute != null) {
                        widget.onToggleMute!(pos);
                      }
                    },
                  ),
                ],

                const SizedBox(height: 12),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildLuxuryTile({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.12),
                shape: BoxShape.circle,
                border: Border.all(color: iconColor.withOpacity(0.3)),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Colors.white54,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded,
                color: Colors.white30, size: 12),
          ],
        ),
      ),
    );
  }
}
