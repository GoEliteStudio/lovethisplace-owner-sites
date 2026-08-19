#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const configuredSlug = process.env.VILLA_SLUG?.trim();

if (!configuredSlug) {
  if (process.env.VERCEL === '1') {
    throw new Error('[build-isolation] VILLA_SLUG is required for every Vercel owner-site deployment.');
  }

  console.log('[build-isolation] SKIP: VILLA_SLUG is not set; shared development build retained.');
  process.exit(0);
}

const candidateRoots = [
  path.resolve('.vercel/output/static/villas'),
  path.resolve('dist/client/villas'),
];
const villaRoot = candidateRoots.find((candidate) => fs.existsSync(candidate));

if (!villaRoot) {
  throw new Error('[build-isolation] Villa output directory was not generated.');
}

const generatedSlugs = fs.readdirSync(villaRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!generatedSlugs.includes(configuredSlug)) {
  throw new Error(`[build-isolation] Expected ${configuredSlug}, generated: ${generatedSlugs.join(', ') || '(none)'}`);
}

const unexpectedSlugs = generatedSlugs.filter((slug) => slug !== configuredSlug);
if (unexpectedSlugs.length > 0) {
  throw new Error(`[build-isolation] Cross-property routes generated: ${unexpectedSlugs.join(', ')}`);
}

console.log(`[build-isolation] PASS: only ${configuredSlug} was generated.`);