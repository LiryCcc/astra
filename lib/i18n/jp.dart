import 'schema.dart';

class JpI18n implements I18nSchema {
  @override
  String get appTitle => 'Astra';

  @override
  String get navHome => 'ホーム';

  @override
  String get navTodos => 'Todo';

  @override
  String get navSettings => '設定';

  @override
  String get settingsTitle => '設定';

  @override
  String get themeSection => 'テーマ';

  @override
  String get languageSection => '言語';

  @override
  String get themeLight => 'ライト';

  @override
  String get themeDark => 'ダーク';

  @override
  String get themeSystem => '自動';

  @override
  String get langZhCn => '中文';

  @override
  String get langEn => 'English';

  @override
  String get langJp => '日本語';

  @override
  String get todosPlaceholder => 'Todoページは準備中です';
}
