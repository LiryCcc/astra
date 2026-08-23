import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Verify Windows Runner uses static UCRT (/MT) before release builds.
 *
 * @param {string} workspace Absolute repository root.
 * @returns {void}
 */
export const verifyWindowsStaticLink = (workspace) => {
  const cmakeModule = join(workspace, 'windows/cmake/static_runtime.cmake');
  const cmakeLists = join(workspace, 'windows/CMakeLists.txt');
  const runnerCmake = join(workspace, 'windows/runner/CMakeLists.txt');
  const flutterCmake = join(workspace, 'windows/flutter/CMakeLists.txt');

  for (const filePath of [cmakeModule, cmakeLists, runnerCmake, flutterCmake]) {
    if (!existsSync(filePath)) {
      throw new Error(`Missing build file: ${filePath}`);
    }
  }

  const cmakeListsContent = readFileSync(cmakeLists, 'utf8');
  if (!cmakeListsContent.includes('static_runtime.cmake')) {
    throw new Error('windows/CMakeLists.txt must include windows/cmake/static_runtime.cmake');
  }

  const staticContent = readFileSync(cmakeModule, 'utf8');
  if (!/UCRT|ucrt/.test(staticContent)) {
    throw new Error('windows/cmake/static_runtime.cmake must document UCRT static linking');
  }
  if (!/CMAKE_MSVC_RUNTIME_LIBRARY.*MultiThreaded/.test(staticContent)) {
    throw new Error('windows/cmake/static_runtime.cmake must set CMAKE_MSVC_RUNTIME_LIBRARY to MultiThreaded (/MT)');
  }
  if (!staticContent.includes('APPLY_STATIC_UCRT_RUNTIME')) {
    throw new Error('windows/cmake/static_runtime.cmake must define APPLY_STATIC_UCRT_RUNTIME');
  }

  const runnerContent = readFileSync(runnerCmake, 'utf8');
  if (!runnerContent.includes('apply_static_ucrt_runtime')) {
    throw new Error('windows/runner/CMakeLists.txt must call apply_static_ucrt_runtime');
  }

  const flutterContent = readFileSync(flutterCmake, 'utf8');
  if (!flutterContent.includes('apply_static_ucrt_runtime(flutter_wrapper_plugin)')) {
    throw new Error('windows/flutter/CMakeLists.txt must call apply_static_ucrt_runtime for flutter_wrapper_plugin');
  }
  if (!flutterContent.includes('apply_static_ucrt_runtime(flutter_wrapper_app)')) {
    throw new Error('windows/flutter/CMakeLists.txt must call apply_static_ucrt_runtime for flutter_wrapper_app');
  }

  console.log('Windows static linking: UCRT /MT enabled via windows/cmake/static_runtime.cmake');
};

/**
 * Verify macOS Release build includes StaticLink.xcconfig.
 *
 * @param {string} workspace Absolute repository root.
 * @returns {void}
 */
export const verifyMacosStaticLink = (workspace) => {
  const releaseXcconfig = join(workspace, 'macos/Runner/Configs/Release.xcconfig');
  const staticXcconfig = join(workspace, 'macos/Runner/Configs/StaticLink.xcconfig');

  if (!existsSync(staticXcconfig)) {
    throw new Error(`Missing static link config: ${staticXcconfig}`);
  }

  const releaseContent = readFileSync(releaseXcconfig, 'utf8');
  if (!releaseContent.includes('StaticLink.xcconfig')) {
    throw new Error('Release.xcconfig must include StaticLink.xcconfig');
  }

  console.log('macOS static linking: StaticLink.xcconfig enabled for Release builds');
};

/**
 * Verify static linking configuration for the current platform.
 *
 * @param {string} workspace Absolute repository root.
 * @returns {void}
 */
export const verifyStaticLink = (workspace) => {
  if (process.platform === 'win32') {
    verifyWindowsStaticLink(workspace);
    return;
  }
  if (process.platform === 'darwin') {
    verifyMacosStaticLink(workspace);
    return;
  }
  throw new Error(`configure_static_link is not supported on platform: ${process.platform}`);
};
