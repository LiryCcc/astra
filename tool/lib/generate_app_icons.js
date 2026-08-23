import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import toIco from 'to-ico';

import { renderAppIconPng } from './app_icon.js';

/** @typedef {{ file: string; size: number }} IconOutput */

/** @type {Readonly<Record<string, number>>} */
const ANDROID_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

/** @type {readonly IconOutput[]} */
const IOS_ICONS = [
  { file: 'Icon-App-20x20@1x.png', size: 20 },
  { file: 'Icon-App-20x20@2x.png', size: 40 },
  { file: 'Icon-App-20x20@3x.png', size: 60 },
  { file: 'Icon-App-29x29@1x.png', size: 29 },
  { file: 'Icon-App-29x29@2x.png', size: 58 },
  { file: 'Icon-App-29x29@3x.png', size: 87 },
  { file: 'Icon-App-40x40@1x.png', size: 40 },
  { file: 'Icon-App-40x40@2x.png', size: 80 },
  { file: 'Icon-App-40x40@3x.png', size: 120 },
  { file: 'Icon-App-60x60@2x.png', size: 120 },
  { file: 'Icon-App-60x60@3x.png', size: 180 },
  { file: 'Icon-App-76x76@1x.png', size: 76 },
  { file: 'Icon-App-76x76@2x.png', size: 152 },
  { file: 'Icon-App-83.5x83.5@2x.png', size: 167 },
  { file: 'Icon-App-1024x1024@1x.png', size: 1024 }
];

/** @type {readonly IconOutput[]} */
const MACOS_ICONS = [
  { file: 'app_icon_16.png', size: 16 },
  { file: 'app_icon_32.png', size: 32 },
  { file: 'app_icon_64.png', size: 64 },
  { file: 'app_icon_128.png', size: 128 },
  { file: 'app_icon_256.png', size: 256 },
  { file: 'app_icon_512.png', size: 512 },
  { file: 'app_icon_1024.png', size: 1024 }
];

/** @type {readonly number[]} */
const WINDOWS_ICO_SIZES = [16, 32, 48, 64, 128, 256];

/** @type {readonly IconOutput[]} */
const WEB_ICONS = [
  { file: 'Icon-192.png', size: 192 },
  { file: 'Icon-512.png', size: 512 },
  { file: 'Icon-maskable-192.png', size: 192 },
  { file: 'Icon-maskable-512.png', size: 512 }
];

/**
 * @param {string} directory
 * @param {string} filename
 * @param {number} size
 */
const writePng = (directory, filename, size) => {
  mkdirSync(directory, { recursive: true });
  const outputPath = join(directory, filename);
  writeFileSync(outputPath, renderAppIconPng(size));
  console.log(`  ${outputPath} (${size}px)`);
};

/**
 * Generate launcher icons for all platforms from the canvas renderer.
 *
 * @param {string} [workspace] Repository root.
 * @returns {Promise<void>}
 */
export const generateAppIcons = async (workspace = process.cwd()) => {
  console.log('Generating Android launcher icons...');
  for (const [folder, size] of Object.entries(ANDROID_SIZES)) {
    writePng(join(workspace, 'android/app/src/main/res', folder), 'ic_launcher.png', size);
  }

  console.log('Generating iOS app icons...');
  const iosDir = join(workspace, 'ios/Runner/Assets.xcassets/AppIcon.appiconset');
  for (const { file, size } of IOS_ICONS) {
    writePng(iosDir, file, size);
  }

  console.log('Generating macOS app icons...');
  const macosDir = join(workspace, 'macos/Runner/Assets.xcassets/AppIcon.appiconset');
  for (const { file, size } of MACOS_ICONS) {
    writePng(macosDir, file, size);
  }

  console.log('Generating Windows app icon...');
  const windowsDir = join(workspace, 'windows/runner/resources');
  mkdirSync(windowsDir, { recursive: true });
  const icoBuffers = WINDOWS_ICO_SIZES.map((size) => renderAppIconPng(size));
  const icoPath = join(windowsDir, 'app_icon.ico');
  writeFileSync(icoPath, await toIco(icoBuffers));
  console.log(`  ${icoPath} (${WINDOWS_ICO_SIZES.join(', ')}px)`);

  console.log('Generating Web icons...');
  const webIconsDir = join(workspace, 'web/icons');
  for (const { file, size } of WEB_ICONS) {
    writePng(webIconsDir, file, size);
  }
  writePng(join(workspace, 'web'), 'favicon.png', 32);

  console.log('Generating in-app logo...');
  writePng(join(workspace, 'assets/images'), 'app_logo.png', 512);

  console.log('App icons generated.');
};
