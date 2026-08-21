#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { loadVillaRegistry } from './load-villa-registry.mjs';

const configuredSlug = process.env.VILLA_SLUG?.trim();

if (!configuredSlug) {
  console.log('[clean-owner-routes] SKIP: no dedicated VILLA_SLUG configured.');
} else {
  const villas = await loadVillaRegistry();
  const villa = villas.find((candidate) =>
    candidate.slug === configuredSlug
    && candidate.active
    && candidate.visibility !== 'hidden'
  );

  if (!villa) {
    throw new Error(`[clean-owner-routes] VILLA_SLUG is unknown, retired, or disabled: ${configuredSlug}`);
  }

  if (!villa.rootCanonical) {
    console.log(`[clean-owner-routes] SKIP: ${configuredSlug} does not use clean root URLs.`);
  } else {
    const cleanPages = ['', ...villa.auxPages];
    const unsafePage = cleanPages.find((page) => page && !/^[a-z0-9-]+$/.test(page));
    if (unsafePage) {
      throw new Error(`[clean-owner-routes] Unsafe auxiliary route in registry: ${unsafePage}`);
    }

    const staticRoots = [
      path.resolve('.vercel/output/static'),
      path.resolve('dist/client'),
    ].filter((candidate) => fs.existsSync(candidate));

    if (staticRoots.length === 0) {
      throw new Error('[clean-owner-routes] No rendered static output was found.');
    }

    let copied = 0;
    for (const staticRoot of staticRoots) {
      const internalRoot = path.join(staticRoot, 'villas', villa.slug, villa.defaultLang);
      for (const page of cleanPages) {
        const source = path.join(internalRoot, ...(page ? [page] : []), 'index.html');
        const destination = path.join(staticRoot, ...(page ? [page] : []), 'index.html');

        if (!fs.existsSync(source)) {
          throw new Error(`[clean-owner-routes] Missing prerendered source: ${path.relative(process.cwd(), source)}`);
        }

        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.copyFileSync(source, destination);
        copied += 1;
      }
    }

    console.log(`[clean-owner-routes] PASS: materialized ${copied} static clean-route files for ${villa.slug}.`);
  }
}
