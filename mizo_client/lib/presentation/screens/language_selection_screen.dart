/// MIZO Client: First-Launch Language Selector & Settings Switcher
/// Scalable architecture supporting 30 global languages (with English, Bengali, and Arabic as defaults).

import 'package:flutter/material.dart';

class LanguageOption {
  final String code;
  final String name;
  final String nativeName;
  final bool isRtl;
  final String flag;

  const LanguageOption({
    required this.code,
    required this.name,
    required this.nativeName,
    this.isRtl = false,
    required this.flag,
  });
}

class LanguageSelectionScreen extends StatefulWidget {
  final String currentLocale;
  final bool isFirstLaunch;
  final Function(String localeCode, bool isRtl) onLanguageSelected;

  const LanguageSelectionScreen({
    super.key,
    this.currentLocale = 'en',
    this.isFirstLaunch = false,
    required this.onLanguageSelected,
  });

  @override
  State<LanguageSelectionScreen> createState() => _LanguageSelectionScreenState();
}

class _LanguageSelectionScreenState extends State<LanguageSelectionScreen> {
  late String _selectedCode;
  String _searchQuery = '';

  // 30 Scalable Languages list matching Habi values-* directories
  final List<LanguageOption> _languages = const [
    LanguageOption(code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸'),
    LanguageOption(code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Bangladesh)', flag: '🇧🇩'),
    LanguageOption(code: 'ar', name: 'Arabic', nativeName: 'العربية', isRtl: true, flag: '🇸🇦'),
    LanguageOption(code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷'),
    LanguageOption(code: 'ur', name: 'Urdu', nativeName: 'اردو', isRtl: true, flag: '🇵🇰'),
    LanguageOption(code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳'),
    LanguageOption(code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩'),
    LanguageOption(code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳'),
    LanguageOption(code: 'tl', name: 'Tagalog', nativeName: 'Filipino', flag: '🇵🇭'),
    LanguageOption(code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸'),
    LanguageOption(code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷'),
    LanguageOption(code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪'),
    LanguageOption(code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺'),
    LanguageOption(code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷'),
    LanguageOption(code: 'fa', name: 'Persian', nativeName: 'فارسی', isRtl: true, flag: '🇮🇷'),
    LanguageOption(code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪'),
    LanguageOption(code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭'),
    LanguageOption(code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲'),
    LanguageOption(code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾'),
    LanguageOption(code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵'),
    LanguageOption(code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳'),
    LanguageOption(code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰'),
    LanguageOption(code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳'),
    LanguageOption(code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳'),
    LanguageOption(code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵'),
    LanguageOption(code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷'),
    LanguageOption(code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹'),
    LanguageOption(code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴'),
    LanguageOption(code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹'),
    LanguageOption(code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿'),
  ];

  @override
  void initState() {
    super.initState();
    _selectedCode = widget.currentLocale;
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _languages.where((l) =>
        l.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        l.nativeName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        l.code.toLowerCase().contains(_searchQuery.toLowerCase())).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          widget.isFirstLaunch ? 'Select Language' : 'Change Language',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: TextField(
                onChanged: (val) => setState(() => _searchQuery = val),
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Search language...',
                  hintStyle: const TextStyle(color: Colors.white38),
                  prefixIcon: const Icon(Icons.search, color: Colors.white38),
                  filled: true,
                  fillColor: const Color(0xFF1E293B),
                  contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemCount: filtered.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final lang = filtered[index];
                  final isSelected = lang.code == _selectedCode;

                  return InkWell(
                    onTap: () => setState(() => _selectedCode = lang.code),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF2563EB).withOpacity(0.2) : const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? const Color(0xFF3B82F6) : Colors.transparent,
                          width: 1.5,
                        ),
                      ),
                      child: Row(
                        children: [
                          Text(lang.flag, style: const TextStyle(fontSize: 22)),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  lang.nativeName,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  lang.name,
                                  style: const TextStyle(
                                    color: Colors.white54,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (isSelected)
                            const Icon(Icons.check_circle, color: Color(0xFF3B82F6), size: 22),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  final chosen = _languages.firstWhere((l) => l.code == _selectedCode);
                  widget.onLanguageSelected(chosen.code, chosen.isRtl);
                  Navigator.pop(context);
                },
                child: const Text('Confirm Language', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
