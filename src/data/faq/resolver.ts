/**
 * FAQ Resolver — Villa Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Resolves FAQs for a villa from either:
 * 1. NEW VILLAS: Master FAQ Bank (via preset + custom IDs)
 * 2. LEGACY VILLAS: Embedded `content.faq` array (unchanged)
 * 
 * FEATURES:
 * - Core/Library/Schema separation
 * - Deduplication via canonicalId resolution
 * - i18n with proper fallbacks (never breaks on missing translation)
 * - Category-balanced schema selection for SEO breadth
 * - 3-block library structure (core, plan-your-trip, deep-library)
 * - Neighborhood/POI context filtering
 */

import { masterFaqBank, FAQ_CLUSTERS, FAQ_CATEGORIES, type FaqEntry } from './masterFaqBank';
import { 
  getPreset, 
  faqMatchesPresetRules,
  type FaqPreset,
  type FaqPresetId 
} from './presets';

// Re-export for convenience
export { FAQ_CLUSTERS, FAQ_CATEGORIES } from './masterFaqBank';

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Villa context for template token replacement in FAQ answers */
export interface VillaContext {
  villaName: string;
  neighborhood?: string;
  city?: string;
  checkInTime?: string;    // e.g., "3:00 PM"
  checkOutTime?: string;   // e.g., "11:00 AM"
  conciergeHours?: string; // e.g., "24/7"
  staffLead?: string;      // e.g., "Maria"
  airportCode?: string;    // e.g., "CTG"
  airportName?: string;    // e.g., "Rafael Núñez International Airport"
  currency?: string;       // e.g., "COP" or "USD"
  timezone?: string;       // e.g., "America/Bogota"
  /** Any additional custom tokens */
  [key: string]: string | undefined;
}

/** Resolved FAQ ready for rendering */
export interface ResolvedFaq {
  id: string;
  category: string;
  q: string;
  a: string;
  priority: 'core' | 'standard' | 'optional';
  schemaEligible: boolean;
  /** For 3-block layout */
  librarySection: 'core' | 'plan-your-trip' | 'deep-library';
  /** Neighborhoods this FAQ applies to (for geo-filtering) */
  neighborhoods?: string[];
  /** Points of interest mentioned */
  poi?: string[];
  /** Search aliases for client-side matching */
  aliases?: string[];
  /** Topic cluster for related FAQ grouping */
  cluster?: string;
  /** Type of claim (for schema safety guardrails) */
  claimType?: 'none' | 'pricing' | 'safety' | 'medical' | 'legal';
  /** Whether this FAQ needs a disclaimer */
  requiresDisclaimer?: boolean;
}

/** 3-block library structure for premium UX */
export interface FaqLibraryBlocks {
  /** Core FAQs (10-15) - always visible */
  core: ResolvedFaq[];
  /** Plan Your Trip (30-80) - main accordion */
  planYourTrip: ResolvedFaq[];
  /** Deep Library (everything else) - searchable */
  deepLibrary: ResolvedFaq[];
}

/** Structured resolver output for new villas */
export interface ResolvedFaqSet {
  /** 10-15 essential FAQs for hero/summary block */
  coreFaqs: ResolvedFaq[];
  
  /** All FAQs for full accordion library view */
  libraryFaqs: ResolvedFaq[];
  
  /** Schema-eligible FAQs (category-balanced, capped for JSON-LD) */
  schemaFaqs: ResolvedFaq[];
  
  /** All FAQs combined (for legacy component compatibility) */
  allFaqs: ResolvedFaq[];
  
  /** 3-block structure for premium UX */
  blocks: FaqLibraryBlocks;
  
  /** FAQs grouped by category (for chips/filtering) */
  byCategory: Record<string, ResolvedFaq[]>;
  
  /** Whether this villa uses legacy embedded FAQs */
  isLegacy: boolean;
  
  /** Counts for debugging/display */
  counts: {
    core: number;
    library: number;
    schema: number;
    total: number;
    dedupedCount: number;  // How many duplicates were removed
  };
  
