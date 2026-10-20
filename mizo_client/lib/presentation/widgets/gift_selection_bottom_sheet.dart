/// MIZO Ultra-Luxury 3D Gift Selection Bottom Sheet
/// Matches Habi & Yari High-End Social Entertainment Standards.
///
/// Features:
/// - 3D Illuminated Pedestal Gift Cards with metallic gold and neon borders
/// - Categorized tabs: Popular 🔥, Luxury 🏎️, Lucky 🎰, VIP 👑
/// - Selected Gift Feature Inspector strip (shows 3D SVGA/PAG, audio sync, lucky multipliers)
/// - Preset Combo pills (x1, x10, x88, x520, x1314) and rapid Combo Tap button
library;

import 'package:flutter/material.dart';
import '../../models/habi_models.dart';
import 'gift_3d_vector_art.dart';

class GiftSelectionBottomSheet extends StatefulWidget {
  final int userCoins;
  final List<GiftJson> availableGifts;
  final List<MemberJson> onMicMembers;
  final Function(GiftJson gift, int combo, List<String> targetUserIds) onSend;

  const GiftSelectionBottomSheet({
    super.key,
    required this.userCoins,
    required this.availableGifts,
    required this.onMicMembers,
    required this.onSend,
  });

  @override
  State<GiftSelectionBottomSheet> createState() =>
      _GiftSelectionBottomSheetState();
}

class _GiftSelectionBottomSheetState extends State<GiftSelectionBottomSheet> {
  int _selectedTabIndex = 0; // 0: Popular, 1: Luxury, 2: Lucky, 3: VIP
  GiftJson? _selectedGift;
  int _selectedCombo = 1;
  bool _sendToAllMic = false;
  String? _selectedMemberId;

  final List<String> _tabs = [
    'Popular 🔥',
    'Luxury 🏎️',
    'Lucky 🎰',
    'VIP 👑'
  ];

  @override
  void initState() {
    super.initState();
    _selectedGift = widget.availableGifts.firstOrNull;
    _selectedMemberId = widget.onMicMembers.firstOrNull?.id;
  }

