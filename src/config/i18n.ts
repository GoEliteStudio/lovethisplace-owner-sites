/**
 * Villa Engine - Internationalization & Villa Registry Configuration
 * 
 * SINGLE SOURCE OF TRUTH for:
 * - Root redirect (src/pages/index.astro)
 * - Dynamic routing (src/pages/villas/[slug]/[lang].astro)
 * - CLI scaffolding (scripts/create-villa.mjs)
 * - Dynamic sitemap.xml generation
 * - Dynamic robots.txt generation
 * - Schema.org structured data
 * 
 * When adding a new villa:
 * 1. Add entry to VILLAS array below
 * 2. Add villa JSON files to src/content/villas/
 * 3. Add images to public/images/villas/{slug}/
 * 4. Everything else (sitemap, robots, routes, schema) updates automatically
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type VillaRegion = 'europe' | 'latam' | 'usa' | 'caribbean' | 'asia' | 'oceania';
export type VillaCurrency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'MXN' | 'COP' | 'BRL' | 'AUD' | 'NZD' | 'THB';
export type VillaVisibility = 'public' | 'private-preview' | 'hidden';
export type VillaTheme = 'classic' | 'heritage-signature';

export interface VillaConfig {
  /** URL-friendly identifier (e.g., 'domaine-des-montarels') */
  slug: string;
  /** Supported languages for this villa */
  langs: string[];
  /** Default language for redirects */
  defaultLang: string;
  /** Primary production domain (without protocol) */
  domain: string;
  /** Alternative domains/hostnames that should resolve to this villa */
  altDomains?: string[];
  /** Last content update date (ISO format) for sitemap lastmod */
  updatedAt: string;
  /** Auxiliary pages available for this villa */
  auxPages: string[];
  /** Whether this villa is active (false = excluded from sitemap) */
  active: boolean;
  /** Publication boundary. Only public villas may be indexed or listed in sitemaps. */
  visibility: VillaVisibility;
  /** Explicit canonical origin used after the property is approved for public indexing. */
  canonicalOrigin: string;
  /** Shareable origin used while a private-preview custom domain is not yet active. */
  previewOrigin?: string;
  /** Present this property at the canonical domain root instead of exposing the engine route. */
  rootCanonical?: boolean;
  /** Reuse an existing optimized asset directory during a safe property-slug migration. */
  assetSlug?: string;
  /** Visual system used by the reusable owner-site renderer. */
  theme?: VillaTheme;

  /** Geographic region (determines default currency) */
  region: VillaRegion;
  /** Currency for pricing and email quotes (EUR for Europe, USD for Americas) */
  currency: VillaCurrency;
  /** Owner email for inquiry notifications (BCC on owner emails) */
  ownerEmail: string;
}

// =============================================================================
// VILLA REGISTRY — Single Source of Truth
// =============================================================================