  /** Translation stats */
  i18n: {
    requestedLang: string;
    fallbacksUsed: number;
    missingSkipped: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Villa FAQ configuration (for new villas) */
export interface VillaFaqConfig {
  /** Preset ID from presets.ts */
  faqPreset?: FaqPresetId;
  
  /** Additional FAQ IDs to include (custom for this villa) */
  faqIds?: string[];
  
  /** FAQ IDs to exclude from preset */
  excludeFaqIds?: string[];
  
  /** Filter to specific neighborhoods (geo-SEO) */
  neighborhoods?: string[];
}

/** Legacy FAQ format (from existing villa JSONs) */
export interface LegacyFaq {
  category?: string;
  q: string;
  a: string;
}

/** Resolver options */
export interface ResolverOptions {
  /** Maximum FAQs to include in schema (default: 50) */
  maxSchemaItems?: number;
  
  /** Include rule-based FAQs from preset (default: true) */
  applyPresetRules?: boolean;
  
  /** Enable category balancing for schema (default: true) */
  balanceSchemaCategories?: boolean;
  
  /** Strict i18n: skip FAQs with missing translations (default: false = use fallback) */
  strictI18n?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY PRIORITY FOR SCHEMA BALANCING
// ═══════════════════════════════════════════════════════════════════════════════

/** Categories in priority order for schema selection (ensures breadth) */
const SCHEMA_CATEGORY_PRIORITY = [
  FAQ_CATEGORIES.BOOKING_PAYMENT,
  FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
  FAQ_CATEGORIES.SAFETY_SECURITY,
  FAQ_CATEGORIES.HOUSE_RULES,
  FAQ_CATEGORIES.STAFF_SERVICE,
  FAQ_CATEGORIES.FOOD_DINING,
  FAQ_CATEGORIES.TECHNOLOGY,
  FAQ_CATEGORIES.FAMILIES_KIDS,
  FAQ_CATEGORIES.REMOTE_WORK,
  FAQ_CATEGORIES.ACCESSIBILITY,
  FAQ_CATEGORIES.PETS,
  FAQ_CATEGORIES.PRIVACY_VIP,
  FAQ_CATEGORIES.EXCURSIONS,
  FAQ_CATEGORIES.NIGHTLIFE,
  FAQ_CATEGORIES.EVENTS_WEDDINGS,
  FAQ_CATEGORIES.LOCATION,
  FAQ_CATEGORIES.BEACH_CLUBS,
  FAQ_CATEGORIES.AMENITIES,
  FAQ_CATEGORIES.WEATHER_CLIMATE,
  FAQ_CATEGORIES.SPORTS_WELLNESS,
  FAQ_CATEGORIES.SUSTAINABILITY,
  FAQ_CATEGORIES.CONTENT_PRODUCTION,
];

/** Max items per category in schema (prevents 40 booking questions) */
const MAX_PER_CATEGORY_IN_SCHEMA = 6;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN RESOLVER
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_MAX_SCHEMA_ITEMS = 50;

/**
 * Resolve FAQs for a villa
 */
export function resolveFaqs(
  config: VillaFaqConfig | undefined,
  legacyFaqs: LegacyFaq[] | undefined,
  language: string,
  options: ResolverOptions = {}
): ResolvedFaqSet {
  const { 
    maxSchemaItems = DEFAULT_MAX_SCHEMA_ITEMS,
    applyPresetRules = true,
    balanceSchemaCategories = true,
    strictI18n = false,
  } = options;

  // ─────────────────────────────────────────────────────────────────────────────
  // LEGACY PATH: If villa has embedded FAQs and no new config, use them as-is
  // ─────────────────────────────────────────────────────────────────────────────
  if (!config?.faqPreset && !config?.faqIds && legacyFaqs?.length) {
    return resolveLegacyFaqs(legacyFaqs, maxSchemaItems, language);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // NEW PATH: Resolve from Master FAQ Bank
  // ─────────────────────────────────────────────────────────────────────────────
  const preset = config?.faqPreset ? getPreset(config.faqPreset) : null;
  
  // Collect all FAQ IDs (core + library + rule-based)
  const coreIds = new Set<string>(preset?.core || []);
  const libraryIds = new Set<string>(preset?.library || []);
  
  // Add custom FAQ IDs to library
  config?.faqIds?.forEach(id => libraryIds.add(id));
  
  // Add rule-based FAQs from bank
  if (applyPresetRules && preset) {
    for (const faq of masterFaqBank) {
      if (!coreIds.has(faq.id) && !libraryIds.has(faq.id)) {
        if (faqMatchesPresetRules(faq, preset)) {
          libraryIds.add(faq.id);
        }
      }
    }
  }
  
  // Remove excluded FAQs
  config?.excludeFaqIds?.forEach(id => {
    coreIds.delete(id);
    libraryIds.delete(id);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // DEDUPE: Resolve canonical IDs
  // ─────────────────────────────────────────────────────────────────────────────
  const { 
    resolvedCoreIds, 
    resolvedLibraryIds, 
    dedupedCount 
  } = deduplicateFaqIds(coreIds, libraryIds);

  // ─────────────────────────────────────────────────────────────────────────────
  // RESOLVE FAQ ENTRIES WITH i18n
  // ─────────────────────────────────────────────────────────────────────────────
  const i18nStats = { requestedLang: language, fallbacksUsed: 0, missingSkipped: 0 };
  
  const coreFaqs = resolveIdsWithI18n(resolvedCoreIds, language, strictI18n, i18nStats, 'core');
  const libraryFaqs = resolveIdsWithI18n(resolvedLibraryIds, language, strictI18n, i18nStats, 'library');
  
  // Filter by neighborhood if specified
  const filteredCore = config?.neighborhoods 
    ? filterByNeighborhood(coreFaqs, config.neighborhoods)
    : coreFaqs;
  const filteredLibrary = config?.neighborhoods
    ? filterByNeighborhood(libraryFaqs, config.neighborhoods)
    : libraryFaqs;
  
  const allFaqs = [...filteredCore, ...filteredLibrary];
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BUILD SCHEMA FAQs (category-balanced)
  // ─────────────────────────────────────────────────────────────────────────────
  const schemaFaqs = balanceSchemaCategories
    ? buildCategoryBalancedSchema(filteredCore, filteredLibrary, maxSchemaItems)
    : buildSimpleSchema(filteredCore, filteredLibrary, maxSchemaItems);

  // ─────────────────────────────────────────────────────────────────────────────
  // BUILD 3-BLOCK STRUCTURE
  // ─────────────────────────────────────────────────────────────────────────────
  const blocks = build3BlockStructure(filteredCore, filteredLibrary);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // GROUP BY CATEGORY (for chips UI)
  // ─────────────────────────────────────────────────────────────────────────────
  const byCategory = groupByCategory(allFaqs);

  return {
    coreFaqs: filteredCore,
    libraryFaqs: filteredLibrary,
    schemaFaqs,
    allFaqs,
    blocks,
    byCategory,
    isLegacy: false,
    counts: {
      core: filteredCore.length,
      library: filteredLibrary.length,
      schema: schemaFaqs.length,
      total: allFaqs.length,
      dedupedCount,
    },
    i18n: i18nStats,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEDUPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

interface DedupeResult {
  resolvedCoreIds: string[];
  resolvedLibraryIds: string[];
  dedupedCount: number;
}

/**
 * Resolve canonical IDs and remove duplicates
 * - If FAQ has canonicalId, resolve to that
 * - If multiple map to same canonical, keep newest (by lastReviewed) or core priority
 */
function deduplicateFaqIds(
  coreIds: Set<string>,
  libraryIds: Set<string>
): DedupeResult {
  const canonicalMap = new Map<string, { id: string; isCore: boolean; lastReviewed: string }>();
  let dedupedCount = 0;

  // Helper to resolve canonical ID
  const getCanonicalId = (id: string): string => {
    const entry = masterFaqBank.find(f => f.id === id);
    return entry?.canonicalId || id;
  };

  // Process core IDs first (they take priority)
  for (const id of coreIds) {
    const canonicalId = getCanonicalId(id);
    const entry = masterFaqBank.find(f => f.id === id);
    const lastReviewed = entry?.lastReviewed || '1970-01-01';

    const existing = canonicalMap.get(canonicalId);
    if (!existing || existing.lastReviewed < lastReviewed || !existing.isCore) {
      if (existing) dedupedCount++;
      canonicalMap.set(canonicalId, { id: canonicalId, isCore: true, lastReviewed });
    } else {
      dedupedCount++;
    }
  }

  // Process library IDs
  for (const id of libraryIds) {
    const canonicalId = getCanonicalId(id);
    const entry = masterFaqBank.find(f => f.id === id);
    const lastReviewed = entry?.lastReviewed || '1970-01-01';

    const existing = canonicalMap.get(canonicalId);
    if (!existing) {
      canonicalMap.set(canonicalId, { id: canonicalId, isCore: false, lastReviewed });
    } else if (!existing.isCore && existing.lastReviewed < lastReviewed) {
      // Only replace if not core and newer
      dedupedCount++;
      canonicalMap.set(canonicalId, { id: canonicalId, isCore: false, lastReviewed });
    } else {
      dedupedCount++;
    }
  }

  // Split back into core and library
  const resolvedCoreIds: string[] = [];
  const resolvedLibraryIds: string[] = [];

  for (const [canonicalId, meta] of canonicalMap) {
    if (meta.isCore) {
      resolvedCoreIds.push(canonicalId);
    } else {
      resolvedLibraryIds.push(canonicalId);
    }
  }

  return { resolvedCoreIds, resolvedLibraryIds, dedupedCount };
}

// ═══════════════════════════════════════════════════════════════════════════════
// i18n RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

interface I18nStats {
  requestedLang: string;
  fallbacksUsed: number;
  missingSkipped: number;
}

/**
 * Resolve FAQ IDs with proper i18n fallbacks
 * - If requested language missing → fallback to English
 * - If question exists but answer empty → skip (half-translated)
 * - Never break on missing translation
 */
function resolveIdsWithI18n(
  ids: string[],
  language: string,
  strictI18n: boolean,
  stats: I18nStats,
  section: 'core' | 'library'
): ResolvedFaq[] {
  const resolved: ResolvedFaq[] = [];

  for (const id of ids) {
    const entry = masterFaqBank.find(faq => faq.id === id);
    if (!entry) {
      console.warn(`[FAQ Resolver] FAQ ID not found: ${id}`);
      continue;
    }

    // Get Q&A with i18n fallback (translations structure)
    const langKey = language as keyof typeof entry.translations;
    const translation = entry.translations[langKey] || entry.translations.en;
    const q = translation?.q;
    const a = translation?.a;
    
    if (!q?.trim() || !a?.trim()) {
      stats.missingSkipped++;
      console.warn(`[FAQ Resolver] Skipping ${id} - missing q or a for language ${language}`);
      continue;
    }
    
    // Track if we used fallback
    if (langKey !== 'en' && !entry.translations[langKey]) {
      stats.fallbacksUsed++;
    }

    // Determine library section
    const librarySection: 'core' | 'plan-your-trip' | 'deep-library' = 
      entry.librarySection || (section === 'core' ? 'core' : 'plan-your-trip');

    // Use category from entry (already mapped to FAQ_CATEGORIES)
    const category = entry.category || 'General';

    resolved.push({
      id: entry.id,
      category,
      q,
      a,
      priority: section === 'core' ? 'core' : 'standard',
      schemaEligible: entry.schemaEligible,
      librarySection,
      neighborhoods: undefined,
      poi: undefined,
      aliases: entry.tags,
      cluster: entry.cluster,
      claimType: entry.claimType,
      requiresDisclaimer: entry.requiresDisclaimer,
    });
  }

  return resolved;
}

// Simple translation interface for compatibility
interface FaqTranslation {
  q: string;
  a: string;
}

interface TranslationResult {
  translation: FaqTranslation | undefined;
  usedFallback: boolean;
  isValid: boolean;
}

/**
 * Legacy: Get translation with validation (kept for backward compatibility)
 * New simplified FAQs have q/a directly, this handles old structure if needed
 */
function getTranslationSafe(entry: any, language: string): TranslationResult {
  // New simplified structure - q/a directly on entry
  if (entry.q && entry.a) {
    return { 
      translation: { q: entry.q, a: entry.a }, 
      usedFallback: false, 
      isValid: true 
    };
  }
  
  // Legacy structure with translations object
  if (entry.translations) {
    const requested = entry.translations[language as string];
    const english = entry.translations.en;
    
    if (requested && requested.q?.trim() && requested.a?.trim()) {
      return { translation: requested, usedFallback: false, isValid: true };
    }
    
    if (english && english.q?.trim() && english.a?.trim()) {
      return { translation: english, usedFallback: true, isValid: true };
    }
  }
  
  return { translation: undefined, usedFallback: true, isValid: false };
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEIGHBORHOOD FILTERING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Filter FAQs by neighborhood (keeps FAQs that apply to any of the specified neighborhoods)
 */
function filterByNeighborhood(faqs: ResolvedFaq[], neighborhoods: string[]): ResolvedFaq[] {
  const lowerNeighborhoods = neighborhoods.map(n => n.toLowerCase());
  
  return faqs.filter(faq => {
    // Keep if no neighborhoods specified (applies to all)
    if (!faq.neighborhoods || faq.neighborhoods.length === 0) return true;
    
    // Keep if any neighborhood matches
    return faq.neighborhoods.some(n => 
      lowerNeighborhoods.includes(n.toLowerCase())
    );
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build category-balanced schema for SEO breadth
 * Ensures Google sees variety, not 40 booking questions
 */
function buildCategoryBalancedSchema(
  coreFaqs: ResolvedFaq[],
  libraryFaqs: ResolvedFaq[],
  maxItems: number
): ResolvedFaq[] {
  const schemaFaqs: ResolvedFaq[] = [];
  const categoryCount: Record<string, number> = {};
  const allFaqs = [...coreFaqs, ...libraryFaqs];
  
  // Initialize category counts
  for (const cat of SCHEMA_CATEGORY_PRIORITY) {
    categoryCount[cat] = 0;
  }

  // First pass: add core FAQs (respecting per-category limit)
  for (const faq of coreFaqs) {
    if (!faq.schemaEligible) continue;
    if (schemaFaqs.length >= maxItems) break;
    
    const catCount = categoryCount[faq.category] || 0;
    if (catCount < MAX_PER_CATEGORY_IN_SCHEMA) {
      schemaFaqs.push(faq);
      categoryCount[faq.category] = catCount + 1;
    }
  }

  // Second pass: round-robin through categories to ensure breadth
  let addedInRound = true;
  while (schemaFaqs.length < maxItems && addedInRound) {
    addedInRound = false;
    
    for (const category of SCHEMA_CATEGORY_PRIORITY) {
      if (schemaFaqs.length >= maxItems) break;
      
      const catCount = categoryCount[category] || 0;
      if (catCount >= MAX_PER_CATEGORY_IN_SCHEMA) continue;
      
      // Find next eligible FAQ in this category
      const candidate = libraryFaqs.find(faq => 
        faq.category === category &&
        faq.schemaEligible &&
        !schemaFaqs.some(s => s.id === faq.id)
      );
      
      if (candidate) {
        schemaFaqs.push(candidate);
        categoryCount[category] = catCount + 1;
        addedInRound = true;
      }
    }
  }

  return schemaFaqs;
}

/**
 * Simple schema builder (no category balancing)
 */
function buildSimpleSchema(
  coreFaqs: ResolvedFaq[],
  libraryFaqs: ResolvedFaq[],
  maxItems: number
): ResolvedFaq[] {
  const eligibleCore = coreFaqs.filter(faq => faq.schemaEligible);
  const schemaFaqs = eligibleCore.slice(0, maxItems);
  
  if (schemaFaqs.length < maxItems) {
    const remainingSlots = maxItems - schemaFaqs.length;
    const eligibleLibrary = libraryFaqs.filter(faq => faq.schemaEligible);
    schemaFaqs.push(...eligibleLibrary.slice(0, remainingSlots));
  }
  
  return schemaFaqs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3-BLOCK STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build 3-block library structure for premium UX
 */
function build3BlockStructure(
  coreFaqs: ResolvedFaq[],
  libraryFaqs: ResolvedFaq[]
): FaqLibraryBlocks {
  const core: ResolvedFaq[] = [];
  const planYourTrip: ResolvedFaq[] = [];
  const deepLibrary: ResolvedFaq[] = [];
  
  // Core FAQs always go to core block
  for (const faq of coreFaqs) {
    core.push({ ...faq, librarySection: 'core' });
  }
  
  // Library FAQs split by their section or priority
  for (const faq of libraryFaqs) {
    const section = faq.librarySection || 
      (faq.priority === 'standard' ? 'plan-your-trip' : 'deep-library');
    
    if (section === 'plan-your-trip') {
      planYourTrip.push({ ...faq, librarySection: 'plan-your-trip' });
    } else {
      deepLibrary.push({ ...faq, librarySection: 'deep-library' });
    }
  }
  
  return { core, planYourTrip, deepLibrary };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY GROUPING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Group FAQs by category (for filter chips UI)
 */
function groupByCategory(faqs: ResolvedFaq[]): Record<string, ResolvedFaq[]> {
  const grouped: Record<string, ResolvedFaq[]> = {};
  
  for (const faq of faqs) {
    if (!grouped[faq.category]) {
      grouped[faq.category] = [];
    }
    grouped[faq.category].push(faq);
  }
  
  return grouped;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handle legacy FAQs (embedded in villa JSON)
 */
function resolveLegacyFaqs(
  legacyFaqs: LegacyFaq[], 
  maxSchemaItems: number,
  language: string
): ResolvedFaqSet {
  const resolved: ResolvedFaq[] = legacyFaqs.map((faq, index) => ({
    id: `legacy-${index}`,
    category: faq.category || 'General',
    q: faq.q,
    a: faq.a,
    priority: 'standard' as const,
    schemaEligible: true,
    librarySection: 'plan-your-trip' as const,
  }));

  const schemaFaqs = resolved.slice(0, maxSchemaItems);
  const byCategory = groupByCategory(resolved);
  
  // Build blocks for legacy (everything in planYourTrip)
  const blocks: FaqLibraryBlocks = {
    core: [],
    planYourTrip: resolved,
    deepLibrary: [],
  };

  return {
    coreFaqs: [],
    libraryFaqs: resolved,
    schemaFaqs,
    allFaqs: resolved,
    blocks,
    byCategory,
    isLegacy: true,
    counts: {
      core: 0,
      library: resolved.length,
      schema: schemaFaqs.length,
      total: resolved.length,
      dedupedCount: 0,
    },
    i18n: {
      requestedLang: language,
      fallbacksUsed: 0,
      missingSkipped: 0,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get FAQ count for a preset
 */
export function getPresetFaqCount(presetId: FaqPresetId): { core: number; library: number; total: number } {
  const preset = getPreset(presetId);
  return {
    core: preset.core.length,
    library: preset.library.length,
    total: preset.core.length + preset.library.length,
  };
}

/**
 * Check if a villa uses the new FAQ system
 */
export function usesNewFaqSystem(config: VillaFaqConfig | undefined): boolean {
  return Boolean(config?.faqPreset || config?.faqIds?.length);
}

/**
 * Flat array helper for legacy component compatibility
 */
export function toFlatFaqs(faqSet: ResolvedFaqSet): Array<{ category?: string; q: string; a: string }> {
  return faqSet.allFaqs.map(faq => ({
    category: faq.category,
    q: faq.q,
    a: faq.a,
  }));
}

/**
 * Get unique categories from a FAQ set (for filter chips)
 */
export function getCategories(faqSet: ResolvedFaqSet): string[] {
  return Object.keys(faqSet.byCategory).sort();
}

/**
 * Search FAQs by query (for client-side search)
 * Matches against question, answer, and aliases
 */
export function searchFaqs(faqs: ResolvedFaq[], query: string): ResolvedFaq[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return faqs;
  
  return faqs.filter(faq => {
    // Match question
    if (faq.q.toLowerCase().includes(lowerQuery)) return true;
    // Match answer
    if (faq.a.toLowerCase().includes(lowerQuery)) return true;
    // Match aliases
    if (faq.aliases?.some(a => a.toLowerCase().includes(lowerQuery))) return true;
    // Match POI
    if (faq.poi?.some(p => p.toLowerCase().includes(lowerQuery))) return true;
    // Match neighborhoods
    if (faq.neighborhoods?.some(n => n.toLowerCase().includes(lowerQuery))) return true;
    
    return false;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT INJECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Replace template tokens in a string with villa context values
 * Tokens use {{tokenName}} syntax
 * 
 * Example: "Welcome to {{villaName}} in {{neighborhood}}"
 * becomes: "Welcome to Casa de la Muralla in Old Town"
 */
export function renderWithContext(text: string, context: VillaContext): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, token) => {
    const value = context[token];
    return value !== undefined ? value : match; // Keep original if no value
  });
}

/**
 * Apply villa context to a single FAQ (returns new FAQ with rendered Q&A)
 */
export function injectFaqContext(faq: ResolvedFaq, context: VillaContext): ResolvedFaq {
  return {
    ...faq,
    q: renderWithContext(faq.q, context),
    a: renderWithContext(faq.a, context),
  };
}

/**
 * Apply villa context to an entire FAQ set
 */
export function injectContext(faqSet: ResolvedFaqSet, context: VillaContext): ResolvedFaqSet {
  const renderFaq = (faq: ResolvedFaq) => injectFaqContext(faq, context);
  
  return {
    ...faqSet,
    coreFaqs: faqSet.coreFaqs.map(renderFaq),
    libraryFaqs: faqSet.libraryFaqs.map(renderFaq),
    schemaFaqs: faqSet.schemaFaqs.map(renderFaq),
    allFaqs: faqSet.allFaqs.map(renderFaq),
    blocks: {
      core: faqSet.blocks.core.map(renderFaq),
      planYourTrip: faqSet.blocks.planYourTrip.map(renderFaq),
      deepLibrary: faqSet.blocks.deepLibrary.map(renderFaq),
    },
    byCategory: Object.fromEntries(
      Object.entries(faqSet.byCategory).map(([cat, faqs]) => [cat, faqs.map(renderFaq)])
    ),
  };
}

/**
 * Get FAQs by cluster (for topic guide pages)
 */
export function getFaqsByCluster(faqs: ResolvedFaq[], cluster: string): ResolvedFaq[] {
  return faqs.filter(faq => faq.cluster === cluster);
}

/**
 * Get all unique clusters from a FAQ set
 */
export function getClusters(faqSet: ResolvedFaqSet): string[] {
  const clusters = new Set<string>();
  for (const faq of faqSet.allFaqs) {
    if (faq.cluster) clusters.add(faq.cluster);
  }
  return Array.from(clusters).sort();
}
