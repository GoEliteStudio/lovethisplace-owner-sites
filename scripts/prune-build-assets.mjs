#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { ALLOWED_STATIC_ROOT_ENTRIES, ALLOWED_TOP_LEVEL_IMAGE_ENTRIES } from './asset-isolation-policy.mjs';
import { loadVillaRegistry } from './load-villa-registry.mjs';

const configuredSlug = process.env.VILLA_SLUG?.trim();
const isVercelBuild = process.env.VERCEL === '1';

if (!configuredSlug && !isVercelBuild) {
  console.log('[asset-isolation] SKIP: shared local development build retained.');
  process.exit(0);
}

const villas = await loadVillaRegistry();
const selectedVillas = configuredSlug
  ? villas.filter((villa) => villa.slug === configuredSlug && villa.active && villa.visibility !== 'hidden')
  : villas.filter((villa) => villa.active && villa.visibility === 'public');

if (configuredSlug && selectedVillas.length !== 1) {
  throw new Error(`[asset-isolation] VILLA_SLUG is unknown, retired, or disabled: ${configuredSlug}`);
}

const allowedAssetSlugs = new Set(selectedVillas.map((villa) => villa.assetSlug || villa.slug));
const staticRoots = [
  path.resolve('.vercel/output/static'),
  path.resolve('dist/client'),
].filter((candidate) => fs.existsSync(candidate));
const imageRoots = staticRoots
  .map((staticRoot) => path.join(staticRoot, 'images'))
  .filter((candidate) => fs.existsSync(candidate));

if (imageRoots.length === 0) {
  throw new Error('[asset-isolation] No rendered image directory was found.');
}

const removed = [];
for (const staticRoot of staticRoots) {
  for (const entry of fs.readdirSync(staticRoot, { withFileTypes: true })) {
    if (ALLOWED_STATIC_ROOT_ENTRIES.has(entry.name)) continue;
    fs.rmSync(path.join(staticRoot, entry.name), { recursive: true, force: true });
    removed.push(path.relative(process.cwd(), path.join(staticRoot, entry.name)));
  }
}

for (const imageRoot of imageRoots) {
  const villasRoot = path.join(imageRoot, 'villas');
  if (fs.existsSync(villasRoot)) {
    for (const entry of fs.readdirSync(villasRoot, { withFileTypes: true })) {
      if (entry.isDirectory() && allowedAssetSlugs.has(entry.name)) continue;
      fs.rmSync(path.join(villasRoot, entry.name), { recursive: true, force: true });
      removed.push(path.relative(process.cwd(), path.join(villasRoot, entry.name)));
    }
  }

  for (const entry of fs.readdirSync(imageRoot, { withFileTypes: true })) {
    if (ALLOWED_TOP_LEVEL_IMAGE_ENTRIES.has(entry.name)) continue;
    fs.rmSync(path.join(imageRoot, entry.name), { recursive: true, force: true });
    removed.push(path.relative(process.cwd(), path.join(imageRoot, entry.name)));
  }
}

console.log(`[asset-isolation] PASS: retained ${[...allowedAssetSlugs].join(', ') || '(no property media)'}; removed ${removed.length} unrelated entries.`);
