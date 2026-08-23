import 'package:go_router/go_router.dart';

import 'components/adaptive_scaffold.dart';
import 'pages/home_page.dart';
import 'pages/settings_page.dart';
import 'pages/todos_page.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => AdaptiveScaffold(child: child),
      routes: [
        GoRoute(path: '/', builder: (context, state) => const HomePage()),
        GoRoute(path: '/todos', builder: (context, state) => const TodosPage()),
        GoRoute(path: '/settings', builder: (context, state) => const SettingsPage()),
      ],
    ),
  ],
);
