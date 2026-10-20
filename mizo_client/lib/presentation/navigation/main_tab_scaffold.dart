/// MIZO Main Application Shell & Navigation Architecture
/// Reference Base: https://github.com/gemini205799-cyber/yari
/// 
/// Features:
/// 1. Persistent 4-Tab Bottom Navigation (Explore/Rooms, Moments, Messages, Profile)
/// 2. Elevated Center Floating Action Button (Create / Quick-Join Voice Party)
/// 3. IndexedStack state preservation (tab states never dispose or reset on switch)
/// 4. Global Floating Mini-Player Pill when a Voice Room is minimized

import 'package:flutter/material.dart';
import '../screens/home/room_feed_screen.dart';
import '../screens/profile/user_profile_screen.dart';
import '../screens/room/voice_room_screen.dart';
import '../../models/habi_models.dart';

class MainTabScaffold extends StatefulWidget {
  final Locale currentLocale;
  final Function(Locale) onLocaleChange;

  const MainTabScaffold({
    super.key,
    required this.currentLocale,
    required this.onLocaleChange,
  });

  @override
  State<MainTabScaffold> createState() => _MainTabScaffoldState();
}

class _MainTabScaffoldState extends State<MainTabScaffold> {
  int _currentIndex = 0;

  // Minimized Room state for floating audio pill
  VoiceRoomSession? _minimizedRoom;

  void _minimizeRoom(VoiceRoomSession session) {
    setState(() {
      _minimizedRoom = session;
    });
  }

