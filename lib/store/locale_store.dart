import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../utils/app_locale.dart';
import 'theme_store.dart';

const localePreferenceKey = 'app_locale';

final localeProvider = NotifierProvider<LocaleNotifier, AppLocale>(LocaleNotifier.new);

class LocaleNotifier extends Notifier<AppLocale> {
  @override
  AppLocale build() {
    final prefs = ref.watch(sharedPreferencesProvider);
    final stored = AppLocaleX.fromStorageKey(prefs.getString(localePreferenceKey));
    if (stored != null) {
      return stored;
    }
    return AppLocaleX.fromSystemLocale(WidgetsBinding.instance.platformDispatcher.locale);
  }

  Future<void> setLocale(AppLocale locale) async {
    state = locale;
    final prefs = ref.read(sharedPreferencesProvider);
    await prefs.setString(localePreferenceKey, locale.storageKey);
  }
}
