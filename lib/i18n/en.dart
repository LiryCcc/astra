import 'schema.dart';

class EnI18n implements I18nSchema {
  @override
  String get appTitle => 'Astra';

  @override
  String get navHome => 'Home';

  @override
  String get navTodos => 'Todos';

  @override
  String get navSettings => 'Settings';

  @override
  String get settingsTitle => 'Settings';

  @override
  String get themeSection => 'Theme';

  @override
  String get languageSection => 'Language';

  @override
  String get themeLight => 'Light';

  @override
  String get themeDark => 'Dark';

  @override
  String get themeSystem => 'Auto';

  @override
  String get langZhCn => '中文';

  @override
  String get langEn => 'English';

  @override
  String get langJp => '日本語';

  @override
  String get todosPlaceholder => 'Todos page coming soon';
}