  void _restoreRoom() {
    if (_minimizedRoom == null) return;
    final session = _minimizedRoom!;
    setState(() {
      _minimizedRoom = null;
    });
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => VoiceRoomScreen(
          roomSession: session,
          onMinimize: _minimizeRoom,
        ),
      ),
    );
  }

  void _closeMinimizedRoom() {
    setState(() {
      _minimizedRoom = null;
    });
  }

  void _showCreateRoomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF131A2A),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        String roomTitle = 'Party with Me 🎵';
        int seatType = 12; // 8 or 12
        String selectedCategory = 'Music & Chill';

        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 16,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Start Live Voice Party',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Choose room seats matrix and entertainment category',
                    style: TextStyle(color: Colors.white60, fontSize: 12),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      labelText: 'Room Title',
                      labelStyle: const TextStyle(color: Colors.amberAccent),
                      hintText: 'Enter room name...',
                      hintStyle: const TextStyle(color: Colors.white30),
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.06),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onChanged: (val) => roomTitle = val,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Seat Matrix Layout',
                    style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [8, 12].map((seats) {
                      final isSelected = seatType == seats;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () => setSheetState(() => seatType = seats),
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFF2563EB) : Colors.white.withOpacity(0.06),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isSelected ? const Color(0xFF60A5FA) : Colors.transparent,
                                width: 1.5,
                              ),
                            ),
                            child: Column(
                              children: [
                                Text(
                                  '$seats Seats',
                                  style: TextStyle(
                                    color: isSelected ? Colors.white : Colors.white70,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  seats == 12 ? '3x4 Standard Grid' : '2x4 Intimate Grid',
                                  style: TextStyle(
                                    color: isSelected ? Colors.white70 : Colors.white38,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEC4899),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(25),
                        ),
                        elevation: 4,
                      ),
                      onPressed: () {
                        Navigator.pop(ctx);
                        final newSession = VoiceRoomSession(
                          roomId: '${100000 + (DateTime.now().millisecondsSinceEpoch % 900000)}',
                          title: roomTitle.isNotEmpty ? roomTitle : 'MIZO Live Room',
                          hostName: 'Eyad Trader',
                          hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
                          seatCapacity: seatType,
                          category: selectedCategory,
                          isHost: true,
                        );
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => VoiceRoomScreen(
                              roomSession: newSession,
                              onMinimize: _minimizeRoom,
                            ),
                          ),
                        );
                      },
                      child: const Text(
                        'Launch Voice Room',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: Stack(
        children: [
          // 1. IndexedStack preserves state of all tab views
          IndexedStack(
            index: _currentIndex,
            children: [
              RoomFeedScreen(onJoinRoom: (session) {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => VoiceRoomScreen(
                      roomSession: session,
                      onMinimize: _minimizeRoom,
                    ),
                  ),
                );
              }),
              _buildMomentsPlaceholder(),
              _buildMessagesPlaceholder(),
              UserProfileScreen(
                currentLocale: widget.currentLocale,
                onLocaleChange: widget.onLocaleChange,
              ),
            ],
          ),

          // 2. Global Floating Mini-Player Audio Pill
          if (_minimizedRoom != null)
            Positioned(
              right: 16,
              bottom: 96,
              child: _buildFloatingAudioPill(),
            ),
        ],
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildFloatingAudioPill() {
    return GestureDetector(
      onTap: _restoreRoom,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF831843), Color(0xFF1E1B4B)],
          ),
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: const Color(0xFFF472B6), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFEC4899).withOpacity(0.4),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFFF59E0B),
                  ),
                ),
                CircleAvatar(
                  radius: 14,
                  backgroundImage: NetworkImage(_minimizedRoom!.hostAvatar),
                ),
              ],
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _minimizedRoom!.title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const Row(
                  children: [
                    Icon(Icons.graphic_eq, color: Color(0xFF34D399), size: 12),
                    SizedBox(width: 4),
                    Text(
                      'Live Audio Playing',
                      style: TextStyle(color: Color(0xFF34D399), fontSize: 9, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(width: 10),
            GestureDetector(
              onTap: _closeMinimizedRoom,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black38,
                ),
                child: const Icon(Icons.close, color: Colors.white70, size: 14),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F1523),
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.08))),
      ),
      child: SafeArea(
        top: false,
        child: Container(
          height: 64,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.explore_rounded, 'Rooms'),
              _buildNavItem(1, Icons.auto_awesome_motion_rounded, 'Moments'),
              _buildCenterActionTrigger(),
              _buildNavItem(2, Icons.chat_bubble_outline_rounded, 'Messages', unreadCount: 3),
              _buildNavItem(3, Icons.person_rounded, 'Me'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label, {int unreadCount = 0}) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Icon(
                icon,
                color: isSelected ? const Color(0xFFEC4899) : Colors.white38,
                size: 24,
              ),
              if (unreadCount > 0)
                Positioned(
                  top: -2,
                  right: -6,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEF4444),
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                    child: Text(
                      '$unreadCount',
                      style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: TextStyle(
              color: isSelected ? const Color(0xFFEC4899) : Colors.white38,
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCenterActionTrigger() {
    return GestureDetector(
      onTap: _showCreateRoomSheet,
      child: Container(
        width: 46,
        height: 46,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: const LinearGradient(
            colors: [Color(0xFFEC4899), Color(0xFFF59E0B)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFEC4899).withOpacity(0.4),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: const Icon(Icons.mic, color: Colors.white, size: 24),
      ),
    );
  }

  Widget _buildMomentsPlaceholder() {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      appBar: AppBar(
        title: const Text('Social Moments & Highlights', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: const Color(0xFF0F1523),
        elevation: 0,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04),
              ),
              child: const Icon(Icons.photo_library_outlined, color: Color(0xFFEC4899), size: 48),
            ),
            const SizedBox(height: 16),
            const Text(
              'No new community moments',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
            ),
            const SizedBox(height: 6),
            const Text(
              'Share your voice room highlights with friends',
              style: TextStyle(color: Colors.white38, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessagesPlaceholder() {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      appBar: AppBar(
        title: const Text('Direct Messages & Notifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        backgroundColor: const Color(0xFF0F1523),
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildMessageItem(
            'System Notification',
            'Welcome to MIZO! Claim your 1,000 daily check-in coins.',
            '10:30 AM',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
            isOfficial: true,
          ),
          _buildMessageItem(
            'Tanisha (Host)',
            'Thanks for sending the Gold McLaren! Join my next stage tonight.',
            'Yesterday',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          ),
          _buildMessageItem(
            'MIZO Security Team',
            'Your device DEV-A99B-8140-F22 passed safety audit.',
            'Oct 18',
            'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&q=80',
            isOfficial: true,
          ),
        ],
      ),
    );
  }

  Widget _buildMessageItem(String name, String preview, String time, String avatar, {bool isOfficial = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF131A2A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundImage: NetworkImage(avatar),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    if (isOfficial) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2563EB),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text('OFFICIAL', style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 2),
                Text(preview, style: const TextStyle(color: Colors.white60, fontSize: 11), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          Text(time, style: const TextStyle(color: Colors.white30, fontSize: 10)),
        ],
      ),
    );
  }
}
