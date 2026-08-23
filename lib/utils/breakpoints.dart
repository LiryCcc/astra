enum ScreenType { compact, medium, expanded }

abstract final class Breakpoints {
  static const double compact = 600;
  static const double medium = 1200;

  static ScreenType screenTypeOf(double width) {
    if (width < compact) {
      return ScreenType.compact;
    }
    if (width < medium) {
      return ScreenType.medium;
    }
    return ScreenType.expanded;
  }
}
