/// MIZO Interactive Gift Sheet Modal
/// Replicates the bottom drawer with coin balances, categories, combo multipliers,
/// and Lottie/SVGA full-screen animation trigger.

import 'package:flutter/material.dart';

class GiftItemData {
  final String id;
  final String name;
  final String arabicName;
  final int coins;
  final String icon;

  const GiftItemData({
    required this.id,
    required this.name,
    required this.arabicName,
    required this.coins,
    required this.icon,
  });
}

class GiftSheetDialog extends StatefulWidget {
  final int userCoins;
  final String receiverName;
  final Function(GiftItemData gift, int combo) onSendGift;

  const GiftSheetDialog({
    super.key,
    required this.userCoins,
    required this.receiverName,
    required this.onSendGift,
  });

  @override
  State<GiftSheetDialog> createState() => _GiftSheetDialogState();
}

class _GiftSheetDialogState extends State<GiftSheetDialog> {
  int _selectedCategoryIndex = 0;
  GiftItemData? _selectedGift;
  int _selectedCombo = 1;

  final List<String> _categories = ['Popular', 'Luxury', 'Romantic', 'Special'];

  final List<GiftItemData> _gifts = const [
    GiftItemData(id: 'gift_super_car', name: 'McLaren P1', arabicName: 'ماكلارين', coins: 18000, icon: '🏎️'),
    GiftItemData(id: 'gift_golden_bike', name: 'Cruiser Bike', arabicName: 'دراجة كروزر', coins: 12000, icon: '🏍️'),
    GiftItemData(id: 'gift_royal_castle', name: 'Imperial Castle', arabicName: 'قصر إمبراطوري', coins: 30000, icon: '🏰'),
    GiftItemData(id: 'gift_super_fans_crest', name: 'Crown Crest', arabicName: 'تاج المعجبين', coins: 6000, icon: '👑'),
    GiftItemData(id: 'gift_red_rose', name: 'Eternal Rose', arabicName: 'وردة أبدية', coins: 100, icon: '🌹'),
    GiftItemData(id: 'gift_diamond_ring', name: 'Solitaire Ring', arabicName: 'خاتم ألماس', coins: 2500, icon: '💍'),
    GiftItemData(id: 'gift_space_rocket', name: 'MIZO Rocket', arabicName: 'صاروخ فضائي', coins: 50000, icon: '🚀'),
  ];

  @override
  void initState() {
    super.initState();
    _selectedGift = _gifts.first;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 480,
      decoration: const BoxDecoration(
        color: Color(0xFF131A2A),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          // Drag handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 12),

          // Header with User Coin Balance & Recharge button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Row(
                  children: [
                    const Icon(Icons.monetization_on, color: Color(0xFFFBBF24), size: 20),
                    const SizedBox(width: 6),
                    Text(
                      '${widget.userCoins}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Recharge',
                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Text(
                  'To: ${widget.receiverName}',
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Categories Bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: List.generate(_categories.length, (index) {
                final isSelected = _selectedCategoryIndex == index;
                return GestureDetector(
                  onTap: () => setState(() => _selectedCategoryIndex = index),
                  child: Container(
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF2563EB) : const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      _categories[index],
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.white60,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 12,
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),

          const SizedBox(height: 12),

          // Gift Grid (8 gifts)
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _gifts.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.8,
              ),
              itemBuilder: (context, index) {
                final gift = _gifts[index];
                final isSelected = _selectedGift?.id == gift.id;

                return GestureDetector(
                  onTap: () => setState(() => _selectedGift = gift),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF1E3A8A).withOpacity(0.5) : const Color(0xFF1E293B).withOpacity(0.4),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF3B82F6) : Colors.transparent,
                        width: 1.5,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          gift.icon,
                          style: const TextStyle(fontSize: 32),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          gift.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.monetization_on, color: Color(0xFFFBBF24), size: 12),
                            const SizedBox(width: 2),
                            Text(
                              '${gift.coins}',
                              style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 11),
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

          // Bottom Bar: Combo selection & Send Button
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: Color(0xFF0F172A),
              border: Border(top: BorderSide(color: Colors.white12)),
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
                    DropdownMenuItem(value: 520, child: Text('x520 I Love You')),
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
                    padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  onPressed: _selectedGift == null
                      ? null
                      : () {
                          widget.onSendGift(_selectedGift!, _selectedCombo);
                          Navigator.pop(context);
                        },
                  child: Text(
                    'Send x$_selectedCombo',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
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
