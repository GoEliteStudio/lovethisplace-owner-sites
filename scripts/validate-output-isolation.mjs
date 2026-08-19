#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { ALLOWED_TOP_LEVEL_IMAGE_ENTRIES } from './asset-isolation-policy.mjs';
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

const imageRoot = [
  path.resolve('.vercel/output/static/images'),
  path.resolve('dist/client/images'),
].find((candidate) => fs.existsSync(candidate));
const generatedAssetSlugs = [];

if (imageRoot) {
  const unexpectedTopLevelEntries = fs.readdirSync(imageRoot, { withFileTypes: true })
    .map((entry) => entry.name)
    .filter((name) => !ALLOWED_TOP_LEVEL_IMAGE_ENTRIES.has(name))
    .sort();

  if (unexpectedTopLevelEntries.length > 0) {
    throw new Error(`[asset-isolation] Unexpected top-level image entries: ${unexpectedTopLevelEntries.join(', ')}.`);
  }

  const villasImageRoot = path.join(imageRoot, 'villas');
  if (fs.existsSync(villasImageRoot)) {
    generatedAssetSlugs.push(...fs.readdirSync(villasImageRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name));
  }
}

generatedAssetSlugs.sort();
if (generatedAssetSlugs.join('|') !== expectedAssetSlugs.join('|')) {
  throw new Error(`[asset-isolation] Expected media ${expectedAssetSlugs.join(', ') || '(none)'}, generated ${generatedAssetSlugs.join(', ') || '(none)'}.`);
}

console.log(`[build-isolation] PASS: routes ${generatedSlugs.join(', ') || '(none)'}; media ${generatedAssetSlugs.join(', ') || '(none)'}.`);
