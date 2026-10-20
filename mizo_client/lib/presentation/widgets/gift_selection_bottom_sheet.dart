/// MIZO Tabbed Gift Selection Bottom Sheet
/// Matches view_gift_panel_main.xml and view_gift_panel_tab_bar.xml
///
/// Categories:
/// - Popular (Normal / Combo)
/// - Luxury (McLaren, Cruiser Bike)
/// - Lucky (Probabilistic cash-back)
/// - VIP (Exclusive to SVIP tiers)

import 'package:flutter/material.dart';
import '../../models/habi_models.dart';

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
  State<GiftSelectionBottomSheet> createState() => _GiftSelectionBottomSheetState();
}

class _GiftSelectionBottomSheetState extends State<GiftSelectionBottomSheet> {
  int _selectedTabIndex = 0; // 0: Popular, 1: Luxury, 2: Lucky, 3: VIP
  GiftJson? _selectedGift;
  int _selectedCombo = 1;
  bool _sendToAllMic = false;
  String? _selectedMemberId;

  final List<String> _tabs = ['Popular', 'Luxury', 'Lucky 🎰', 'VIP 👑'];

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
      height: 480,
      decoration: const BoxDecoration(
        color: Color(0xFF111827),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 10),
          // Handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 12),

          // Header: Coins Balance & Recipient Selector
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Row(
                  children: [
                    const Icon(Icons.monetization_on, color: Color(0xFFFBBF24), size: 18),
                    const SizedBox(width: 4),
                    Text(
                      widget.userCoins.toString(),
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFD97706)]),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text('Recharge', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const Spacer(),

                // "Send All on Mic" switch
                GestureDetector(
                  onTap: () => setState(() => _sendToAllMic = !_sendToAllMic),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: _sendToAllMic ? const Color(0xFF2563EB) : const Color(0xFF1F2937),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _sendToAllMic ? 'All on Mic ✓' : 'Send to All',
                      style: const TextStyle(color: Colors.white, fontSize: 11),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Tabs
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
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF3B82F6) : const Color(0xFF1F2937),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Text(
                      _tabs[index],
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.white60,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 12,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Gifts Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: filteredGifts.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 0.82,
              ),
              itemBuilder: (context, index) {
                final gift = filteredGifts[index];
                final isSelected = _selectedGift?.id == gift.id;

                return GestureDetector(
                  onTap: () => setState(() => _selectedGift = gift),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF1E3A8A).withOpacity(0.4) : const Color(0xFF1F2937).withOpacity(0.6),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF3B82F6) : Colors.transparent,
                        width: 1.5,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          gift.giftType == 4 ? '🚀' : gift.giftType == 2 ? '🏎️' : gift.giftType == 3 ? '🎰' : '🌹',
                          style: const TextStyle(fontSize: 28),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          gift.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.monetization_on, color: Color(0xFFFBBF24), size: 10),
                            const SizedBox(width: 2),
                            Text(
                              gift.cost.toString(),
                              style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Bottom Bar: Combo selection & Send CTA
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFF0F172A),
              border: Border(top: BorderSide(color: Colors.white10)),
            ),
            child: Row(
              children: [
                DropdownButton<int>(
                  value: _selectedCombo,
                  dropdownColor: const Color(0xFF1E293B),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  underline: const SizedBox(),
                  icon: const Icon(Icons.arrow_drop_down, color: Colors.white70),
                  items: const [
                    DropdownMenuItem(value: 1, child: Text('x1 Single')),
                    DropdownMenuItem(value: 10, child: Text('x10 Deca')),
                    DropdownMenuItem(value: 88, child: Text('x88 Luck')),
                    DropdownMenuItem(value: 520, child: Text('x520 Love')),
                    DropdownMenuItem(value: 1314, child: Text('x1314 Forever')),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedCombo = val);
                  },
                ),
                const Spacer(),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEC4899),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  onPressed: _selectedGift == null
                      ? null
                      : () {
                          final targets = _sendToAllMic
                              ? widget.onMicMembers.map((m) => m.id).toList()
                              : (_selectedMemberId != null ? [_selectedMemberId!] : <String>[]);
                          widget.onSend(_selectedGift!, _selectedCombo, targets);
                          Navigator.pop(context);
                        },
                  child: Text(
                    'Send (${(_selectedGift?.cost ?? 0) * _selectedCombo} coins)',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
