# 数据层

## Todo 模型

```dart
@HiveType(typeId: 0)
class Todo {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final bool isCompleted;

  @HiveField(3)
  final DateTime createdAt;

  Todo copyWith({ ... });
}
```

## 存储方案

| 数据      | 存储               | 说明                        |
| --------- | ------------------ | --------------------------- |
| 主题偏好  | shared_preferences | 字符串 `theme_mode`         |
| 语言偏好  | shared_preferences | 字符串 `app_locale`         |
| Todo 列表 | Hive Box           | `Box<Todo>`，key 为 `todos` |

## Repository 接口

```dart
abstract class TodoRepository {
  List<Todo> getAll();
  Future<void> add(Todo todo);
  Future<void> update(Todo todo);
  Future<void> delete(String id);
  Future<void> toggle(String id);
  Future<void> toggleAll(bool completed);
  Future<void> clearCompleted();
}
```

## 状态管理（`store/todo_store.dart`）

```dart
@riverpod
class TodoList extends _$TodoList {
  @override
  List<Todo> build() => ref.watch(todoRepositoryProvider).getAll();

  Future<void> addTodo(String title) async { ... }
  Future<void> toggleTodo(String id) async { ... }
  // ...
}

@riverpod
class TodoFilter extends _$TodoFilter {
  @override
  TodoFilterType build() => TodoFilterType.all;
}

@riverpod
int uncompletedCount(Ref ref) {
  return ref.watch(todoListProvider)
      .where((t) => !t.isCompleted)
      .length;
}
```

## 过滤逻辑

```dart
List<Todo> filteredTodos(List<Todo> todos, TodoFilterType filter) {
  switch (filter) {
    case TodoFilterType.all:       return todos;
    case TodoFilterType.active:    return todos.where((t) => !t.isCompleted).toList();
    case TodoFilterType.completed: return todos.where((t) => t.isCompleted).toList();
  }
}
```

## 初始化

```dart
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  Hive.registerAdapter(TodoAdapter());
  await Hive.openBox<Todo>('todos');
  runApp(const ProviderScope(child: AstraApp()));
}
```
