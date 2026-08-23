import 'package:flutter/material.dart';

enum AppThemePreference { light, dark, system }

extension AppThemePreferenceX on AppThemePreference {
  String get storageKey {
    switch (this) {
      case AppThemePreference.light:
        return 'light';
      case AppThemePreference.dark:
        return 'dark';
      case AppThemePreference.system:
        return 'system';
    }
  }

  ThemeMode toThemeMode() {
    switch (this) {
      case AppThemePreference.light:
        return ThemeMode.light;
      case AppThemePreference.dark:
        return ThemeMode.dark;
      case AppThemePreference.system:
        return ThemeMode.system;
    }
  }

  static AppThemePreference? fromStorageKey(String? key) {
    switch (key) {
      case 'light':
        return AppThemePreference.light;
      case 'dark':
        return AppThemePreference.dark;
      case 'system':
        return AppThemePreference.system;
      default:
        return null;
    }
  }
}
