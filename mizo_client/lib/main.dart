/// MIZO Flutter Client Application Entry Point
/// Reference Base: https://github.com/gemini205799-cyber/yari
///
/// Features:
/// 1. Dynamic Tri-Lingual Support (EN, BN, AR) with native RTL/LTR layout flipping
/// 2. Boots into MainTabScaffold (Persistent 4-tab IndexedStack + Floating Mini-Player)
/// 3. Dark entertainment theme with emerald mic badges and gold accents

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'presentation/navigation/main_tab_scaffold.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF0F1523),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const MizoClientApp());
}

class MizoClientApp extends StatefulWidget {
  const MizoClientApp({super.key});

  @override
  State<MizoClientApp> createState() => _MizoClientAppState();
}

class _MizoClientAppState extends State<MizoClientApp> {
  Locale _currentLocale = const Locale('en');

  void _changeLocale(Locale newLocale) {
    setState(() {
      _currentLocale = newLocale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MIZO Live Voice Party',
      debugShowCheckedModeBanner: false,
      locale: _currentLocale,
      supportedLocales: const [
        Locale('en', 'US'),
        Locale('bn', 'BD'),
        Locale('ar', 'SA'),
      ],
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF090D16),
        primaryColor: const Color(0xFFEC4899),
        fontFamily: _currentLocale.languageCode == 'ar' ? 'Tajawal' : 'Plus Jakarta Sans',
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFEC4899),
          secondary: Color(0xFFF59E0B),
          surface: Color(0xFF131A2A),
        ),
      ),
      home: MainTabScaffold(
        currentLocale: _currentLocale,
        onLocaleChange: _changeLocale,
      ),
    );
  }
}
