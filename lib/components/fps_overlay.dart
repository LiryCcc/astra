import 'dart:ui';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

/// Debug-only floating overlay that shows the current rendering frame rate.
class FpsOverlay extends StatefulWidget {
  const FpsOverlay({required this.child, super.key});

  final Widget child;

  @override
  State<FpsOverlay> createState() => _FpsOverlayState();
}

class _FpsOverlayState extends State<FpsOverlay> {
  static const _sampleWindow = 30;

  final List<double> _samples = <double>[];
  double _fps = 0;
  double _top = 8;
  double _right = 8;
  TimingsCallback? _timingsCallback;

  @override
  void initState() {
    super.initState();
    if (!kDebugMode) {
      return;
    }

    _timingsCallback = (List<FrameTiming> timings) {
      var updated = false;
      for (final timing in timings) {
        final microseconds = timing.totalSpan.inMicroseconds;
        if (microseconds <= 0) {
          continue;
        }
        _samples.add(1000000 / microseconds);
        updated = true;
      }
      while (_samples.length > _sampleWindow) {
        _samples.removeAt(0);
      }
      if (!updated || !mounted) {
        return;
      }

      final nextFps = _samples.reduce((a, b) => a + b) / _samples.length;
      if ((nextFps - _fps).abs() < 0.5) {
        return;
      }
      setState(() => _fps = nextFps);
    };
    SchedulerBinding.instance.addTimingsCallback(_timingsCallback!);
  }

  @override
  void dispose() {
    final callback = _timingsCallback;
    if (callback != null) {
      SchedulerBinding.instance.removeTimingsCallback(callback);
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!kDebugMode) {
      return widget.child;
    }

    final padding = MediaQuery.paddingOf(context);
    final displayFps = _fps > 0 ? _fps.toStringAsFixed(1) : '--';
    final color = _fpsColor(_fps);

    return Stack(
      clipBehavior: Clip.none,
      children: [
        widget.child,
        Positioned(
          top: padding.top + _top,
          right: padding.right + _right,
          child: GestureDetector(
            onPanUpdate: (details) {
              setState(() {
                _top = (_top + details.delta.dy).clamp(0, 2000);
                _right = (_right - details.delta.dx).clamp(0, 2000);
              });
            },
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: const Color(0xB8000000),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: color.withValues(alpha: 0.65)),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                child: Text(
                  '$displayFps FPS',
                  style: TextStyle(
                    color: color,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    height: 1,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Color _fpsColor(double fps) {
    if (fps <= 0) {
      return Colors.white70;
    }
    if (fps >= 55) {
      return const Color(0xFF4ADE80);
    }
    if (fps >= 30) {
      return const Color(0xFFFACC15);
    }
    return const Color(0xFFF87171);
  }
}
