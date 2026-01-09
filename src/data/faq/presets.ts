/**
 * FAQ Presets — Villa Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Pre-configured FAQ collections for different villa types and regions.
 * Each preset defines CORE (10-15 hero FAQs) and LIBRARY (full accordion) FAQs.
 * 
 * ARCHITECTURE:
 * - `core`: Essential FAQs always shown prominently (hero block)
 * - `library`: Additional FAQs shown in expanded/accordion view
 * - `schemaFaqs`: Generated automatically from core + schemaEligible library items
 * 
 * Usage in new villa JSON:
 * {
 *   "faqPreset": "cartagena-luxury-villa",
 *   "faqOverrides": ["custom-001", "custom-002"]  // Optional additions
 * }
 */

import type { FaqEntry } from './masterFaqBank';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type FaqPresetId = 
  | 'cartagena-luxury-villa'
  | 'cartagena-walled-city-villa'
  | 'cartagena-bachelor-party'
  | 'cartagena-family-retreat'
  | 'cartagena-corporate-retreat'
  | 'europe-luxury-villa';

export type GeoScope = 'cartagena' | 'europe' | 'all';

export interface FaqPreset {
  id: FaqPresetId;
  name: string;
  description: string;
  geoScope: GeoScope;
  
  /** 10-15 essential FAQs always displayed prominently */
  core: string[];
  
  /** Additional FAQs for full library view */
  library: string[];
  
  /** Rule-based inclusion: include all FAQs matching these categories */
  includeCategories?: string[];
  
  /** Rule-based inclusion: include all FAQs matching these tags */
  includeTags?: string[];
  
