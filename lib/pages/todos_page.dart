import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../components/i18n_provider.dart';

class TodosPage extends ConsumerWidget {
  const TodosPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = ref.watch(i18nProvider);

    return Scaffold(
      appBar: AppBar(title: Text(strings.navTodos)),
      body: Center(child: Text(strings.todosPlaceholder)),
    );
  }
}
