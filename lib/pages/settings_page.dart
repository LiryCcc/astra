import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../components/content_container.dart';
import '../components/i18n_provider.dart';
import '../store/locale_store.dart';
import '../store/theme_store.dart';
import '../utils/app_locale.dart';
import '../utils/app_theme_preference.dart';

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = ref.watch(i18nProvider);
    final themePreference = ref.watch(themePreferenceProvider);
    final locale = ref.watch(localeProvider);

    return Scaffold(
      appBar: AppBar(title: Text(strings.settingsTitle)),
      body: ContentContainer(
        maxWidth: 720,
        child: ListView(
          padding: const EdgeInsets.symmetric(vertical: 8),
          children: [
            _SectionHeader(title: strings.themeSection),
            RadioGroup<AppThemePreference>(
              groupValue: themePreference,
              onChanged: (value) {
                if (value != null) {
                  ref.read(themePreferenceProvider.notifier).setPreference(value);
                }
              },
              child: Column(
                children: [
                  RadioListTile<AppThemePreference>(
                    value: AppThemePreference.light,
                    title: Text(strings.themeLight),
                  ),
                  RadioListTile<AppThemePreference>(
                    value: AppThemePreference.dark,
                    title: Text(strings.themeDark),
                  ),
                  RadioListTile<AppThemePreference>(
                    value: AppThemePreference.system,
                    title: Text(strings.themeSystem),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            _SectionHeader(title: strings.languageSection),
            RadioGroup<AppLocale>(
              groupValue: locale,
              onChanged: (value) {
                if (value != null) {
                  ref.read(localeProvider.notifier).setLocale(value);
                }
              },
              child: Column(
                children: [
                  RadioListTile<AppLocale>(
                    value: AppLocale.zhCn,
                    title: Text(strings.langZhCn),
                  ),
                  RadioListTile<AppLocale>(
                    value: AppLocale.en,
                    title: Text(strings.langEn),
                  ),
                  RadioListTile<AppLocale>(
                    value: AppLocale.jp,
                    title: Text(strings.langJp),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleSmall?.copyWith(
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}