  /** Exclude specific FAQs even if they match rules */
  exclude?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED CORE SETS
// ═══════════════════════════════════════════════════════════════════════════════

/** Universal core FAQs - every villa should have these */
const UNIVERSAL_CORE = [
  'booking-min-stay',
  'booking-deposit',
  'rates-cancellation-policy',
  'rates-payment-methods',
  'staff-languages',
  'staff-availability',
  'food-breakfast-included',
  'tech-internet',
  'safety-area-safe',
  'house-rules-smoking',
] as const;

/** Cartagena-specific core additions */
const CARTAGENA_CORE_ADDITIONS = [
  'arrival-airport-vip',
  'privacy-vip-suitable',
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CARTAGENA PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cartagena Luxury Villa — Full service island/beachfront villa
 */
export const cartagenaLuxuryVilla: FaqPreset = {
  id: 'cartagena-luxury-villa',
  name: 'Cartagena Luxury Villa',
  description: 'Standard luxury villa in Cartagena with full staff and services',
  geoScope: 'cartagena',
  
  core: [
    ...UNIVERSAL_CORE,
    ...CARTAGENA_CORE_ADDITIONS,
  ],
  
  library: [
    // Booking extras
    'rates-security-deposit',
    
    // Logistics
    'arrival-armored-vehicles',
    
    // Food & dining
    'food-kosher-halal',
    'food-alcohol',
    
    // Safety
    'safety-first-aid',
    
    // Families
    'families-crib',
    'families-pool-safety',
    'families-babysitter',
    
    // Pets
    'pets-pet-friendly',
    
    // Accessibility
    'accessibility-wheelchair',
    
    // House rules
    'house-rules-loud-music',
    
    // Work
    'remote-work-corporate-retreats',
    
    // VIP
    'privacy-ndas',
  ],
  
  includeTags: ['cartagena'],
};

/**
 * Cartagena Walled City Villa — Urban villa in Centro/Getsemaní
 * COMPREHENSIVE: Includes ALL relevant FAQs for maximum SEO coverage.
 * Different from island villas: no boat arrival, walkable to attractions.
 */
export const cartagenaWalledCityVilla: FaqPreset = {
  id: 'cartagena-walled-city-villa',
  name: 'Cartagena Walled City Villa',
  description: 'Urban luxury villa in Centro Histórico or Getsemaní (walkable, no boat required)',
  geoScope: 'cartagena',
  
  core: [
    ...UNIVERSAL_CORE,
    'arrival-airport-vip',
    'safety-area-safe',  // Important for urban villas
  ],
  
  library: [
    // ═══════════════════════════════════════════════════════════════════
    // BOOKING & PAYMENT (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'booking-advance-booking',
    'booking-temporary-hold',
    'booking-platforms',
    'booking-extended-stay-discount',
    'rates-security-deposit',
    'rates-taxes',
    
    // ═══════════════════════════════════════════════════════════════════
    // ARRIVAL & LOGISTICS (Walled City specific)
    // ═══════════════════════════════════════════════════════════════════
    'arrival-armored-vehicles',
    'arrival-transfer-time',
    'arrival-luggage-logistics',
    'location-marina-access',  // City-specific: how to get to boats/yachts
    
    // ═══════════════════════════════════════════════════════════════════
    // LOCATION & NEIGHBORHOODS (Critical for geo-SEO)
    // ═══════════════════════════════════════════════════════════════════
    'location-walled-city',
    'location-getsemani',
    'location-bocagrande',
    'general-beach-distance',
    
    // ═══════════════════════════════════════════════════════════════════
    // STAFF & SERVICE (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'staff-butler',
    'staff-accommodation',
    'staff-female-only',
    'staff-turndown',
    
    // ═══════════════════════════════════════════════════════════════════
    // FOOD & DINING (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'food-chef-specialty',
    'food-kosher-halal',
    'food-vegan-vegetarian',
    'food-groceries',
    'food-alcohol',
    'food-mixologist',
    'food-coffee',
    'food-romantic-dinner',
    
    // ═══════════════════════════════════════════════════════════════════
    // AMENITIES (All applicable)
    // ═══════════════════════════════════════════════════════════════════
    'amenities-toiletries',
    'amenities-bed-configuration',
    'amenities-linens',
    'amenities-hair-dryer',
    'amenities-safe',
    'amenities-steam-iron',
    'amenities-gym',
    
    // ═══════════════════════════════════════════════════════════════════
    // TECHNOLOGY (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'tech-printer',
    'tech-tv-channels',
    'tech-power-adapter',
    
    // ═══════════════════════════════════════════════════════════════════
    // EXCURSIONS & ACTIVITIES (Cartagena favorites)
    // ═══════════════════════════════════════════════════════════════════
    'excursions-rosario-islands',
    'excursions-cholon',
    'excursions-historical-tour',
    'excursions-fishing',
    'excursions-massages',
    'excursions-yoga',
    
    // ═══════════════════════════════════════════════════════════════════
    // BEACH CLUBS (Accessible from Walled City)
    // ═══════════════════════════════════════════════════════════════════
    'beach-club-nearby',
    'beach-club-bora-bora',
    'beach-club-blue-apple',
    'beach-club-fenix',
    'beach-club-makani',
    'beach-club-mangata',
    'beach-club-namaste',
    'beach-club-palmarito',
    'beach-club-bendita',
    'beach-club-playa-blanca',
    'beach-club-mambo',
    'beach-club-nena',
    
    // ═══════════════════════════════════════════════════════════════════
    // EVENTS & WEDDINGS (Urban venues)
    // ═══════════════════════════════════════════════════════════════════
    'events-wedding-capacity',
    'events-noise-curfew',
    'events-vendors',
    'events-fee',
    'events-power-live-band',
    'events-wedding-planners',
    
    // ═══════════════════════════════════════════════════════════════════
    // HOUSE RULES (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'house-rules-visitors',
    'house-rules-maximum-capacity',
    'house-rules-drones',
    'house-rules-loud-music',
    
    // ═══════════════════════════════════════════════════════════════════
    // SAFETY & SECURITY (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'safety-hospital',
    'safety-first-aid',
    
    // ═══════════════════════════════════════════════════════════════════
    // NIGHTLIFE (Walled City advantage)
    // ═══════════════════════════════════════════════════════════════════
    'nightlife-restaurants',
    'nightlife-best-spots',
    'nightlife-safety-walk',
    
    // ═══════════════════════════════════════════════════════════════════
    // ELITE 30: TOP RESTAURANTS (Complete with exact distances)
    // ═══════════════════════════════════════════════════════════════════
    'dining-top-restaurants',
    'dining-celele',
    'dining-la-vitrola',
    'dining-carmen',
    'dining-alma',
    'dining-mar-y-zielo',
    'dining-casual-options',
    'dining-marea',
    'dining-cande',
    'dining-el-baron',
    'dining-donjuan',
    'dining-harrys',
    'dining-club-de-pesca',
    'dining-lobo-de-mar',
    'dining-mistura',
    'dining-maria',
    'dining-1621',
    'dining-cuzco',
    'dining-agua-de-mar',
    
    // ═══════════════════════════════════════════════════════════════════
    // ELITE 30: NIGHTLIFE & BARS (Complete with exact distances)
    // ═══════════════════════════════════════════════════════════════════
    'nightlife-top-bars',
    'nightlife-alquimico',
    'nightlife-cafe-havana',
    'nightlife-space-getsemani',
    'nightlife-la-movida',
    'nightlife-mister-babilla',
    'nightlife-mirador',
    'nightlife-fragma',
    'nightlife-la-jugada',
    'nightlife-townhouse',
    'nightlife-el-coro',
    
    // ═══════════════════════════════════════════════════════════════════
    // MARINA & BEACH ACCESS (City-specific logistics)
    // ═══════════════════════════════════════════════════════════════════
    'location-marina-bodeguita',
    'location-marina-vip-charters',
    'location-marina-port-tax',
    'location-beach-access-city',
    'concierge-fallback-general',
    
    // ═══════════════════════════════════════════════════════════════════
    // FAMILIES & KIDS (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'families-crib',
    'families-pool-safety',
    'families-babysitter',
    'families-teenagers',
    
    // ═══════════════════════════════════════════════════════════════════
    // ACCESSIBILITY (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'accessibility-wheelchair',
    'accessibility-elevator',
    
    // ═══════════════════════════════════════════════════════════════════
    // PETS (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'pets-pet-friendly',
    
    // ═══════════════════════════════════════════════════════════════════
    // WEATHER & CLIMATE (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'weather-rainy-season',
    'weather-breeze',
    'weather-best-months',
    'weather-hurricanes',
    
    // ═══════════════════════════════════════════════════════════════════
    // REMOTE WORK & CORPORATE (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'remote-work-corporate-retreats',
    'remote-work-equipment',
    'remote-work-wifi-multiple-users',
    
    // ═══════════════════════════════════════════════════════════════════
    // SUSTAINABILITY (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'sustainability-practices',
    'sustainability-waste',
    
    // ═══════════════════════════════════════════════════════════════════
    // PRIVACY & VIP (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'privacy-vip-suitable',
    'privacy-ndas',
    'privacy-cctv',
    'privacy-data-sharing',
    
    // ═══════════════════════════════════════════════════════════════════
    // SPORTS & WELLNESS (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'sports-personal-trainer',
    'sports-wellness-retreats',
    
    // ═══════════════════════════════════════════════════════════════════
    // CONTENT PRODUCTION (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'content-photoshoot',
    'content-influencer-support',
    
    // ═══════════════════════════════════════════════════════════════════
    // LONG STAYS (Complete coverage)
    // ═══════════════════════════════════════════════════════════════════
    'long-stays-packages',
    'long-stays-monthly',
  ],
  
  // Rule-based inclusion for geo-tagged FAQs
  includeCategories: ['location'],
  
  // Exclude island-specific boat/pier/helicopter FAQs (not applicable to Walled City)
  exclude: [
    'arrival-helicopter',
    'arrival-pier-depth',
    'arrival-rental-boat-docking',
    'location-privacy',           // Island privacy FAQ
    'safety-water-current',       // Open water FAQ
    'safety-jellyfish',           // Beach FAQ
    'sustainability-wildlife',    // Island ecosystem FAQ
    'beach-club-time-savings',    // Boat-based timing FAQ
    'amenities-tennis-court',     // If villa doesn't have tennis
    'sports-tennis-clinic',       // If villa doesn't have tennis
    // Beach clubs requiring boat access from islands
    'beach-club-amare',
    'beach-club-anaho',
    'beach-club-ancestral',
    'beach-club-atolon',
    'beach-club-bomba',
    'beach-club-kabanna',
    'beach-club-eteka',
    'beach-club-area',
    'beach-club-ibbiza',
    'beach-club-islabela',
    'beach-club-mantas',
    'beach-club-pao-pao',
    'beach-club-paue',
    'beach-club-rosario',
    'beach-club-rosario-del-mar',
    'beach-club-vistamar',
    'beach-club-sabai',
  ],
};

/**
 * Cartagena Bachelor/Bachelorette Party — Party-focused preset
 */
export const cartagenaBachelorParty: FaqPreset = {
  id: 'cartagena-bachelor-party',
  name: 'Cartagena Bachelor/Bachelorette Party Villa',
  description: 'Villas marketed for bachelor/bachelorette parties and group celebrations',
  geoScope: 'cartagena',
  
  core: [
    ...UNIVERSAL_CORE,
    ...CARTAGENA_CORE_ADDITIONS,
    'house-rules-loud-music',  // Important for party villas - moved to core
  ],
  
  library: [
    'rates-security-deposit',
    'arrival-armored-vehicles',  // Security for late-night returns
    'food-kosher-halal',
    'food-alcohol',
    'safety-first-aid',
    'privacy-ndas',
  ],
  
  includeTags: ['cartagena', 'parties', 'vip'],
  
  // Exclude family content for party villas
  exclude: ['families-crib', 'families-babysitter'],
};

/**
 * Cartagena Family Retreat — Family-focused preset
 */
export const cartagenaFamilyRetreat: FaqPreset = {
  id: 'cartagena-family-retreat',
  name: 'Cartagena Family Retreat Villa',
  description: 'Family-friendly villas with child safety features',
  geoScope: 'cartagena',
  
  core: [
    ...UNIVERSAL_CORE,
    'families-pool-safety',  // Critical for families - in core
    'families-crib',
  ],
  
  library: [
    'rates-security-deposit',
    'arrival-airport-vip',
    'food-kosher-halal',
    'food-alcohol',
    'safety-first-aid',
    'house-rules-loud-music',
    'families-babysitter',
    'pets-pet-friendly',
    'accessibility-wheelchair',
    'privacy-vip-suitable',
    'privacy-ndas',
  ],
  
  includeCategories: ['families-kids'],
  includeTags: ['family', 'children', 'baby'],
  
  // Exclude party/security content for family villas
  exclude: ['arrival-armored-vehicles'],
};

/**
 * Cartagena Corporate Retreat — Business-focused preset
 */
export const cartagenaCorporateRetreat: FaqPreset = {
  id: 'cartagena-corporate-retreat',
  name: 'Cartagena Corporate Retreat Villa',
  description: 'Villas suitable for executive retreats and team offsites',
  geoScope: 'cartagena',
  
  core: [
    ...UNIVERSAL_CORE,
    ...CARTAGENA_CORE_ADDITIONS,
    'remote-work-corporate-retreats',  // Critical for corporate - in core
  ],
  
  library: [
    'rates-security-deposit',
    'arrival-armored-vehicles',
    'food-kosher-halal',
    'food-alcohol',
    'safety-first-aid',
    'house-rules-loud-music',
    'accessibility-wheelchair',
    'privacy-ndas',
  ],
  
  includeTags: ['corporate', 'remote-work', 'retreats', 'offsite'],
};

// ═══════════════════════════════════════════════════════════════════════════════
// EUROPE PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * European Luxury Villa — Mediterranean/European villa
 */
export const europeLuxuryVilla: FaqPreset = {
  id: 'europe-luxury-villa',
  name: 'Europe Luxury Villa',
  description: 'Standard luxury villa in Europe (Greece, France, Spain, etc.)',
  geoScope: 'europe',
  
  core: [
    ...UNIVERSAL_CORE,
    'families-pool-safety',  // Common concern in Europe
  ],
  
  library: [
    'rates-security-deposit',
    'food-kosher-halal',
    'food-alcohol',
    'safety-first-aid',
    'house-rules-loud-music',
    'families-crib',
    'families-babysitter',
    'pets-pet-friendly',
    'accessibility-wheelchair',
  ],
  
  // Europe villas don't need Cartagena-specific content
  exclude: [
    'arrival-airport-vip',
    'arrival-armored-vehicles',
    'privacy-vip-suitable',
    'privacy-ndas',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRESET REGISTRY & HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const presetRegistry: Record<FaqPresetId, FaqPreset> = {
  'cartagena-luxury-villa': cartagenaLuxuryVilla,
  'cartagena-walled-city-villa': cartagenaWalledCityVilla,
  'cartagena-bachelor-party': cartagenaBachelorParty,
  'cartagena-family-retreat': cartagenaFamilyRetreat,
  'cartagena-corporate-retreat': cartagenaCorporateRetreat,
  'europe-luxury-villa': europeLuxuryVilla,
};

/** Legacy alias for backward compatibility */
export const faqPresets = presetRegistry;

/**
 * Get preset by ID
 */
export function getPreset(presetId: FaqPresetId): FaqPreset {
  return presetRegistry[presetId];
}

/**
 * List all available preset IDs
 */
export function listPresets(): FaqPresetId[] {
  return Object.keys(presetRegistry) as FaqPresetId[];
}

/**
 * Get all explicit FAQ IDs from a preset (core + library combined)
 * Does NOT apply rule-based inclusion (categories/tags)
 */
export function getAllExplicitFaqIds(preset: FaqPreset): string[] {
  return [...new Set([...preset.core, ...preset.library])];
}

/**
 * Check if a FAQ entry matches the preset's inclusion rules
 */
export function faqMatchesPresetRules(faq: FaqEntry, preset: FaqPreset): boolean {
  // Check explicit exclusions first
  if (preset.exclude?.includes(faq.id)) {
    return false;
  }
  
  // Check category match
  if (preset.includeCategories?.includes(faq.category)) {
    return true;
  }
  
  // Check tag match
  if (preset.includeTags?.some(tag => faq.tags.includes(tag))) {
    return true;
  }
  
  return false;
}
