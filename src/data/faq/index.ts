/**
 * FAQ System — Villa Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Centralized FAQ system for new villas.
 * Legacy villas continue using their embedded `content.faq` arrays unchanged.
 * 
 * ARCHITECTURE:
 * - masterFaqBank: Central repository of all FAQs with i18n + governance
 * - presets: Pre-configured FAQ collections for villa types
 * - resolver: Resolves FAQs from bank OR legacy, with core/library split
 * - schema: JSON-LD FAQPage schema generator for SEO
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER FAQ BANK
// ═══════════════════════════════════════════════════════════════════════════════

export { 
  masterFaqBank, 
  getFaqById, 
  getFaqsByCategory, 
  getFaqsByTag, 
  getCoreFaqs,
  getSchemaEligibleFaqs,
  FAQ_CATEGORIES 
} from './masterFaqBank';

export type { FaqEntry, FaqTranslation } from './masterFaqBank';

// ═══════════════════════════════════════════════════════════════════════════════
// PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export { 
  presetRegistry,
  faqPresets,  // Legacy alias
  getPreset, 
  listPresets,
  getAllExplicitFaqIds,
  faqMatchesPresetRules,
  cartagenaLuxuryVilla,
  cartagenaBachelorParty,
  cartagenaFamilyRetreat,
  cartagenaCorporateRetreat,
  europeLuxuryVilla,
} from './presets';

export type { FaqPreset, FaqPresetId, GeoScope } from './presets';

// ═══════════════════════════════════════════════════════════════════════════════
// RESOLVER
// ═══════════════════════════════════════════════════════════════════════════════

export { 
  resolveFaqs, 
  getPresetFaqCount, 
  usesNewFaqSystem,
  toFlatFaqs,
  getCategories,
  searchFaqs,
  // Context injection
  renderWithContext,
  injectFaqContext,
  injectContext,
  // Clusters
  getFaqsByCluster,
  getClusters,
} from './resolver';

export type { 
  ResolvedFaq, 
  ResolvedFaqSet,
  FaqLibraryBlocks,
  VillaFaqConfig, 
  LegacyFaq,
  ResolverOptions,
  VillaContext,
} from './resolver';

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export {
  buildFaqSchema,
  buildFaqSchemaFromSet,
  buildFaqSchemaFromLegacy,
  serializeFaqSchema,
  generateFaqSchemaScript,
  validateFaqSchema,
  getSchemaStats,
} from './schema';

export type {
  FaqPageSchema,
  FaqSchemaQuestion,
  SchemaOptions,
  SchemaValidation,
} from './schema';

