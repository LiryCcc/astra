import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app_router.dart';
import 'store/locale_store.dart';
import 'store/theme_store.dart';
import 'utils/app_locale.dart';
import 'utils/app_theme.dart';

class AstraApp extends ConsumerWidget {
  const AstraApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final locale = ref.watch(localeProvider);

    return MaterialApp.router(
      title: 'Astra',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: themeMode,
      locale: locale.toFlutterLocale(),
      supportedLocales: const [
        Locale('zh', 'CN'),
        Locale('en'),
        Locale('ja'),
      ],
      routerConfig: appRouter,
    );
  }
}
