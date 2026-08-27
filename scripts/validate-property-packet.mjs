#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file) throw new Error('Usage: node scripts/validate-property-packet.mjs <private-packet.json> [--require-commerce]');
const packet = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
const errors = [];
const missing = (value) => value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
const need = (value, label) => { if (missing(value)) errors.push(label); };

if (packet.schemaVersion !== 1) errors.push('schemaVersion must be 1');
for (const [value, label] of [
  [packet.property?.name, 'property.name'], [packet.property?.slug, 'property.slug'],
  [packet.property?.country, 'property.country'], [packet.property?.region, 'property.region'],
  [packet.property?.maxGuests, 'property.maxGuests'], [packet.property?.bedrooms, 'property.bedrooms'],
  [packet.property?.bathrooms, 'property.bathrooms'], [packet.property?.currency, 'property.currency'],
  [packet.commercial?.model, 'commercial.model'], [packet.publication?.ownerTheme, 'publication.ownerTheme'],
  [packet.inquiry?.recipientEmail, 'inquiry.recipientEmail'], [packet.facts?.ownerConfirmedAt, 'facts.ownerConfirmedAt'],
  [packet.facts?.sourceUrls, 'facts.sourceUrls'], [packet.rates?.ownerVerifiedAt, 'rates.ownerVerifiedAt'],
  [packet.media?.archiveRelativePath, 'media.archiveRelativePath'], [packet.media?.archiveSha256, 'media.archiveSha256'],
  [packet.media?.heroSelections, 'media.heroSelections'], [packet.media?.galleryChapters, 'media.galleryChapters'],
]) need(value, label);

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(packet.property?.slug || '')) errors.push('property.slug format');
if (!['villa', 'yacht'].includes(packet.property?.type)) errors.push('property.type');
if (!['classic', 'heritage-signature'].includes(packet.publication?.ownerTheme)) errors.push('publication.ownerTheme');
if (!['founding_fee', 'commission_only', 'go_elite_showcase'].includes(packet.commercial?.model)) errors.push('commercial.model');
if (!packet.authorization?.privatePreviewAuthorized || !packet.authorization?.mediaUseAuthorized) errors.push('private preview/media authorization');
if ((packet.media?.heroSelections || []).length < 3) errors.push('at least 3 hero selections');
if ((packet.media?.galleryChapters || []).length < 3) errors.push('at least 3 gallery chapters');

if (errors.length) {
  console.error(`NOT BUILD READY: ${errors.join(', ')}`);
  process.exit(1);
}
console.log(`BUILD READY: ${packet.property.name} (${packet.property.slug})`);

const commerceMissing = [];
const cneed = (value, label) => { if (missing(value)) commerceMissing.push(label); };
cneed(packet.policies?.cancellationPolicy, 'cancellation policy');
cneed(packet.policies?.bookingTerms, 'booking terms');
cneed(packet.policies?.legalEntityName, 'legal entity');
cneed(packet.policies?.authorizedSignatories, 'authorized signatories');
if (!packet.commercial?.termsSigned) commerceMissing.push('signed commercial terms');
if (!packet.authorization?.publicPromotionAuthorized) commerceMissing.push('public promotion authorization');
if (commerceMissing.length) {
  console.log(`COMMERCE BLOCKED: ${commerceMissing.join(', ')}`);
  if (process.argv.includes('--require-commerce')) process.exit(2);
} else {
  console.log('COMMERCE READY');
}
