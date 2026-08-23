import 'package:flutter/material.dart';

class ContentContainer extends StatelessWidget {
  const ContentContainer({
    required this.maxWidth,
    required this.child,
    super.key,
  });

  final double maxWidth;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: child,
      ),
    );
  }
}
