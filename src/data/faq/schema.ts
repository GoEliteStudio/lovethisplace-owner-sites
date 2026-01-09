/**
 * FAQ Schema Generator — Villa Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Generates JSON-LD FAQPage schema for SEO.
 * 
 * IMPORTANT: Only schema-eligible FAQs are included in schema output.
 * This prevents risky/sensitive claims from appearing in search results.
 * 
 * Usage:
 * ```astro
 * ---
 * import { buildFaqSchema, FaqSchemaScript } from '../data/faq/schema';
 * const faqSet = resolveFaqs(config, legacyFaqs, lang);
 * const schema = buildFaqSchema(faqSet.schemaFaqs);
 * ---
 * <FaqSchemaScript schema={schema} />
 * ```
 */

import type { ResolvedFaq, ResolvedFaqSet } from './resolver';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FaqSchemaQuestion {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface FaqPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: FaqSchemaQuestion[];
}

export interface SchemaOptions {
  /** Maximum FAQs to include (default: 50, Google recommends <100) */
  maxItems?: number;
  
  /** Only include FAQs with schemaEligible=true (default: true) */
  filterSchemaEligible?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_MAX_ITEMS = 50;

/**
 * Build FAQPage JSON-LD schema from resolved FAQs
 * 
 * @param faqs - Array of resolved FAQs (typically faqSet.schemaFaqs)
 * @param options - Schema generation options
 * @returns FAQPage schema object ready for JSON.stringify
 * 
 * SAFETY: Excludes FAQs with claimType 'medical' or 'legal' to prevent
 * risky claims from appearing in search results (Rich Snippets).
 */
export function buildFaqSchema(
  faqs: ResolvedFaq[],
  options: SchemaOptions = {}
): FaqPageSchema {
  const { 
    maxItems = DEFAULT_MAX_ITEMS,
    filterSchemaEligible = true
  } = options;

  // Filter to schema-eligible only (if not already filtered)
  let eligibleFaqs = filterSchemaEligible 
    ? faqs.filter(faq => faq.schemaEligible)
    : faqs;
  
  // GUARDRAIL: Exclude medical/legal claims from schema
  // These should never appear in Google Rich Snippets
  eligibleFaqs = eligibleFaqs.filter(faq => 
    faq.claimType !== 'medical' && faq.claimType !== 'legal'
  );
  
  // Apply cap
  eligibleFaqs = eligibleFaqs.slice(0, maxItems);

  // Build schema
  const mainEntity: FaqSchemaQuestion[] = eligibleFaqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

/**
 * Build schema directly from a ResolvedFaqSet
 * Convenience wrapper that uses schemaFaqs automatically
 */
export function buildFaqSchemaFromSet(
  faqSet: ResolvedFaqSet,
  options: SchemaOptions = {}
): FaqPageSchema {
  return buildFaqSchema(faqSet.schemaFaqs, {
    ...options,
    filterSchemaEligible: false, // Already filtered in schemaFaqs
  });
}

/**
 * Build schema from legacy FAQ array
 * For backward compatibility with existing villa JSONs
 */
export function buildFaqSchemaFromLegacy(
  legacyFaqs: Array<{ q: string; a: string }>,
  options: SchemaOptions = {}
): FaqPageSchema {
  const { maxItems = DEFAULT_MAX_ITEMS } = options;
  
  const capped = legacyFaqs.slice(0, maxItems);
  
  const mainEntity: FaqSchemaQuestion[] = capped.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert schema to JSON string for embedding in script tag
 */
export function serializeFaqSchema(schema: FaqPageSchema): string {
  return JSON.stringify(schema, null, 0); // Minified
}

/**
 * Generate complete <script> tag for schema
 */
export function generateFaqSchemaScript(schema: FaqPageSchema): string {
  return `<script type="application/ld+json">${serializeFaqSchema(schema)}</script>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION & DIAGNOSTICS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SchemaValidation {
  isValid: boolean;
  itemCount: number;
  warnings: string[];
  errors: string[];
}

/**
 * Validate FAQ schema before deployment
 */
export function validateFaqSchema(schema: FaqPageSchema): SchemaValidation {
  const warnings: string[] = [];
  const errors: string[] = [];
  const itemCount = schema.mainEntity?.length || 0;

  // Check for empty schema
  if (itemCount === 0) {
    errors.push('Schema has no FAQ items');
  }

  // Google recommends < 100 items
  if (itemCount > 100) {
    warnings.push(`Schema has ${itemCount} items. Google recommends < 100.`);
  }

  // Check for very long answers (may be truncated in search)
  for (const item of schema.mainEntity || []) {
    if (item.acceptedAnswer.text.length > 500) {
      warnings.push(`FAQ "${item.name.slice(0, 50)}..." has a very long answer (${item.acceptedAnswer.text.length} chars)`);
    }
  }

  // Check for empty questions/answers
  for (const item of schema.mainEntity || []) {
    if (!item.name?.trim()) {
      errors.push('Found FAQ with empty question');
    }
    if (!item.acceptedAnswer?.text?.trim()) {
      errors.push('Found FAQ with empty answer');
    }
  }

  return {
    isValid: errors.length === 0,
    itemCount,
    warnings,
    errors,
  };
}

/**
 * Get schema stats for debugging
 */
export function getSchemaStats(schema: FaqPageSchema): {
  itemCount: number;
  avgQuestionLength: number;
  avgAnswerLength: number;
  totalChars: number;
} {
  const items = schema.mainEntity || [];
  const itemCount = items.length;
  
  if (itemCount === 0) {
    return { itemCount: 0, avgQuestionLength: 0, avgAnswerLength: 0, totalChars: 0 };
  }

  let totalQ = 0;
  let totalA = 0;

  for (const item of items) {
    totalQ += item.name.length;
    totalA += item.acceptedAnswer.text.length;
  }

  return {
    itemCount,
    avgQuestionLength: Math.round(totalQ / itemCount),
    avgAnswerLength: Math.round(totalA / itemCount),
    totalChars: totalQ + totalA,
  };
}
