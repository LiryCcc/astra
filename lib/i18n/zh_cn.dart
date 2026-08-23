import 'schema.dart';

class ZhCnI18n implements I18nSchema {
  @override
  String get appTitle => 'Astra';

  @override
  String get navHome => '首页';

  @override
  String get navTodos => '待办';

  @override
  String get navSettings => '设置';

  @override
  String get settingsTitle => '设置';

  @override
  String get themeSection => '主题';

  @override
  String get languageSection => '语言';

  @override
  String get themeLight => '日间';

  @override
  String get themeDark => '夜间';

  @override
  String get themeSystem => '自动';

  @override
  String get langZhCn => '中文';

  @override
  String get langEn => 'English';

  @override
  String get langJp => '日本語';

  @override
  String get todosPlaceholder => '待办页面开发中';
}
