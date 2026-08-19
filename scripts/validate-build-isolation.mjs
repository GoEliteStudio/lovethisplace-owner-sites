#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const configuredSlug = process.env.VILLA_SLUG?.trim();

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

if (!configuredSlug) {
  if (process.env.VERCEL !== '1') {
    console.log('[build-isolation] SKIP: VILLA_SLUG is not set; shared development build retained.');
    process.exit(0);
  }

  const privateOutputs = generatedSlugs.filter((slug) => {
    const slugRoot = path.join(villaRoot, slug);
    const htmlFiles = [];
    const visit = (directory) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(fullPath);
        else if (entry.isFile() && entry.name === 'index.html') htmlFiles.push(fullPath);
      }
    };
    visit(slugRoot);

    return htmlFiles.length === 0 || htmlFiles.every((file) => /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(fs.readFileSync(file, 'utf8')));
  });

  if (privateOutputs.length > 0) {
    throw new Error(`[build-isolation] Shared Vercel build generated private-preview routes: ${privateOutputs.join(', ')}`);
  }

  console.log(`[build-isolation] PASS: shared Vercel build contains public villas only (${generatedSlugs.join(', ')}).`);
  process.exit(0);
}

if (!generatedSlugs.includes(configuredSlug)) {
  throw new Error(`[build-isolation] Expected ${configuredSlug}, generated: ${generatedSlugs.join(', ') || '(none)'}`);
}

const unexpectedSlugs = generatedSlugs.filter((slug) => slug !== configuredSlug);
if (unexpectedSlugs.length > 0) {
  throw new Error(`[build-isolation] Cross-property routes generated: ${unexpectedSlugs.join(', ')}`);
}

console.log(`[build-isolation] PASS: only ${configuredSlug} was generated.`);