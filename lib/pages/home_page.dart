import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../components/i18n_provider.dart';
import '../components/package_info_provider.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = ref.watch(i18nProvider);
    final packageInfoAsync = ref.watch(packageInfoProvider);
    final theme = Theme.of(context);

    return Scaffold(
      body: Center(
        child: packageInfoAsync.when(
          data: (info) => _HomeContent(appTitle: strings.appTitle, version: info.version, theme: theme),
          loading: () => _HomeContent(appTitle: strings.appTitle, version: '1.0.0', theme: theme),
          error: (error, stackTrace) => _HomeContent(appTitle: strings.appTitle, version: '1.0.0', theme: theme),
        ),
      ),
    );
  }
}

class _HomeContent extends StatelessWidget {
  const _HomeContent({required this.appTitle, required this.version, required this.theme});

  final String appTitle;
  final String version;
  final ThemeData theme;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 96,
          height: 96,
          decoration: BoxDecoration(color: theme.colorScheme.primaryContainer, shape: BoxShape.circle),
          child: Icon(Icons.north, size: 48, color: theme.colorScheme.onPrimaryContainer),
        ),
        const SizedBox(height: 16),
        Text(appTitle, style: theme.textTheme.headlineMedium),
        const SizedBox(height: 8),
        Text(version, style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
      ],
    );
  }
}
