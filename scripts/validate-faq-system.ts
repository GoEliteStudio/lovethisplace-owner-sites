/**
 * FAQ System Validation Script
 * Run with: npx tsx scripts/validate-faq-system.ts
 */

import { 
  masterFaqBank, 
  getFaqById, 
  getCoreFaqs,
  getSchemaEligibleFaqs,
  FAQ_CATEGORIES 
} from '../src/data/faq/masterFaqBank';

import { 
  getPreset, 
  listPresets,
  getAllExplicitFaqIds,
  presetRegistry,
  type FaqPresetId
} from '../src/data/faq/presets';

import { 
  resolveFaqs, 
  usesNewFaqSystem,
  toFlatFaqs,
  getCategories,
  searchFaqs,
  renderWithContext,
  injectContext,
  getClusters,
  type VillaFaqConfig,
  type ResolvedFaq,
} from '../src/data/faq/resolver';

import {
  buildFaqSchema,
  buildFaqSchemaFromSet,
  validateFaqSchema,
  getSchemaStats,
} from '../src/data/faq/schema';

// ═══════════════════════════════════════════════════════════════════════════════
// TEST UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean | void): void {
  try {
    const result = fn();
    if (result === false) {
      console.log(`❌ FAIL: ${name}`);
      failed++;
    } else {
      console.log(`✅ PASS: ${name}`);
      passed++;
    }
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error}`);
    failed++;
  }
}

function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER FAQ BANK TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n📚 MASTER FAQ BANK TESTS\n' + '─'.repeat(50));

test('masterFaqBank has entries', () => {
  assert(masterFaqBank.length > 0, 'Bank should not be empty');
  console.log(`   → ${masterFaqBank.length} FAQs in bank`);
});

test('All FAQs have required fields', () => {
  for (const faq of masterFaqBank) {
    assert(!!faq.id, `FAQ missing id`);
    assert(!!faq.category, `FAQ ${faq.id} missing category`);
    assert(!!faq.priority, `FAQ ${faq.id} missing priority`);
    assert(Array.isArray(faq.tags), `FAQ ${faq.id} missing tags array`);
    assert(typeof faq.schemaEligible === 'boolean', `FAQ ${faq.id} missing schemaEligible`);
    assert(Array.isArray(faq.appliesTo), `FAQ ${faq.id} missing appliesTo`);
    assert(!!faq.lastReviewed, `FAQ ${faq.id} missing lastReviewed`);
    assert(!!faq.translations.en, `FAQ ${faq.id} missing English translation`);
    assert(!!faq.translations.en.q, `FAQ ${faq.id} missing English question`);
    assert(!!faq.translations.en.a, `FAQ ${faq.id} missing English answer`);
  }
});

test('No duplicate FAQ IDs', () => {
  const ids = masterFaqBank.map(f => f.id);
  const unique = new Set(ids);
  assert(ids.length === unique.size, `Found ${ids.length - unique.size} duplicate IDs`);
});

test('getFaqById works', () => {
  const faq = getFaqById('booking-min-stay');
  assert(faq !== undefined, 'Should find booking-min-stay');
  assert(faq?.id === 'booking-min-stay');
});

test('getCoreFaqs returns only core priority', () => {
  const coreFaqs = getCoreFaqs();
  assert(coreFaqs.length > 0, 'Should have core FAQs');
  assert(coreFaqs.every(f => f.priority === 'core'), 'All should be core priority');
  console.log(`   → ${coreFaqs.length} core FAQs`);
});

test('getSchemaEligibleFaqs filters correctly', () => {
  const eligible = getSchemaEligibleFaqs();
  assert(eligible.every(f => f.schemaEligible === true), 'All should be schema eligible');
  const ineligible = masterFaqBank.filter(f => !f.schemaEligible);
  console.log(`   → ${eligible.length} eligible, ${ineligible.length} excluded from schema`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🎯 PRESET TESTS\n' + '─'.repeat(50));

test('listPresets returns all presets', () => {
  const presets = listPresets();
  assert(presets.length >= 5, 'Should have at least 5 presets');
  console.log(`   → Presets: ${presets.join(', ')}`);
});

test('All presets have valid structure', () => {
  const presetIds = listPresets();
  for (const presetId of presetIds) {
    const preset = getPreset(presetId);
    assert(preset.id === presetId, `Preset ${presetId} has wrong id`);
    assert(!!preset.name, `Preset ${presetId} missing name`);
    assert(Array.isArray(preset.core), `Preset ${presetId} missing core array`);
    assert(Array.isArray(preset.library), `Preset ${presetId} missing library array`);
    assert(preset.core.length >= 10, `Preset ${presetId} has only ${preset.core.length} core FAQs (need 10+)`);
  }
});

test('All preset FAQ IDs exist in bank', () => {
  const bankIds = new Set(masterFaqBank.map(f => f.id));
  const presetIds = listPresets();
  const missingIds: string[] = [];
  
  for (const presetId of presetIds) {
    const preset = getPreset(presetId);
    const allIds = getAllExplicitFaqIds(preset);
    for (const id of allIds) {
      if (!bankIds.has(id)) {
        missingIds.push(`${presetId}:${id}`);
      }
    }
  }
  
  if (missingIds.length > 0) {
    console.log(`   ⚠️ Missing IDs: ${missingIds.join(', ')}`);
  }
  assert(missingIds.length === 0, `Found ${missingIds.length} missing FAQ IDs in presets`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// RESOLVER TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🔧 RESOLVER TESTS\n' + '─'.repeat(50));

test('Legacy fallback works', () => {
  const legacyFaqs = [
    { q: 'Test question 1?', a: 'Answer 1' },
    { q: 'Test question 2?', a: 'Answer 2' },
  ];
  
  const result = resolveFaqs(undefined, legacyFaqs, 'en');
  assert(result.isLegacy === true, 'Should be marked as legacy');
  assert(result.allFaqs.length === 2, 'Should have 2 FAQs');
  assert(result.coreFaqs.length === 0, 'Legacy should have no core split');
});

test('New system with preset works', () => {
  const config: VillaFaqConfig = {
    faqPreset: 'cartagena-luxury-villa',
  };
  
  const result = resolveFaqs(config, undefined, 'en');
  assert(result.isLegacy === false, 'Should not be legacy');
  assert(result.coreFaqs.length >= 10, `Core should have 10+ FAQs, got ${result.coreFaqs.length}`);
  assert(result.libraryFaqs.length > 0, 'Should have library FAQs');
  assert(result.schemaFaqs.length > 0, 'Should have schema FAQs');
  console.log(`   → Core: ${result.counts.core}, Library: ${result.counts.library}, Schema: ${result.counts.schema}`);
});

test('Spanish translation works', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'es');
  
  const hasSpanish = result.coreFaqs.some(f => 
    f.q.includes('¿') || f.a.includes('á') || f.a.includes('é')
  );
  assert(hasSpanish, 'Should have Spanish content');
});

test('Exclusions work', () => {
  const config: VillaFaqConfig = {
    faqPreset: 'cartagena-luxury-villa',
    excludeFaqIds: ['booking-min-stay'],
  };
  
  const result = resolveFaqs(config, undefined, 'en');
  const hasExcluded = result.allFaqs.some(f => f.id === 'booking-min-stay');
  assert(!hasExcluded, 'Excluded FAQ should not be present');
});

test('usesNewFaqSystem helper works', () => {
  assert(usesNewFaqSystem({ faqPreset: 'cartagena-luxury-villa' }) === true);
  assert(usesNewFaqSystem({ faqIds: ['test'] }) === true);
  assert(usesNewFaqSystem(undefined) === false);
  assert(usesNewFaqSystem({}) === false);
});

test('toFlatFaqs helper works', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  const flat = toFlatFaqs(result);
  
  assert(Array.isArray(flat), 'Should return array');
  assert(flat.length === result.allFaqs.length, 'Should have same length');
  assert(!('id' in flat[0]), 'Should not have id field');
  assert('q' in flat[0] && 'a' in flat[0], 'Should have q and a');
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n📋 SCHEMA TESTS\n' + '─'.repeat(50));

test('buildFaqSchema produces valid structure', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const faqSet = resolveFaqs(config, undefined, 'en');
  const schema = buildFaqSchemaFromSet(faqSet);
  
  assert(schema['@context'] === 'https://schema.org');
  assert(schema['@type'] === 'FAQPage');
  assert(Array.isArray(schema.mainEntity));
  assert(schema.mainEntity.length > 0);
  
  const firstQ = schema.mainEntity[0];
  assert(firstQ['@type'] === 'Question');
  assert(firstQ.name && firstQ.name.length > 0);
  assert(firstQ.acceptedAnswer['@type'] === 'Answer');
  assert(firstQ.acceptedAnswer.text && firstQ.acceptedAnswer.text.length > 0);
});

test('Schema respects maxItems cap', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const faqSet = resolveFaqs(config, undefined, 'en', { maxSchemaItems: 5 });
  const schema = buildFaqSchemaFromSet(faqSet);
  
  assert(schema.mainEntity.length <= 5, `Should have max 5 items, got ${schema.mainEntity.length}`);
});

test('validateFaqSchema catches issues', () => {
  const emptySchema = { '@context': 'https://schema.org' as const, '@type': 'FAQPage' as const, mainEntity: [] };
  const validation = validateFaqSchema(emptySchema);
  assert(validation.isValid === false, 'Empty schema should be invalid');
  assert(validation.errors.length > 0, 'Should have errors');
});

test('getSchemaStats returns correct counts', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const faqSet = resolveFaqs(config, undefined, 'en');
  const schema = buildFaqSchemaFromSet(faqSet);
  const stats = getSchemaStats(schema);
  
  assert(stats.itemCount === schema.mainEntity.length);
  assert(stats.avgQuestionLength > 0);
  assert(stats.avgAnswerLength > 0);
  console.log(`   → ${stats.itemCount} items, avg Q: ${stats.avgQuestionLength} chars, avg A: ${stats.avgAnswerLength} chars`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATION TEST
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🔗 INTEGRATION TEST\n' + '─'.repeat(50));

test('Full workflow simulation', () => {
  // Simulate what would happen in a villa page
  const villaConfig: VillaFaqConfig = {
    faqPreset: 'cartagena-luxury-villa',
    faqIds: [], // Could add custom FAQs here
    excludeFaqIds: [],
  };
  
  // Resolve for Spanish
  const faqSet = resolveFaqs(villaConfig, undefined, 'es');
  
  // Build schema
  const schema = buildFaqSchemaFromSet(faqSet);
  
  // Validate
  const validation = validateFaqSchema(schema);
  
  assert(validation.isValid, `Schema invalid: ${validation.errors.join(', ')}`);
  console.log(`   → Resolved ${faqSet.counts.total} FAQs, ${faqSet.counts.schema} in schema`);
  
  if (validation.warnings.length > 0) {
    console.log(`   ⚠️ Warnings: ${validation.warnings.length}`);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// NEW FEATURE TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🆕 NEW FEATURE TESTS\n' + '─'.repeat(50));

test('3-block structure is generated', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  
  assert(result.blocks !== undefined, 'Should have blocks');
  assert(Array.isArray(result.blocks.core), 'Should have core block');
  assert(Array.isArray(result.blocks.planYourTrip), 'Should have planYourTrip block');
  assert(Array.isArray(result.blocks.deepLibrary), 'Should have deepLibrary block');
  
  console.log(`   → Core: ${result.blocks.core.length}, Plan: ${result.blocks.planYourTrip.length}, Deep: ${result.blocks.deepLibrary.length}`);
});

test('Category grouping works', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  
  assert(result.byCategory !== undefined, 'Should have byCategory');
  const categories = getCategories(result);
  assert(categories.length > 0, 'Should have categories');
  console.log(`   → ${categories.length} categories: ${categories.slice(0, 3).join(', ')}...`);
});

test('Search function works', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  
  // Search for "wifi"
  const wifiResults = searchFaqs(result.allFaqs, 'wifi');
  assert(wifiResults.length > 0, 'Should find wifi FAQ');
  
  // Search for "breakfast"
  const breakfastResults = searchFaqs(result.allFaqs, 'breakfast');
  assert(breakfastResults.length > 0, 'Should find breakfast FAQ');
  
  // Empty search returns all
  const allResults = searchFaqs(result.allFaqs, '');
  assert(allResults.length === result.allFaqs.length, 'Empty search should return all');
  
  console.log(`   → wifi: ${wifiResults.length}, breakfast: ${breakfastResults.length}`);
});

test('i18n stats are tracked', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'es');
  
  assert(result.i18n !== undefined, 'Should have i18n stats');
  assert(result.i18n.requestedLang === 'es', 'Should track requested lang');
  console.log(`   → Lang: ${result.i18n.requestedLang}, Fallbacks: ${result.i18n.fallbacksUsed}, Skipped: ${result.i18n.missingSkipped}`);
});

test('Dedupe count is tracked', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  
  assert(typeof result.counts.dedupedCount === 'number', 'Should have dedupedCount');
  console.log(`   → Deduped: ${result.counts.dedupedCount}`);
});

test('ResolvedFaq has new fields', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  
  const firstFaq = result.allFaqs[0];
  assert(firstFaq.librarySection !== undefined, 'Should have librarySection');
  assert(['core', 'plan-your-trip', 'deep-library'].includes(firstFaq.librarySection), 'Valid librarySection');
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT INJECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🔄 CONTEXT INJECTION TESTS\n' + '─'.repeat(50));

test('renderWithContext replaces tokens', () => {
  const text = 'Welcome to {{villaName}} in {{neighborhood}}. Check-in: {{checkInTime}}.';
  const context = {
    villaName: 'Casa de la Muralla',
    neighborhood: 'Old Town',
    checkInTime: '3:00 PM',
  };
  
  const result = renderWithContext(text, context);
  assert(result.includes('Casa de la Muralla'), 'Should replace villaName');
  assert(result.includes('Old Town'), 'Should replace neighborhood');
  assert(result.includes('3:00 PM'), 'Should replace checkInTime');
  assert(!result.includes('{{'), 'Should have no remaining tokens');
});

test('renderWithContext keeps unknown tokens', () => {
  const text = 'Welcome to {{villaName}}. Airport: {{unknownToken}}.';
  const context = { villaName: 'Test Villa' };
  
  const result = renderWithContext(text, context);
  assert(result.includes('Test Villa'), 'Should replace known token');
  assert(result.includes('{{unknownToken}}'), 'Should keep unknown token');
});

test('injectContext works on full FAQ set', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const faqSet = resolveFaqs(config, undefined, 'en');
  
  const context = {
    villaName: 'Casa de la Muralla',
    neighborhood: 'Getsemani',
    checkInTime: '3:00 PM',
  };
  
  const injected = injectContext(faqSet, context);
  assert(!!injected.coreFaqs, 'Should have coreFaqs');
  assert(!!injected.blocks, 'Should have blocks');
  // Original should be unchanged
  assert(faqSet.coreFaqs.length === injected.coreFaqs.length, 'Should have same count');
});

test('getClusters extracts unique clusters', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  
  const clusters = getClusters(result);
  assert(Array.isArray(clusters), 'Should return array');
  console.log(`   → Clusters: ${clusters.length > 0 ? clusters.join(', ') : '(none yet)'}`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// CLAIM GUARDRAILS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🛡️ CLAIM GUARDRAILS TESTS\n' + '─'.repeat(50));

test('ResolvedFaq includes claimType field', () => {
  const config: VillaFaqConfig = { faqPreset: 'cartagena-luxury-villa' };
  const result = resolveFaqs(config, undefined, 'en');
  
  // claimType can be undefined (defaults to 'none')
  const hasClaimTypeField = result.allFaqs.every(
    faq => faq.claimType === undefined || ['none', 'pricing', 'safety', 'medical', 'legal'].includes(faq.claimType!)
  );
  assert(hasClaimTypeField, 'All FAQs should have valid claimType or undefined');
});

test('buildFaqSchema excludes medical/legal claims', () => {
  // Create mock FAQs with different claimTypes
  const mockFaqs: ResolvedFaq[] = [
    { id: '1', q: 'Safe', a: 'Yes', category: 'test', priority: 'core', schemaEligible: true, librarySection: 'core', claimType: 'none' },
    { id: '2', q: 'Medical', a: 'Advice', category: 'test', priority: 'core', schemaEligible: true, librarySection: 'core', claimType: 'medical' },
    { id: '3', q: 'Legal', a: 'Terms', category: 'test', priority: 'core', schemaEligible: true, librarySection: 'core', claimType: 'legal' },
    { id: '4', q: 'Pricing', a: '$100', category: 'test', priority: 'core', schemaEligible: true, librarySection: 'core', claimType: 'pricing' },
  ];
  
  const schema = buildFaqSchema(mockFaqs);
  
  // Should exclude medical and legal
  assert(schema.mainEntity.length === 2, 'Should exclude medical and legal claims');
  assert(schema.mainEntity.some(q => q.name === 'Safe'), 'Should include safe claim');
  assert(schema.mainEntity.some(q => q.name === 'Pricing'), 'Should include pricing claim');
  assert(!schema.mainEntity.some(q => q.name === 'Medical'), 'Should exclude medical claim');
  assert(!schema.mainEntity.some(q => q.name === 'Legal'), 'Should exclude legal claim');
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(50));
console.log(`\n📊 SUMMARY: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