export const VILLAS: VillaConfig[] = [
  {
    slug: 'ddm-preview-4f9p3',
    langs: ['en', 'es', 'fr'],
    defaultLang: 'en',
    domain: 'www.domaine-desmontarels.com',
    altDomains: [
      'domaine-desmontarels.com'
    ],
    updatedAt: '2025-12-03',
    auxPages: ['contact', 'rates', 'terms', 'privacy', 'about', 'thank-you'],
    active: true,
    visibility: 'public',
    canonicalOrigin: 'https://www.domaine-desmontarels.com',
    theme: 'classic',
    region: 'europe',
    currency: 'EUR',
    ownerEmail: 'jc@elitecartagena.com'
  },
  {
    slug: 'cdm-preview-2q5n8',
    langs: ['en', 'es'],
    defaultLang: 'en',
    domain: 'villa-casa-muralla.vercel.app',
    altDomains: [],
    updatedAt: '2025-12-03',
    auxPages: ['contact', 'rates', 'terms', 'privacy', 'about', 'thank-you'],
    active: true,
    visibility: 'private-preview',
    canonicalOrigin: 'https://villa-casa-muralla.vercel.app',
    theme: 'classic',
    region: 'latam',
    currency: 'USD',
    ownerEmail: 'reservations@casadelamuralla.com'
  },
  {
    slug: 'mz-preview-8x7k2',
    langs: ['en', 'es'],
    defaultLang: 'en',
    domain: 'mount-zurich.vercel.app',
    altDomains: [],
    updatedAt: '2025-12-05',
    auxPages: ['contact', 'rates', 'terms', 'privacy', 'about', 'thank-you'],
    active: true,
    visibility: 'private-preview',
    canonicalOrigin: 'https://mount-zurich.vercel.app',
    theme: 'classic',
    region: 'usa',
    currency: 'USD',
    ownerEmail: 'reservations@mountzurich.com'
  },
  {
    slug: 'villa-kassandra',
    langs: ['en', 'el', 'ru'],
    defaultLang: 'en',
    domain: 'villa-kassandra.vercel.app',
    altDomains: [],
    updatedAt: '2025-12-06',
    auxPages: ['contact', 'rates', 'terms', 'privacy', 'about', 'thank-you'],
    active: true,
    visibility: 'private-preview',
    canonicalOrigin: 'https://villa-kassandra.vercel.app',
    theme: 'classic',
    region: 'europe',
    currency: 'EUR',
    ownerEmail: 'jc@elitecartagena.com'
  },
  {
    slug: 'villa-orama',
    langs: ['en', 'el'],
    defaultLang: 'en',
    domain: 'villa-orama.vercel.app',
    altDomains: [],
    updatedAt: '2025-12-07',
    auxPages: ['contact', 'rates', 'terms', 'privacy', 'about', 'thank-you'],
    active: true,
    visibility: 'private-preview',
    canonicalOrigin: 'https://villa-orama.vercel.app',
    theme: 'classic',
    region: 'europe',
    currency: 'EUR',
    ownerEmail: 'jc@elitecartagena.com'
  },
  {
    slug: 'casa-del-toro',
    langs: ['en', 'es'],
    defaultLang: 'en',
    domain: 'casa-del-toro.vercel.app',
    altDomains: [],
    updatedAt: '2025-12-31',
    auxPages: ['contact', 'rates', 'terms', 'privacy', 'about', 'thank-you'],
    active: true,
    visibility: 'private-preview',
    canonicalOrigin: 'https://casa-del-toro.vercel.app',
    theme: 'classic',
    region: 'latam',
    currency: 'USD',
    ownerEmail: 'info@vacationcartagena.com'
  },
  {
    slug: 'molonta-heritage-estate',
    langs: ['en'],
    defaultLang: 'en',
    domain: 'molonta.lovethisplace.co',
    altDomains: ['molonta-heritage-estate.vercel.app'],
    updatedAt: '2026-08-19',
    auxPages: ['contact', 'rates', 'terms', 'privacy', 'about', 'gallery', 'thank-you'],
    active: true,
    visibility: 'private-preview',
    canonicalOrigin: 'https://molonta.lovethisplace.co',
    previewOrigin: 'https://molonta-heritage-estate.vercel.app',
    rootCanonical: true,
    assetSlug: 'molonta-owner-preview',
    theme: 'heritage-signature',
    region: 'europe',
    currency: 'EUR',
    ownerEmail: 'jc@lovethisplace.co'
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get villa config by slug
 */
export function getVillaBySlug(slug: string): VillaConfig | undefined {
  return VILLAS.find(v => v.slug === slug);
}

/**
 * Get villa config by hostname (checks domain + altDomains)
 */
export function getVillaByHostname(hostname: string): VillaConfig | undefined {
  return VILLAS.find(v => 
    v.domain === hostname || 
    v.altDomains?.includes(hostname)
  );
}

/**
 * Restrict prerendered routes to one property when an isolated owner-site
 * deployment declares VILLA_SLUG. Unset keeps the shared development build.
 */
export function getBuildVillas(): VillaConfig[] {
  const configuredSlug = process.env.VILLA_SLUG?.trim();
  if (!configuredSlug) return VILLAS;

  const villa = getVillaBySlug(configuredSlug);
  if (!villa) {
    throw new Error(`Unknown VILLA_SLUG: ${configuredSlug}`);
  }

  return [villa];
}

/**
 * Get all active villas
 */
export function getActiveVillas(): VillaConfig[] {
  return VILLAS.filter(v => v.active);
}

/**
 * Get all villa slugs
 */

/** Public, indexable villas only. Private previews never enter discovery surfaces. */
export function getIndexableVillas(): VillaConfig[] {
  return VILLAS.filter(v => v.active && v.visibility === 'public');
}

export function isVillaIndexable(villa: VillaConfig | undefined): boolean {
  return Boolean(villa?.active && villa.visibility === 'public');
}

export function getVillaPublicOrigin(villa: VillaConfig): string {
  const origin = villa.visibility !== 'public' && villa.previewOrigin
    ? villa.previewOrigin
    : villa.canonicalOrigin;
  return origin.replace(/\/$/, '');
}

export function getVillaCanonicalUrl(villa: VillaConfig, lang: string, page?: string): string {
  const origin = getVillaPublicOrigin(villa);
  if (villa.rootCanonical) {
    return page ? origin + '/' + page.replace(/^\//, '').replace(/\/$/, '') + '/' : origin + '/';
  }
  const suffix = page ? `/${page.replace(/^\//, '').replace(/\/$/, '')}` : '';
  return `${origin}/villas/${villa.slug}/${lang}${suffix}/`;
}

export function getVillaPublicPath(villa: VillaConfig, lang: string, page?: string): string {
  if (villa.rootCanonical) {
    return page ? '/' + page.replace(/^\//, '').replace(/\/$/, '') + '/' : '/';
  }
  const suffix = page ? '/' + page.replace(/^\//, '').replace(/\/$/, '') : '';
  return '/villas/' + villa.slug + '/' + lang + suffix + '/';
}

export function getAllVillaSlugs(): string[] {
  return VILLAS.map(v => v.slug);
}

/**
 * Get languages for a specific villa
 */
export function getVillaLanguages(slug: string): string[] {
  return getVillaBySlug(slug)?.langs || [DEFAULT_LANG];
}

/**
 * Get default language for a specific villa
 */
export function getVillaDefaultLang(slug: string): string {
  return getVillaBySlug(slug)?.defaultLang || DEFAULT_LANG;
}

/**
 * Get currency for a specific villa
 * Europe = EUR, Americas = USD (simplified)
 */
export function getVillaCurrency(slug: string): VillaCurrency {
  return getVillaBySlug(slug)?.currency || 'EUR';
}

/**
 * Get region for a specific villa
 */
export function getVillaRegion(slug: string): VillaRegion {
  return getVillaBySlug(slug)?.region || 'europe';
}

/**
 * Get owner email for a specific villa
 * Used as fallback when Firestore owner lookup fails
 */
export function getVillaOwnerEmail(slug: string): string {
  return getVillaBySlug(slug)?.ownerEmail || 'bookings@lovethisplace.co';
}

/**
 * Villa nightly rates - loaded from villa JSON files
 * Used for quote calculations in inquiry API
 */
const VILLA_NIGHTLY_RATES: Record<string, number> = {
  'domaine-des-montarels': 0,      // Rate on request (no auto-quote)
  'casa-de-la-muralla': 0,          // Rate on request
  'casa-del-toro': 1700,            // $1,700 USD per night
  'mount-zurich': 875,              // $875 USD per night
  'villa-kassandra': 0,             // Rate on request
  'villa-orama': 0,                 // Rate on request (seasonal pricing)
  'molonta-heritage-estate': 2140,     // Owner-supplied 2027 starting rate
};

/**
 * Get nightly rate for a specific villa
 * Returns 0 if rate is "on request" (no auto-quote)
 */
export function getVillaNightlyRate(slug: string): number {
  return VILLA_NIGHTLY_RATES[slug] || 0;
}

/**
 * Villa minimum nights requirements
 */
const VILLA_MINIMUM_NIGHTS: Record<string, number> = {
  'domaine-des-montarels': 5,
  'casa-de-la-muralla': 3,
  'casa-del-toro': 3,               // 3-night minimum
  'mount-zurich': 2,
  'villa-kassandra': 3,
  'villa-orama': 7,                 // 7-night minimum in high season
  'molonta-heritage-estate': 3,        // 3 nights outside high summer
};

/**
 * Get minimum nights for a specific villa
 * Returns 2 as default if not specified
 */
export function getVillaMinimumNights(slug: string): number {
  return VILLA_MINIMUM_NIGHTS[slug] || 2;
}

// =============================================================================
// LEGACY EXPORTS (for backward compatibility)
// =============================================================================

/**
 * Supported languages per villa
 * @deprecated Use VILLAS array and getVillaLanguages() instead
 */
export const VILLA_LANGUAGES: Record<string, string[]> = Object.fromEntries(
  getBuildVillas().map(v => [v.slug, v.langs])
);

/**
 * Default language (fallback)
 */
export const DEFAULT_LANG = 'en';

/**
 * Language metadata (locales, display names, text direction)
 */
export const LANG_META: Record<string, { name: string; locale: string; dir: string }> = {
  'en': { name: 'English', locale: 'en-US', dir: 'ltr' },
  'es': { name: 'Español', locale: 'es-ES', dir: 'ltr' },
  'fr': { name: 'Français', locale: 'fr-FR', dir: 'ltr' },
  'el': { name: 'Ελληνικά', locale: 'el-GR', dir: 'ltr' },
  'ru': { name: 'Русский', locale: 'ru-RU', dir: 'ltr' },
  'it': { name: 'Italiano', locale: 'it-IT', dir: 'ltr' },
  'de': { name: 'Deutsch', locale: 'de-DE', dir: 'ltr' },
  'pt': { name: 'Português', locale: 'pt-PT', dir: 'ltr' }
};

/**
 * Hostname-to-slug mapping for production deployments
 * Used by root redirector to detect which villa site is being visited
 * @deprecated Use getVillaByHostname() instead - this is auto-generated from VILLAS
 */
export const HOSTNAME_SLUG_MAP: Record<string, string> = Object.fromEntries(
  VILLAS.flatMap(v => [
    [v.domain, v.slug],
    ...(v.altDomains?.map(alt => [alt, v.slug]) || [])
  ])
);

/**
 * Default villa slug (fallback if hostname not recognized)
 */
export const DEFAULT_VILLA_SLUG = 'domaine-des-montarels';
