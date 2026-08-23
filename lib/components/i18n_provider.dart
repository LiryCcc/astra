import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../i18n/en.dart';
import '../i18n/jp.dart';
import '../i18n/schema.dart';
import '../i18n/zh_cn.dart';
import '../store/locale_store.dart';
import '../utils/app_locale.dart';

final i18nProvider = Provider<I18nSchema>((ref) {
  final locale = ref.watch(localeProvider);
  switch (locale) {
    case AppLocale.zhCn:
      return ZhCnI18n();
    case AppLocale.en:
      return EnI18n();
    case AppLocale.jp:
      return JpI18n();
  }
});
