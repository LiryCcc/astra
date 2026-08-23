import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../utils/app_theme_preference.dart';

const themePreferenceKey = 'theme_mode';

final sharedPreferencesProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError('SharedPreferences not initialized'),
);

final themePreferenceProvider =
    NotifierProvider<ThemePreferenceNotifier, AppThemePreference>(
      ThemePreferenceNotifier.new,
    );

final themeModeProvider = Provider<ThemeMode>((ref) {
  return ref.watch(themePreferenceProvider).toThemeMode();
});

class ThemePreferenceNotifier extends Notifier<AppThemePreference> {
  @override
  AppThemePreference build() {
    final prefs = ref.watch(sharedPreferencesProvider);
    final stored = AppThemePreferenceX.fromStorageKey(
      prefs.getString(themePreferenceKey),
    );
    return stored ?? AppThemePreference.system;
  }

  Future<void> setPreference(AppThemePreference preference) async {
    state = preference;
    final prefs = ref.read(sharedPreferencesProvider);
    await prefs.setString(themePreferenceKey, preference.storageKey);
  }
}
