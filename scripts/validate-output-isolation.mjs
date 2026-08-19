#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { ALLOWED_STATIC_ROOT_ENTRIES, ALLOWED_TOP_LEVEL_IMAGE_ENTRIES } from './asset-isolation-policy.mjs';
import { loadVillaRegistry } from './load-villa-registry.mjs';

const configuredSlug = process.env.VILLA_SLUG?.trim();
const isVercelBuild = process.env.VERCEL === '1';

if (!configuredSlug && !isVercelBuild) {
  console.log('[build-isolation] SKIP: shared local development build retained.');
  process.exit(0);
}

const villas = await loadVillaRegistry();
const selectedVillas = configuredSlug
  ? villas.filter((villa) => villa.slug === configuredSlug && villa.active && villa.visibility !== 'hidden')
  : villas.filter((villa) => villa.active && villa.visibility === 'public');

if (configuredSlug && selectedVillas.length !== 1) {
  throw new Error(`[build-isolation] VILLA_SLUG is unknown, retired, or disabled: ${configuredSlug}`);
}

const expectedSlugs = selectedVillas.map((villa) => villa.slug).sort();
const expectedAssetSlugs = selectedVillas.map((villa) => villa.assetSlug || villa.slug).sort();
const villaRoot = [
  path.resolve('.vercel/output/static/villas'),
  path.resolve('dist/client/villas'),
].find((candidate) => fs.existsSync(candidate));
const generatedSlugs = villaRoot
  ? fs.readdirSync(villaRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  : [];

if (generatedSlugs.join('|') !== expectedSlugs.join('|')) {
  throw new Error(`[build-isolation] Expected routes ${expectedSlugs.join(', ') || '(none)'}, generated ${generatedSlugs.join(', ') || '(none)'}.`);
}

const staticRoot = [
  path.resolve('.vercel/output/static'),
  path.resolve('dist/client'),
].find((candidate) => fs.existsSync(candidate));
const imageRoot = staticRoot ? path.join(staticRoot, 'images') : undefined;
const generatedAssetSlugs = [];

if (staticRoot) {
  const unexpectedStaticEntries = fs.readdirSync(staticRoot, { withFileTypes: true })
    .map((entry) => entry.name)
    .filter((name) => !ALLOWED_STATIC_ROOT_ENTRIES.has(name))
    .sort();

  if (unexpectedStaticEntries.length > 0) {
    throw new Error(`[asset-isolation] Unexpected static-root entries: ${unexpectedStaticEntries.join(', ')}.`);
  }
}

if (imageRoot && fs.existsSync(imageRoot)) {
  const unexpectedTopLevelEntries = fs.readdirSync(imageRoot, { withFileTypes: true })
    .map((entry) => entry.name)
    .filter((name) => !ALLOWED_TOP_LEVEL_IMAGE_ENTRIES.has(name))
    .sort();

  if (unexpectedTopLevelEntries.length > 0) {
    throw new Error(`[asset-isolation] Unexpected top-level image entries: ${unexpectedTopLevelEntries.join(', ')}.`);
  }

  const villasImageRoot = path.join(imageRoot, 'villas');
  if (fs.existsSync(villasImageRoot)) {
    const villaEntries = fs.readdirSync(villasImageRoot, { withFileTypes: true });
    const unexpectedVillaEntries = villaEntries
      .filter((entry) => !entry.isDirectory() || !expectedAssetSlugs.includes(entry.name))
      .map((entry) => entry.name)
      .sort();

    if (unexpectedVillaEntries.length > 0) {
      throw new Error(`[asset-isolation] Unexpected entries inside images/villas: ${unexpectedVillaEntries.join(', ')}.`);
    }

    generatedAssetSlugs.push(...villaEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
  }
}

generatedAssetSlugs.sort();
if (generatedAssetSlugs.join('|') !== expectedAssetSlugs.join('|')) {
  throw new Error(`[asset-isolation] Expected media ${expectedAssetSlugs.join(', ') || '(none)'}, generated ${generatedAssetSlugs.join(', ') || '(none)'}.`);
}

console.log(`[build-isolation] PASS: routes ${generatedSlugs.join(', ') || '(none)'}; media ${generatedAssetSlugs.join(', ') || '(none)'}.`);
