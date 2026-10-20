/// MIZO Discovery & Live Voice Rooms Feed Screen (Luxury Royal Cyberpunk Edition)
/// Reference Base: https://github.com/gemini205799-cyber/yari
///
/// Features:
/// 1. Deep Royal Obsidian canvas: [#0D0B18 -> #160D29 -> #08060E]
/// 2. Glassmorphism Card Surfaces with 1px border highlights
/// 3. Animated 4-Bar Dynamic Audio Equalizer widget in corner of active rooms
/// 4. Shimmering Gradient Micro-Badges for Country Flags, Categories, and Agency VIP stamps
/// 5. Pull-to-refresh & Infinite Scroll Pagination
library;

import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../models/habi_models.dart';

class RoomFeedScreen extends StatefulWidget {
  final Function(VoiceRoomSession) onJoinRoom;

  const RoomFeedScreen({
    super.key,
    required this.onJoinRoom,
  });

  @override
  State<RoomFeedScreen> createState() => _RoomFeedScreenState();
}

class _RoomFeedScreenState extends State<RoomFeedScreen>
    with SingleTickerProviderStateMixin {
  int _selectedCategoryIndex = 0;
  final ScrollController _scrollController = ScrollController();
  bool _isLoadingMore = false;

  late final AnimationController _waveController;

  final List<String> _categories = [
    'Popular 🔥',
    'Music 🎵',
    'Dating 💖',
    'Gaming 🎮',
    'International 🌍',
  ];

  final List<VoiceRoomSession> _rooms = [
    VoiceRoomSession(
      roomId: '16701257',
      title: '《MERI JAAN》 ❤️',
      hostName: 'Tanisha (Host)',
      hostAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      seatCapacity: 12,
      category: 'Music 🎵',
      listenerCount: 1420,
      country: 'Bangladesh',
      countryFlag: '🇧🇩',
      tag: 'HOT PK',
      occupiedMicAvatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      ],
      isLiveSpeaking: true,
    ),
    VoiceRoomSession(
      roomId: '99201481',
      title: 'Dubai Gulf Royal Club 👑',
      hostName: 'Sheikh Hamdan',
      hostAvatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      seatCapacity: 12,
      category: 'Popular 🔥',
      listenerCount: 2890,
      country: 'United Arab Emirates',
      countryFlag: '🇦🇪',
      tag: 'VIP BOSS',
      occupiedMicAvatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      ],
      isLiveSpeaking: true,
    ),
    VoiceRoomSession(
      roomId: '54210992',
      title: 'Dhaka Acoustic Night 🎸',
      hostName: 'Arif Joy',
      hostAvatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      seatCapacity: 8,
      category: 'Music 🎵',
      listenerCount: 840,
      country: 'Bangladesh',
      countryFlag: '🇧🇩',
      tag: 'ACOUSTIC',
      occupiedMicAvatars: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      ],
      isLiveSpeaking: false,
    ),
    VoiceRoomSession(
      roomId: '38194412',
      title: 'Syria Stars & Poetry 🌟',
      hostName: 'Al-Basha',
      hostAvatar:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
      seatCapacity: 12,
      category: 'International 🌍',
      listenerCount: 620,
      country: 'Syria',
      countryFlag: '🇸🇾',
      tag: 'POETRY',
      occupiedMicAvatars: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      ],
      isLiveSpeaking: true,
    ),
    VoiceRoomSession(
      roomId: '77881023',
      title: 'Cairo Late Night Talk ☕',
      hostName: 'Nour VIP',
      hostAvatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      seatCapacity: 8,
      category: 'Dating 💖',
      listenerCount: 1105,
      country: 'Egypt',
      countryFlag: '🇪🇬',
      tag: 'DATING',
      occupiedMicAvatars: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      ],
      isLiveSpeaking: true,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat();
  }

  @override
  void dispose() {
    _waveController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 200 &&
        !_isLoadingMore) {
      setState(() => _isLoadingMore = true);
      Future.delayed(const Duration(milliseconds: 1000), () {
        if (!mounted) return;
        setState(() {
          _rooms.add(
            VoiceRoomSession(
              roomId:
                  '${200000 + (DateTime.now().millisecondsSinceEpoch % 800000)}',
              title: 'Friendship & Laughter 🌸',
              hostName: 'Sabrina Host',
              hostAvatar:
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
              seatCapacity: 12,
              category: 'Popular 🔥',
              listenerCount: 430,
              country: 'Bangladesh',
              countryFlag: '🇧🇩',
              tag: 'CHILL',
              occupiedMicAvatars: [],
              isLiveSpeaking: false,
            ),
          );
          _isLoadingMore = false;
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredRooms = _rooms.where((r) {
      if (_selectedCategoryIndex == 0) return true;
      final cat = _categories[_selectedCategoryIndex];
      return r.category
          .toLowerCase()
          .contains(cat.substring(0, 4).toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF08060E),
      appBar: _buildLuxuryAppBar(),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFF0D0B18),
              Color(0xFF160D29),
              Color(0xFF08060E),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: RefreshIndicator(
          color: const Color(0xFFFF2E93),
          backgroundColor: const Color(0xFF160D29),
          onRefresh: () async {
            await Future.delayed(const Duration(milliseconds: 600));
            setState(() {});
          },
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              // 1. Featured Tournament Banner Carousel
              SliverToBoxAdapter(
                child: _buildBannerCarousel(),
              ),

              // 2. Category Filter Tabs
              SliverToBoxAdapter(
                child: _buildCategoryTabs(),
              ),

              // 3. Room Cards Feed Grid (2 Columns, Yari & Habi Pattern)
              SliverPadding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.74,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final room = filteredRooms[index];
                      return _buildLuxuryRoomCard(room);
                    },
                    childCount: filteredRooms.length,
                  ),
                ),
              ),

              // 4. Loading Spinner Indicator for Pagination
              if (_isLoadingMore)
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 24.0),
                    child: Center(
                      child: CircularProgressIndicator(
                        color: Color(0xFFFF2E93),
                        strokeWidth: 2,
                      ),
                    ),
                  ),
                ),

              const SliverToBoxAdapter(child: SizedBox(height: 80)),
            ],
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildLuxuryAppBar() {
    return AppBar(
      backgroundColor: const Color(0xFF0D0B18),
      elevation: 0,
      titleSpacing: 16,
      title: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [Color(0xFFFF2E93), Color(0xFFFFD700)],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFF2E93).withOpacity(0.4),
                  blurRadius: 8,
                ),
              ],
            ),
            child: const Center(
              child: Text(
                'M',
                style: TextStyle(
                  color: Color(0xFF0D0B18),
                  fontWeight: FontWeight.w900,
                  fontSize: 18,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'MIZO PARTY',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  letterSpacing: 0.5,
                ),
              ),
              Text(
                'Royal Live Voice Stage',
                style: TextStyle(
                  color: Color(0xFFFFD700),
                  fontSize: 9,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
            ],
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.search, color: Colors.white70),
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.military_tech_rounded,
              color: Color(0xFFFFD700)),
          onPressed: () {},
        ),
        const SizedBox(width: 4),
      ],
    );
  }

  Widget _buildBannerCarousel() {
    return Container(
      height: 124,
      margin: const EdgeInsets.fromLTRB(14, 10, 14, 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xFF7C3AED), Color(0xFFFF2E93), Color(0xFFFFA500)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFF2E93).withOpacity(0.35),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            right: 8,
            bottom: -10,
            child: Text(
              '👑',
              style: TextStyle(
                fontSize: 90,
                color: Colors.white.withOpacity(0.18),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFD700),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text(
                    'SEASON 4 PK CARNIVAL',
                    style: TextStyle(
                      color: Color(0xFF0D0B18),
                      fontSize: 8.5,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Sultan Grand Championship',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 0.2,
                  ),
                ),
                const Text(
                  'Top 10 Agency Hosts Win 500,000 Diamonds',
                  style: TextStyle(color: Colors.white70, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryTabs() {
    return Container(
      height: 38,
      margin: const EdgeInsets.symmetric(vertical: 4),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 14),
        scrollDirection: Axis.horizontal,
        itemCount: _categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final isSelected = _selectedCategoryIndex == index;
          return GestureDetector(
            onTap: () => setState(() => _selectedCategoryIndex = index),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                gradient: isSelected
                    ? const LinearGradient(
                        colors: [Color(0xFFFF2E93), Color(0xFFFFD700)],
                      )
                    : null,
                color: isSelected
                    ? null
                    : const Color(0xFF160D29).withOpacity(0.7),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected
                      ? Colors.transparent
                      : Colors.white.withOpacity(0.08),
                  width: 0.8,
                ),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: const Color(0xFFFF2E93).withOpacity(0.4),
                          blurRadius: 8,
                        ),
                      ]
                    : null,
              ),
              child: Text(
                _categories[index],
                style: TextStyle(
                  color: isSelected ? const Color(0xFF0D0B18) : Colors.white70,
                  fontSize: 11.5,
                  fontWeight: isSelected ? FontWeight.w900 : FontWeight.w500,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  /// High-Engagement Discovery Card with Glassmorphism, 4-Bar Equalizer, and Micro-Badges
  Widget _buildLuxuryRoomCard(VoiceRoomSession room) {
    return GestureDetector(
      onTap: () => widget.onJoinRoom(room),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF160D29).withOpacity(0.65),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: Colors.white.withOpacity(0.08),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.6),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Section: Host Wallpaper + Micro-Badges + 4-Bar Equalizer
            Expanded(
              flex: 5,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    room.hostAvatar,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          const Color(0xFF0D0B18).withOpacity(0.85),
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),

                  // Country Flag Micro-Badge
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0D0B18).withOpacity(0.75),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: const Color(0xFFFFD700).withOpacity(0.4),
                          width: 0.8,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(room.countryFlag ?? '🌐',
                              style: const TextStyle(fontSize: 10)),
                          const SizedBox(width: 3),
                          Text(
                            room.country ?? 'Global',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Listeners Pill
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0D0B18).withOpacity(0.75),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.15),
                          width: 0.8,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.headphones,
                              color: Color(0xFFFFD700), size: 10),
                          const SizedBox(width: 3),
                          Text(
                            '${room.listenerCount}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // VIP Agency Stamp Micro-Badge (Bottom Left)
                  Positioned(
                    bottom: 6,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 5, vertical: 1.5),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
                        ),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text('👑', style: TextStyle(fontSize: 8)),
                          SizedBox(width: 2),
                          Text(
                            'VIP AGENCY',
                            style: TextStyle(
                              color: Color(0xFF0D0B18),
                              fontSize: 7.5,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Animated 4-Bar Dynamic Audio Equalizer Widget
                  if (room.isLiveSpeaking)
                    Positioned(
                      bottom: 6,
                      right: 8,
                      child: _build4BarAudioEqualizer(),
                    ),
                ],
              ),
            ),

            // Bottom Section: Title, Host Name, and Occupants Reel
            Expanded(
              flex: 4,
              child: Padding(
                padding: const EdgeInsets.all(9.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      room.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      'Host: ${room.hostName}',
                      style: const TextStyle(
                        color: Color(0xFFFFD700),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),

                    // Occupants Avatars Reel
                    Row(
                      children: [
                        if (room.occupiedMicAvatars.isNotEmpty)
                          SizedBox(
                            width: 58,
                            height: 18,
                            child: Stack(
                              children: List.generate(
                                room.occupiedMicAvatars.length.clamp(0, 3),
                                (i) => Positioned(
                                  left: i * 13.0,
                                  child: CircleAvatar(
                                    radius: 9,
                                    backgroundColor: const Color(0xFFFFD700),
                                    child: CircleAvatar(
                                      radius: 8,
                                      backgroundImage: NetworkImage(
                                          room.occupiedMicAvatars[i]),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF00F5A0).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(
                              color: const Color(0xFF00F5A0).withOpacity(0.4),
                              width: 0.8,
                            ),
                          ),
                          child: Text(
                            '${room.seatCapacity} Seats',
                            style: const TextStyle(
                              color: Color(0xFF00F5A0),
                              fontSize: 8.5,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Animated 4-Bar Dynamic Audio Equalizer Widget
  Widget _build4BarAudioEqualizer() {
    return AnimatedBuilder(
      animation: _waveController,
      builder: (context, child) {
        final t = _waveController.value * 2 * math.pi;
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 3),
          decoration: BoxDecoration(
            color: const Color(0xFF0D0B18).withOpacity(0.8),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: const Color(0xFF00F5A0).withOpacity(0.5),
              width: 0.8,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildEqBar((math.sin(t) + 1) / 2),
              const SizedBox(width: 2),
              _buildEqBar((math.sin(t + 1.2) + 1) / 2),
              const SizedBox(width: 2),
              _buildEqBar((math.sin(t + 2.4) + 1) / 2),
              const SizedBox(width: 2),
              _buildEqBar((math.sin(t + 3.6) + 1) / 2),
            ],
          ),
        );
      },
    );
  }

  Widget _buildEqBar(double factor) {
    final height = 4.0 + (factor * 9.0);
    return Container(
      width: 2.5,
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFF00F5A0),
        borderRadius: BorderRadius.circular(1.5),
      ),
    );
  }
}
