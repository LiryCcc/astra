import 'package:flutter/material.dart';

enum AppLocale { zhCn, en, jp }

extension AppLocaleX on AppLocale {
  String get storageKey {
    switch (this) {
      case AppLocale.zhCn:
        return 'zh_cn';
      case AppLocale.en:
        return 'en';
      case AppLocale.jp:
        return 'jp';
    }
  }

  Locale toFlutterLocale() {
    switch (this) {
      case AppLocale.zhCn:
        return const Locale('zh', 'CN');
      case AppLocale.en:
        return const Locale('en');
      case AppLocale.jp:
        return const Locale('ja');
    }
  }

  static AppLocale? fromStorageKey(String? key) {
    switch (key) {
      case 'zh_cn':
        return AppLocale.zhCn;
      case 'en':
        return AppLocale.en;
      case 'jp':
        return AppLocale.jp;
      default:
        return null;
    }
  }

  static AppLocale fromSystemLocale(Locale? locale) {
    if (locale == null) {
      return AppLocale.en;
    }
    final languageCode = locale.languageCode;
    if (languageCode == 'zh') {
      return AppLocale.zhCn;
    }
    if (languageCode == 'ja') {
      return AppLocale.jp;
    }
    return AppLocale.en;
  }
}