  @override
  Widget build(BuildContext context) {
    final filteredGifts = widget.availableGifts.where((g) {
      if (_selectedTabIndex == 0) return g.giftType == 1;
      if (_selectedTabIndex == 1) return g.giftType == 2;
      if (_selectedTabIndex == 2) return g.giftType == 3;
      return g.giftType >= 4;
    }).toList();

    return Container(
      height: 520,
      decoration: BoxDecoration(
        color: const Color(0xFF0D0B18),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(26),
          topRight: Radius.circular(26),
        ),
        border: Border(
          top: BorderSide(
            color: const Color(0xFFFFD700).withOpacity(0.5),
            width: 1.5,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFFD700).withOpacity(0.15),
            blurRadius: 30,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: Column(
        children: [
          const SizedBox(height: 10),
          // Drag Handle
          Container(
            width: 42,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 10),

          // Header: Coins Balance & Recipient Selector
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                // Coin Balance Pill
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF160D29),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFFFFD700).withOpacity(0.4),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFFD700).withOpacity(0.2),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Text('🪙', style: TextStyle(fontSize: 12)),
                      const SizedBox(width: 4),
                      Text(
                        widget.userCoins.toString(),
                        style: const TextStyle(
                          color: Color(0xFFFFD700),
                          fontWeight: FontWeight.w900,
                          fontSize: 13,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                // Recharge CTA
                GestureDetector(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Recharge Gateway Initialized'),
                        backgroundColor: Color(0xFF7C3AED),
                      ),
                    );
                  },
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      '+ Recharge',
                      style: TextStyle(
                        color: Color(0xFF0D0B18),
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),

                const Spacer(),

                // "Send All on Mic" switch
                GestureDetector(
                  onTap: () => setState(() => _sendToAllMic = !_sendToAllMic),
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      gradient: _sendToAllMic
                          ? const LinearGradient(
                              colors: [Color(0xFF7C3AED), Color(0xFFFF2E93)],
                            )
                          : null,
                      color: _sendToAllMic ? null : const Color(0xFF160D29),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: _sendToAllMic
                            ? const Color(0xFFFFD700)
                            : Colors.white12,
                        width: 1,
                      ),
                    ),
                    child: Text(
                      _sendToAllMic ? '✨ All on Mic (8x)' : 'All on Mic',
                      style: TextStyle(
                        color: _sendToAllMic
                            ? Colors.white
                            : Colors.white70,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Category Tabs: Popular, Luxury, Lucky, VIP
          Container(
            height: 36,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _tabs.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final isSelected = _selectedTabIndex == index;
                return GestureDetector(
                  onTap: () => setState(() {
                    _selectedTabIndex = index;
                    _selectedGift = filteredGifts.firstOrNull;
                  }),
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? const LinearGradient(
                              colors: [Color(0xFFFF2E93), Color(0xFFFFD700)],
                            )
                          : null,
                      color: isSelected
                          ? null
                          : const Color(0xFF160D29).withOpacity(0.8),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: isSelected
                            ? Colors.transparent
                            : Colors.white12,
                        width: 1,
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
                      _tabs[index],
                      style: TextStyle(
                        color: isSelected
                            ? const Color(0xFF0D0B18)
                            : Colors.white70,
                        fontWeight: isSelected
                            ? FontWeight.w900
                            : FontWeight.w600,
                        fontSize: 11.5,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 10),

          // 3D Illuminated Gift Pedestal Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              itemCount: filteredGifts.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 0.74,
              ),
              itemBuilder: (context, index) {
                final gift = filteredGifts[index];
                final isSelected = _selectedGift?.id == gift.id;

                return GestureDetector(
                  onTap: () => setState(() => _selectedGift = gift),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? const LinearGradient(
                              colors: [Color(0xFF2B1754), Color(0xFF120826)],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            )
                          : const LinearGradient(
                              colors: [Color(0xFF160D29), Color(0xFF0B0616)],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFFFFD700)
                            : Colors.white.withOpacity(0.08),
                        width: isSelected ? 2.0 : 1.0,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color:
                                    const Color(0xFFFFD700).withOpacity(0.35),
                                blurRadius: 14,
                              ),
                            ]
                          : null,
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Micro Type Badges (SVGA / PAG / Lucky / Combo)
                        if (gift.luckyScore != null)
                          Positioned(
                            top: 5,
                            right: 5,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 4, vertical: 1),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFFDC2626),
                                    Color(0xFFD97706)
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                '50x',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 7.5,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          )
                        else if (gift.pagUrl != null)
                          Positioned(
                            top: 5,
                            right: 5,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 4, vertical: 1),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFFFFD700),
                                    Color(0xFFFFA500)
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'PAG 3D',
                                style: TextStyle(
                                  color: Color(0xFF0D0B18),
                                  fontSize: 7,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          )
                        else if (gift.giftType == 2)
                          Positioned(
                            top: 5,
                            right: 5,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 4, vertical: 1),
                              decoration: BoxDecoration(
                                color: const Color(0xFF7C3AED),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'SVGA',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 7,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ),

                        // Main Gift Card Content
                        Padding(
                          padding: const EdgeInsets.all(6.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              // 3D Glowing Podium Avatar / Visual Icon (Tencent libpag Vector standard)
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: RadialGradient(
                                    colors: [
                                      (isSelected
                                              ? const Color(0xFFFFD700)
                                              : const Color(0xFF7C3AED))
                                          .withOpacity(0.35),
                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                                child: Center(
                                  child: Gift3DVectorArt(
                                    giftId: gift.id,
                                    size: 40,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 4),

                              // Name
                              Text(
                                gift.name,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: isSelected
                                      ? Colors.white
                                      : Colors.white70,
                                  fontSize: 10,
                                  fontWeight: isSelected
                                      ? FontWeight.w900
                                      : FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 3),

                              // Coin Price Pill
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 6, vertical: 1.5),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: const Color(0xFFFFD700)
                                        .withOpacity(0.4),
                                    width: 0.8,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Text('🪙',
                                        style: TextStyle(fontSize: 8)),
                                    const SizedBox(width: 2),
                                    Text(
                                      gift.cost.toString(),
                                      style: const TextStyle(
                                        color: Color(0xFFFFD700),
                                        fontSize: 9,
                                        fontWeight: FontWeight.w900,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Selected Gift Feature Inspector Strip
          if (_selectedGift != null)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF160D29),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFFFFD700).withOpacity(0.3),
                  width: 0.8,
                ),
              ),
              child: Row(
                children: [
                  const Text('✨', style: TextStyle(fontSize: 12)),
                  const SizedBox(width: 6),
                  Text(
                    _selectedGift!.name,
                    style: const TextStyle(
                      color: Color(0xFFFFD700),
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Text('•',
                      style: TextStyle(color: Colors.white30, fontSize: 10)),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      _selectedGift!.luckyScore != null
                          ? 'Lucky Cash-back up to 500x'
                          : (_selectedGift!.pagUrl != null
                              ? 'Full-Screen PAG 3D'
                              : (_selectedGift!.giftType == 2
                                  ? '3D SVGA & Engine Sound'
                                  : 'Rapid Batter Animation')),
                      style: const TextStyle(
                        color: Color(0xFF00F5A0),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Text(
                    '🪙 ${(_selectedGift!.cost * _selectedCombo * (_sendToAllMic ? 8 : 1))}',
                    style: const TextStyle(
                      color: Color(0xFFFFD700),
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
            ),

          // Bottom Bar: Preset Combo Buttons & Send CTA
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF0D0B18),
              border: Border(
                top: BorderSide(
                  color: Colors.white.withOpacity(0.08),
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                // Quick Combo Preset Buttons
                Row(
                  children: [1, 10, 88, 520, 1314].map((num) {
                    final isSel = _selectedCombo == num;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCombo = num),
                      child: Container(
                        margin: const EdgeInsets.only(right: 5),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: isSel
                              ? const LinearGradient(
                                  colors: [
                                    Color(0xFFFFD700),
                                    Color(0xFFFFA500)
                                  ],
                                )
                              : null,
                          color: isSel ? null : const Color(0xFF160D29),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: isSel
                                ? const Color(0xFFFFD700)
                                : Colors.white12,
                          ),
                        ),
                        child: Text(
                          'x$num',
                          style: TextStyle(
                            color: isSel
                                ? const Color(0xFF0D0B18)
                                : Colors.white70,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w900,
                            fontFamily: 'monospace',
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const Spacer(),

                // Send Button with Neon Glow
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    padding: EdgeInsets.zero,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(22),
                    ),
                  ),
                  onPressed: _selectedGift == null
                      ? null
                      : () {
                          final targets = _sendToAllMic
                              ? widget.onMicMembers.map((m) => m.id).toList()
                              : (_selectedMemberId != null
                                  ? [_selectedMemberId!]
                                  : <String>[]);
                          widget.onSend(
                              _selectedGift!, _selectedCombo, targets);
                          Navigator.pop(context);
                        },
                  child: Ink(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFFF2E93), Color(0xFFFFD700)],
                      ),
                      borderRadius: BorderRadius.circular(22),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFFF2E93).withOpacity(0.55),
                          blurRadius: 14,
                        ),
                      ],
                    ),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 10),
                      alignment: Alignment.center,
                      child: Row(
                        children: [
                          const Icon(Icons.send_rounded,
                              size: 14, color: Color(0xFF0D0B18)),
                          const SizedBox(width: 4),
                          Text(
                            'Send (${(_selectedGift?.cost ?? 0) * _selectedCombo * (_sendToAllMic ? 8 : 1)})',
                            style: const TextStyle(
                              color: Color(0xFF0D0B18),
                              fontWeight: FontWeight.w900,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getGiftVisualEmoji(GiftJson gift) {
    if (gift.id.contains('car')) return '🏎️';
    if (gift.id.contains('bike')) return '🏍️';
    if (gift.id.contains('rocket')) return '🚀';
    if (gift.id.contains('wheel')) return '🎰';
    if (gift.id.contains('chest')) return '🪙';
    if (gift.id.contains('crown')) return '👑';
    if (gift.id.contains('palace') || gift.id.contains('castle')) return '🏰';
    if (gift.id.contains('rose')) return '🌹';
    if (gift.id.contains('diamond')) return '💎';
    return '✨';
  }
}
