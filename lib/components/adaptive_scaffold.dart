import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../components/i18n_provider.dart';
import '../utils/breakpoints.dart';

class AdaptiveScaffold extends ConsumerWidget {
  const AdaptiveScaffold({required this.child, super.key});

  final Widget child;

  static const _destinations = [
    _NavDestination(path: '/', icon: Icons.home_outlined, selectedIcon: Icons.home),
    _NavDestination(path: '/todos', icon: Icons.checklist_outlined, selectedIcon: Icons.checklist),
    _NavDestination(path: '/settings', icon: Icons.settings_outlined, selectedIcon: Icons.settings),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = ref.watch(i18nProvider);
    final width = MediaQuery.sizeOf(context).width;
    final screenType = Breakpoints.screenTypeOf(width);
    final location = GoRouterState.of(context).uri.path;
    final selectedIndex = _selectedIndexForPath(location);

    if (screenType == ScreenType.compact) {
      return Scaffold(
        body: child,
        bottomNavigationBar: NavigationBar(
          selectedIndex: selectedIndex,
          onDestinationSelected: (index) {
            context.go(_destinations[index].path);
          },
          destinations: [
            NavigationDestination(
              icon: Icon(_destinations[0].icon),
              selectedIcon: Icon(_destinations[0].selectedIcon),
              label: strings.navHome,
            ),
            NavigationDestination(
              icon: Icon(_destinations[1].icon),
              selectedIcon: Icon(_destinations[1].selectedIcon),
              label: strings.navTodos,
            ),
            NavigationDestination(
              icon: Icon(_destinations[2].icon),
              selectedIcon: Icon(_destinations[2].selectedIcon),
              label: strings.navSettings,
            ),
          ],
        ),
      );
    }

    final extended = screenType == ScreenType.expanded;

    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            extended: extended,
            selectedIndex: selectedIndex,
            onDestinationSelected: (index) {
              context.go(_destinations[index].path);
            },
            destinations: [
              NavigationRailDestination(
                icon: Icon(_destinations[0].icon),
                selectedIcon: Icon(_destinations[0].selectedIcon),
                label: Text(strings.navHome),
              ),
              NavigationRailDestination(
                icon: Icon(_destinations[1].icon),
                selectedIcon: Icon(_destinations[1].selectedIcon),
                label: Text(strings.navTodos),
              ),
              NavigationRailDestination(
                icon: Icon(_destinations[2].icon),
                selectedIcon: Icon(_destinations[2].selectedIcon),
                label: Text(strings.navSettings),
              ),
            ],
          ),
          Expanded(child: child),
        ],
      ),
    );
  }

  int _selectedIndexForPath(String path) {
    for (var i = 0; i < _destinations.length; i++) {
      if (_destinations[i].path == path) {
        return i;
      }
    }
    return 0;
  }
}

class _NavDestination {
  const _NavDestination({
    required this.path,
    required this.icon,
    required this.selectedIcon,
  });

  final String path;
  final IconData icon;
  final IconData selectedIcon;
}
