/// MIZO User Profile & Wallet Screen
/// Reference Base: https://github.com/gemini205799-cyber/yari
///
/// Features:
/// 1. User Header: Avatar, SVIP 4 Crown, Level 77, ID copy, stats
/// 2. Double-Entry Wallet: Coins & Diamonds matching ProfileWalletBalanceJson
/// 3. In-App Language Selector: Instant switch (EN / BN / AR) with RTL flipping
/// 4. Agency Affiliation & KYC Verification

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../models/habi_models.dart';

class UserProfileScreen extends StatefulWidget {
  final Locale currentLocale;
  final Function(Locale) onLocaleChange;

  const UserProfileScreen({
    super.key,
    required this.currentLocale,
    required this.onLocaleChange,
  });

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  ProfileWalletBalanceJson _wallet = const ProfileWalletBalanceJson(
    coins: 148000,
    diamonds: 45000,
    level: 77,
    svipTier: 4,
    weeklyIncomeUsd: 1450.0,
  );

  void _showLanguageSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF131A2A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Select Application Language',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              const Text(
                'Instant dynamic switching with full LTR/RTL layout orientation',
                style: TextStyle(color: Colors.white54, fontSize: 11),
              ),
              const SizedBox(height: 16),
              _buildLanguageOption(
                ctx,
                code: 'en',
                title: 'English (US & Global)',
                subtitle: 'Default commercial baseline',
                flag: '🇺🇸',
              ),
              _buildLanguageOption(
                ctx,
                code: 'bn',
                title: 'বাংলা (Bengali)',
                subtitle: 'Primary target market (Bangladesh)',
                flag: '🇧🇩',
              ),
              _buildLanguageOption(
                ctx,
                code: 'ar',
                title: 'العربية (Arabic)',
                subtitle: 'Middle East & Gulf (Native RTL Layout)',
                flag: '🇸🇦',
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLanguageOption(
    BuildContext ctx, {
    required String code,
    required String title,
    required String subtitle,
    required String flag,
  }) {
    final isSelected = widget.currentLocale.languageCode == code;

    return GestureDetector(
      onTap: () {
        widget.onLocaleChange(Locale(code));
        Navigator.pop(ctx);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Switched language to $title'),
            duration: const Duration(seconds: 1),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF2563EB).withOpacity(0.2) : Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? const Color(0xFF3B82F6) : Colors.white.withOpacity(0.08),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Text(flag, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: isSelected ? const Color(0xFF60A5FA) : Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                  Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 10)),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle_rounded, color: Color(0xFF3B82F6), size: 20),
          ],
        ),
      ),
    );
  }

  void _showRechargeModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF131A2A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Coin Recharge Packages', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 14),
              Row(
                children: [
                  _buildRechargePack(10000, '\$0.99'),
                  const SizedBox(width: 8),
                  _buildRechargePack(55000, '\$4.99', isPopular: true),
                  const SizedBox(width: 8),
                  _buildRechargePack(120000, '\$9.99'),
                ],
              ),
              const SizedBox(height: 16),
              const Text('Payment via bKash, Nagad, Google Play, Apple Pay, or USDT', style: TextStyle(color: Colors.white54, fontSize: 11)),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF59E0B),
                    foregroundColor: const Color(0xFF0F172A),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () {
                    setState(() {
                      _wallet = ProfileWalletBalanceJson(
                        coins: _wallet.coins + 55000,
                        diamonds: _wallet.diamonds,
                        level: _wallet.level,
                        svipTier: _wallet.svipTier,
                        weeklyIncomeUsd: _wallet.weeklyIncomeUsd,
                      );
                    });
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('+55,000 Coins added to wallet!')),
                    );
                  },
                  child: const Text('Recharge Now (\$4.99)', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRechargePack(int coins, String price, {bool isPopular = false}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isPopular ? const Color(0xFFF59E0B).withOpacity(0.15) : Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isPopular ? const Color(0xFFF59E0B) : Colors.white.withOpacity(0.08),
          ),
        ),
        child: Column(
          children: [
            const Icon(Icons.monetization_on, color: Color(0xFFFBBF24), size: 24),
            const SizedBox(height: 6),
            Text('${coins.toString().substring(0, coins >= 100000 ? 3 : 2)}k Coins', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
            const SizedBox(height: 2),
            Text(price, style: const TextStyle(color: Color(0xFFFBBF24), fontWeight: FontWeight.bold, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F1523),
        elevation: 0,
        title: const Text('My Profile & Wallet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.translate, color: Color(0xFF60A5FA)),
            onPressed: _showLanguageSelector,
            tooltip: 'Language Switcher',
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Colors.white70),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 1. User Identity Header Card
          _buildUserHeaderCard(),

          const SizedBox(height: 16),

          // 2. Double-Entry Financial Wallet Cards
          _buildWalletCards(),

          const SizedBox(height: 16),

          // 3. Operations & Preferences Menu
          _buildSettingsGroup([
            _buildMenuItem(
              icon: Icons.language,
              iconColor: const Color(0xFF60A5FA),
              title: 'Language / ভাষা / لغة',
              subtitle: widget.currentLocale.languageCode == 'bn'
                  ? 'বাংলা (Bengali)'
                  : widget.currentLocale.languageCode == 'ar'
                      ? 'العربية (Arabic - RTL)'
                      : 'English (US & Global)',
              onTap: _showLanguageSelector,
            ),
            _buildMenuItem(
              icon: Icons.business,
              iconColor: const Color(0xFFEC4899),
              title: 'Agency Affiliation',
              subtitle: 'Joined: Dhaka Stars Guild (Code: AG-DHAKA-01)',
              onTap: () {},
            ),
            _buildMenuItem(
              icon: Icons.verified_user_outlined,
              iconColor: const Color(0xFF10B981),
              title: 'Identity & KYC Verification',
              subtitle: 'Identity verified with Passport/NID',
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text('Verified ✓', style: TextStyle(color: Color(0xFF34D399), fontSize: 10, fontWeight: FontWeight.bold)),
              ),
              onTap: () {},
            ),
            _buildMenuItem(
              icon: Icons.phonelink_setup,
              iconColor: const Color(0xFFF59E0B),
              title: 'Trusted Device Security',
              subtitle: 'Bound Device: DEV-A99B-8140-F22',
              onTap: () {},
            ),
          ]),

          const SizedBox(height: 16),

          // 4. Sign out / Switch Account button
          Center(
            child: TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.logout, color: Color(0xFFEF4444), size: 16),
              label: const Text('Log Out of Account', style: TextStyle(color: Color(0xFFEF4444), fontSize: 12, fontWeight: FontWeight.bold)),
            ),
          ),

          const SizedBox(height: 60),
        ],
      ),
    );
  }

  Widget _buildUserHeaderCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E1B4B), Color(0xFF111827)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Avatar with VIP 4 Crown
              Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 68,
                    height: 68,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFEC4899)]),
                    ),
                  ),
                  const CircleAvatar(
                    radius: 31,
                    backgroundImage: NetworkImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'),
                  ),
                  Positioned(
                    top: -2,
                    right: -2,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFFF59E0B),
                        shape: BoxShape.circle,
                      ),
                      child: const Text('👑', style: TextStyle(fontSize: 10)),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 14),

              // Name, Badges & ID
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text(
                          'Eyad Trader',
                          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFD97706)]),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('SVIP ${_wallet.svipTier}', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.black)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text('Lv.${_wallet.level}', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () {
                            Clipboard.setData(const ClipboardData(text: '24064120'));
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('ID 24064120 copied to clipboard')),
                            );
                          },
                          child: const Row(
                            children: [
                              Text('ID: 24064120', style: TextStyle(color: Colors.white60, fontSize: 11, fontFamily: 'monospace')),
                              SizedBox(width: 4),
                              Icon(Icons.copy, color: Colors.white38, size: 11),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Follower / Following Stats
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.04),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _StatColumn(label: 'Following', count: '142'),
                _StatColumn(label: 'Followers', count: '2.8k'),
                _StatColumn(label: 'Visitors', count: '18.4k'),
                _StatColumn(label: 'Gift Level', count: 'Lv.77'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWalletCards() {
    return Row(
      children: [
        // Coins Card
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF78350F), Color(0xFF451A03)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('🪙 Coins Balance', style: TextStyle(color: Color(0xFFFDE68A), fontSize: 11, fontWeight: FontWeight.bold)),
                    Icon(Icons.account_balance_wallet, color: Color(0xFFFBBF24), size: 14),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  _wallet.coins.toString(),
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900, fontFamily: 'monospace'),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: _showRechargeModal,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF59E0B),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text('+ Recharge', style: TextStyle(color: Color(0xFF0F172A), fontSize: 10, fontWeight: FontWeight.black)),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),

        // Diamonds Card
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF831843), Color(0xFF500724)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFEC4899).withOpacity(0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('💎 Diamond Earned', style: TextStyle(color: Color(0xFFFBCFE8), fontSize: 11, fontWeight: FontWeight.bold)),
                    Icon(Icons.diamond_outlined, color: Color(0xFFF472B6), size: 14),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  _wallet.diamonds.toString(),
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900, fontFamily: 'monospace'),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Withdrawal request forwarded to Agency Portal')),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEC4899),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text('Withdraw USD', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsGroup(List<Widget> items) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131A2A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(children: items),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    Widget? trailing,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: iconColor.withOpacity(0.12),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: iconColor, size: 20),
      ),
      title: Text(title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
      subtitle: Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 10)),
      trailing: trailing ?? const Icon(Icons.chevron_right, color: Colors.white30, size: 18),
    );
  }
}

class _StatColumn extends StatelessWidget {
  final String label;
  final String count;

  const _StatColumn({required this.label, required this.count});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(count, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: Colors.white38, fontSize: 10)),
      ],
    );
  }
}
