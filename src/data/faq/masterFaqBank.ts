/**
 * Master FAQ Bank — Villa Engine
 * Centralized FAQ repository for new villa sites.
 * 
 * VALIDATION RULES:
 * - All tokens must be defined in TOKEN_DEFINITIONS
 * - All appliesToProperties must use PROPERTY_FEATURES values
 * - Core FAQs must have tokensUsed declared
 * - Build fails on unresolved {{tokens}} in production
 */

// ════════════════════════════════════════════════════════════════════════
// PROPERTY FEATURES (typed enum for appliesToProperties validation)
// ════════════════════════════════════════════════════════════════════════

export const PROPERTY_FEATURES = {
  // Location types
  ISLA_TIERRABOMBA: 'isla-tierrabomba',
  WALLED_CITY: 'walled-city',
  BOCAGRANDE: 'bocagrande',
  ROSARIO_ISLANDS: 'rosario-islands',
  
  // Infrastructure
  HAS_PRIVATE_PIER: 'has-private-pier',
  HAS_HELIPAD_ACCESS: 'has-helipad-access',
  HAS_TENNIS_COURT: 'has-tennis-court',
  HAS_GYM: 'has-gym',
  HAS_POOL: 'has-pool',
  HAS_BEACH_ACCESS: 'has-beach-access',
  
  // Service levels
  FULL_STAFF: 'full-staff',
  SELF_CATERING: 'self-catering',
  
  // Special capabilities
  EVENTS_ALLOWED: 'events-allowed',
  WEDDINGS_ALLOWED: 'weddings-allowed',
  PRODUCTION_FRIENDLY: 'production-friendly',
} as const;

export type PropertyFeature = typeof PROPERTY_FEATURES[keyof typeof PROPERTY_FEATURES];

// Valid property feature values for validation
export const VALID_PROPERTY_FEATURES = new Set(Object.values(PROPERTY_FEATURES));

// ════════════════════════════════════════════════════════════════════════
// TOKEN DEFINITIONS (single source of truth with metadata)
// ════════════════════════════════════════════════════════════════════════

export interface TokenDefinition {
  /** Token key used in {{tokenName}} */
  key: string;
  /** Human-readable description */
  desc: string;
  /** Example value for documentation */
  example: string;
  /** Required for ALL villas (universal token) */
  universal?: boolean;
  /** Required when villa has these features */
  requiredWhenFeatures?: PropertyFeature[];
  /** Category for grouping in reports */
  category: 'identity' | 'arrival' | 'location' | 'amenities' | 'safety' | 'transfers';
}

export const TOKEN_DEFINITIONS: Record<string, TokenDefinition> = {
  // ─────────────────────────────────────────────────────────────────────
  // UNIVERSAL TOKENS (required for ALL villas)
  // ─────────────────────────────────────────────────────────────────────
  villaName: {
    key: 'villaName',
    desc: 'Display name of the villa',
    example: 'Casa de la Muralla',
    universal: true,
    category: 'identity',
  },
  bedConfiguration: {
    key: 'bedConfiguration',
    desc: 'Bedroom count and bed types',
    example: 'We have 6 bedrooms: 4 King Suites and 2 Double-Queen Suites.',
    universal: true,
    category: 'amenities',
  },
  wifiSpec: {
    key: 'wifiSpec',
    desc: 'Internet type, speed, coverage',
    example: 'Starlink Satellite Internet (150-200 Mbps) with mesh coverage.',
    universal: true,
    category: 'amenities',
  },
  safetyDisclaimer: {
    key: 'safetyDisclaimer',
    desc: 'Standard safety disclaimer text',
    example: 'We recommend standard travel precautions.',
    universal: true,
    category: 'safety',
  },
  
  // ─────────────────────────────────────────────────────────────────────
  // ARRIVAL TOKENS (varies by villa access type)
  // ─────────────────────────────────────────────────────────────────────
  airportName: {
    key: 'airportName',
    desc: 'Nearest airport full name',
    example: 'Rafael Núñez International Airport',
    universal: true,
    category: 'arrival',
  },
  airportCode: {
    key: 'airportCode',
    desc: 'IATA airport code',
    example: 'CTG',
    universal: true,
    category: 'arrival',
  },
  arrivalRouteSummary: {
    key: 'arrivalRouteSummary',
    desc: 'Full transfer route description',
    example: '20 minutes by car to dock, then 15-minute speedboat to villa.',
    universal: true,
    category: 'arrival',
  },
  helicopterArrivalDetails: {
    key: 'helicopterArrivalDetails',
    desc: 'Helipad location and transfer to villa',
    example: 'Land at Tierrabomba helipad, 5-minute tender to pier.',
    requiredWhenFeatures: [PROPERTY_FEATURES.HAS_HELIPAD_ACCESS],
    category: 'arrival',
  },
  pierDetails: {
    key: 'pierDetails',
    desc: 'Pier depth, vessel capacity, mooring info',
    example: 'Private pier accommodates vessels up to 40ft.',
    requiredWhenFeatures: [PROPERTY_FEATURES.HAS_PRIVATE_PIER],
    category: 'arrival',
  },
  rentalBoatDockingDetails: {
    key: 'rentalBoatDockingDetails',
    desc: 'Guest boat docking policy',
    example: 'Guests can dock rental boats at pier during day.',
    requiredWhenFeatures: [PROPERTY_FEATURES.HAS_PRIVATE_PIER],
    category: 'arrival',
  },
  departurePoint: {
    key: 'departurePoint',
    desc: 'Where guests depart for excursions',
    example: 'our private pier',
    universal: true,
    category: 'arrival',
  },
  
  // ─────────────────────────────────────────────────────────────────────
  // LOCATION TOKENS (Cartagena-specific)
  // ─────────────────────────────────────────────────────────────────────
  walledCityAccessSummary: {
    key: 'walledCityAccessSummary',
    desc: 'How to reach Walled City from villa',
    example: '15 minutes by boat to Clock Tower marina.',
    category: 'location',
  },
  getsemaniAccessSummary: {
    key: 'getsemaniAccessSummary',
    desc: 'How to reach Getsemaní from villa',
    example: 'Boat to Muelle de los Pegasos, 5-min walk to Plaza Trinidad.',
    category: 'location',
  },
  bocagrandeAccessSummary: {
    key: 'bocagrandeAccessSummary',
    desc: 'How to reach Bocagrande from villa',
    example: 'Drop at hospital dock, walk to Plaza Bocagrande.',
    category: 'location',
  },
  locationPrivacyDetails: {
    key: 'locationPrivacyDetails',
    desc: 'Privacy/seclusion description for island villas',
    example: 'Located on exclusive Punta Arena, facing open Caribbean.',
    requiredWhenFeatures: [PROPERTY_FEATURES.ISLA_TIERRABOMBA],
    category: 'location',
  },
  beachClubDistances: {
    key: 'beachClubDistances',
    desc: 'Summary of nearby beach club travel times',
    example: 'Tierrabomba clubs 5-15 min, Rosario/Barú 40-50 min.',
    category: 'location',
  },
  
  // ─────────────────────────────────────────────────────────────────────
  // AMENITY TOKENS
  // ─────────────────────────────────────────────────────────────────────
  toiletriesDetails: {
    key: 'toiletriesDetails',
    desc: 'Toiletries description (brand or type)',
    example: 'We supply L\'Occitane en Provence products (or: Hotel-grade toiletries and fresh linens).',
    category: 'amenities',
  },
  tennisCourtDetails: {
    key: 'tennisCourtDetails',
    desc: 'Tennis court description',
    example: 'Regulation hard court with ocean views and night lighting.',
    requiredWhenFeatures: [PROPERTY_FEATURES.HAS_TENNIS_COURT],
    category: 'amenities',
  },
  entertainmentDetails: {
    key: 'entertainmentDetails',
    desc: 'TV/streaming/entertainment setup',
    example: 'Smart TV with Netflix, Prime, Disney+ logged in.',
    category: 'amenities',
  },
  
  // ─────────────────────────────────────────────────────────────────────
  // CITY VILLA TOKENS (Restaurant/Nightlife/Concierge)
  // ─────────────────────────────────────────────────────────────────────
  topRestaurantsSummary: {
    key: 'topRestaurantsSummary',
    desc: 'Summary of top restaurants near the villa with distances',
    example: 'Casa Del Toro is within walking distance of Cartagena\'s finest dining...',
    requiredWhenFeatures: [PROPERTY_FEATURES.WALLED_CITY],
    category: 'amenities',
  },
  topNightlifeSummary: {
    key: 'topNightlifeSummary',
    desc: 'Summary of top nightlife venues near the villa with distances',
    example: 'World-class nightlife within walking distance: Café Havana (5 min)...',
    requiredWhenFeatures: [PROPERTY_FEATURES.WALLED_CITY],
    category: 'amenities',
  },
  conciergeFallback: {
    key: 'conciergeFallback',
    desc: 'Fallback text for services not explicitly listed',
    example: 'Our VIP concierge service handles all specific guest requests...',
    universal: true,
    category: 'amenities',
  },
  
  // ─────────────────────────────────────────────────────────────────────
  // POLICY TOKENS (Per-villa overrides for legal/operational policies)
  // ─────────────────────────────────────────────────────────────────────
  cancellationPolicy: {
    key: 'cancellationPolicy',
    desc: 'Full cancellation policy text for this villa',
    example: 'A 50% deposit is required and is non-refundable...',
    universal: true,
    category: 'safety',
  },
  securityDepositPolicy: {
    key: 'securityDepositPolicy',
    desc: 'Security deposit amount and process',
    example: 'A refundable security deposit of $500 USD is required...',
    universal: true,
    category: 'safety',
  },
  staffDescription: {
    key: 'staffDescription',
    desc: 'Description of staff included with the villa',
    example: 'A dedicated daytime cook and maid (7:00 AM – 4:00 PM)...',
    universal: true,
    category: 'amenities',
  },
  groceryPolicy: {
    key: 'groceryPolicy',
    desc: 'How groceries are handled and fees',
    example: 'Our staff handles grocery shopping. Receipts + 10% service fee.',
    universal: true,
    category: 'amenities',
  },
  conciergeFacilitation: {
    key: 'conciergeFacilitation',
    desc: 'What premium services can be facilitated via concierge network',
    example: 'Our VIP concierge can facilitate armored transport, Kosher/Halal sourcing...',
    universal: true,
    category: 'amenities',
  },
  
  // ─────────────────────────────────────────────────────────────────────
  // SAFETY & LEGAL TOKENS
  // ─────────────────────────────────────────────────────────────────────
  nearestHospitalDetails: {
    key: 'nearestHospitalDetails',
    desc: 'Nearest hospital name, distance, capabilities',
    example: 'Hospital Bocagrande, 15-minute boat ride, full emergency.',
    universal: true,
    category: 'safety',
  },
  taxDisclaimer: {
    key: 'taxDisclaimer',
    desc: 'Tax policy disclaimer',
    example: 'Tax rules may change; consult local regulations.',
    category: 'safety',
  },
  
  // ─────────────────────────────────────────────────────────────────────
  // BEACH CLUB TRANSFER TOKENS (Cartagena island villas)
  // ─────────────────────────────────────────────────────────────────────
  transferTimeAmare: { key: 'transferTimeAmare', desc: 'Transfer time to Amare Beach Club', example: 'the boat ride is 5-10 minutes', category: 'transfers' },
  transferTimeAnaho: { key: 'transferTimeAnaho', desc: 'Transfer time to Anaho Beach Club', example: 'expect a 10-15 minute ride', category: 'transfers' },
  transferTimeAncestral: { key: 'transferTimeAncestral', desc: 'Transfer time to Ancestral Lounge', example: 'approximately 10-15 minutes', category: 'transfers' },
  transferTimeAtolon: { key: 'transferTimeAtolon', desc: 'Transfer time to Atolón Beach Club', example: 'boat time is 10-15 minutes', category: 'transfers' },
  transferTimeBlueApple: { key: 'transferTimeBlueApple', desc: 'Transfer time to Blue Apple Beach', example: 'boat time is about 10-15 minutes', category: 'transfers' },
  transferTimeBomba: { key: 'transferTimeBomba', desc: 'Transfer time to Bomba Beach Club', example: 'it\'s usually 8-12 minutes by boat', category: 'transfers' },
  transferTimeKabanna: { key: 'transferTimeKabanna', desc: 'Transfer time to Club Kabanna', example: 'it takes 8-12 minutes by boat', category: 'transfers' },
  transferTimeEteka: { key: 'transferTimeEteka', desc: 'Transfer time to Eteka Slow Beach', example: 'about 10-15 minutes', category: 'transfers' },
  transferTimeFenix: { key: 'transferTimeFenix', desc: 'Transfer time to Fénix Beach Club', example: 'the ride is 10-15 minutes', category: 'transfers' },
  transferTimeHiCartagena: { key: 'transferTimeHiCartagena', desc: 'Transfer time to Hi Cartagena', example: 'boat time is around 10-15 minutes', category: 'transfers' },
  transferTimeMakani: { key: 'transferTimeMakani', desc: 'Transfer time to Makani Beach Club', example: 'it\'s a quick 10-15 minute ride', category: 'transfers' },
  transferTimeMangata: { key: 'transferTimeMangata', desc: 'Transfer time to Mangata Beach Club', example: 'the trip is 10-15 minutes', category: 'transfers' },
  transferTimeNamaste: { key: 'transferTimeNamaste', desc: 'Transfer time to Namasté Beach Club', example: 'typically 10-15 minutes by boat', category: 'transfers' },
  transferTimePalmarito: { key: 'transferTimePalmarito', desc: 'Transfer time to Palmarito Beach Club', example: 'around 10-15 minutes', category: 'transfers' },
  transferTimeArea: { key: 'transferTimeArea', desc: 'Transfer time to Área Beach', example: 'the boat ride is 40-50 minutes', category: 'transfers' },
  transferTimeBendita: { key: 'transferTimeBendita', desc: 'Transfer time to Bendita Beach', example: 'expect 40-50 minutes by speedboat', category: 'transfers' },
  transferTimeIbbiza: { key: 'transferTimeIbbiza', desc: 'Transfer time to Ibbiza Island Beach', example: 'the boat ride is about 45 minutes', category: 'transfers' },
  transferTimeIslabela: { key: 'transferTimeIslabela', desc: 'Transfer time to Islabela', example: 'it\'s a 40-50 minute ride', category: 'transfers' },
  transferTimeMantas: { key: 'transferTimeMantas', desc: 'Transfer time to Mantas Beach', example: 'expect a 40-50 minute boat ride', category: 'transfers' },
  transferTimePaoPao: { key: 'transferTimePaoPao', desc: 'Transfer time to Pa\'o Pa\'o', example: 'the boat ride is about 45-60 minutes', category: 'transfers' },
  transferTimePaue: { key: 'transferTimePaue', desc: 'Transfer time to Paue Beach Lounge', example: 'expect 45 minutes by boat', category: 'transfers' },
  transferTimeRosario: { key: 'transferTimeRosario', desc: 'Transfer time to Rosario Beach Club', example: 'the boat ride is typically 45 minutes', category: 'transfers' },
  transferTimeRosarioDelMar: { key: 'transferTimeRosarioDelMar', desc: 'Transfer time to Rosario del Mar', example: 'roughly 45 minutes by boat', category: 'transfers' },
  transferTimeVistamar: { key: 'transferTimeVistamar', desc: 'Transfer time to Vistamar Beach Club', example: 'the boat ride is about 45-50 minutes', category: 'transfers' },
  transferTimePlayaBlanca: { key: 'transferTimePlayaBlanca', desc: 'Transfer time to Playa Blanca', example: 'boat time is about 45 minutes', category: 'transfers' },
  transferTimeMambo: { key: 'transferTimeMambo', desc: 'Transfer time to Mambo Beach', example: 'reach it in about 45 minutes by boat', category: 'transfers' },
  transferTimeNena: { key: 'transferTimeNena', desc: 'Transfer time to Nena Beach Club', example: 'it\'s a 45-minute boat ride', category: 'transfers' },
  transferTimeSabai: { key: 'transferTimeSabai', desc: 'Transfer time to Sabai Barú', example: 'expect a 45-minute ride', category: 'transfers' },
  transferTimeBoraBoraFromVilla: { key: 'transferTimeBoraBoraFromVilla', desc: 'Transfer time to Bora Bora Beach', example: 'roughly 40-50 minutes by boat from our pier', category: 'transfers' },
};

// Legacy FAQ_TOKENS for backward compatibility
export const FAQ_TOKENS = Object.fromEntries(
  Object.entries(TOKEN_DEFINITIONS).map(([k, v]) => [k.toUpperCase().replace(/([A-Z])/g, '_$1').slice(1), v.key])
) as Record<string, string>;

export type FaqToken = keyof typeof TOKEN_DEFINITIONS;

// Valid token values for validation
export const VALID_FAQ_TOKENS = new Set(Object.keys(TOKEN_DEFINITIONS));

// ════════════════════════════════════════════════════════════════════════
// INTERFACES
// ════════════════════════════════════════════════════════════════════════

export interface FaqTranslation {
  q: string;
  a: string;
}

export interface FaqEntry {
  id: string;
  category: string; // From FAQ_CATEGORIES
  priority: 'core' | 'standard' | 'optional';
  tags: string[];
  schemaEligible: boolean;
  appliesTo: string[]; // ['cartagena'], ['europe'], ['all']
  appliesToProperties?: string[]; // ['all'] or specific villa IDs ['mark-villa-001']
  lastReviewed: string; // ISO date: '2025-12-30'
  riskLevel?: 'low' | 'medium' | 'high';
  canonicalId?: string;
  aliases?: string[];
  supersedes?: string[];
  neighborhoods?: string[];
  poi?: string[];
  cluster?: string; // From FAQ_CLUSTERS
  claimType?: 'none' | 'pricing' | 'safety' | 'medical' | 'legal';
  requiresDisclaimer?: boolean;
  librarySection?: 'core' | 'plan-your-trip' | 'deep-library';
  /** Tokens used in this FAQ's answer (for validation & reporting) */
  tokensUsed?: string[];
  translations: {
    en: FaqTranslation;
    es?: FaqTranslation;
    fr?: FaqTranslation;
    el?: FaqTranslation;
    ru?: FaqTranslation;
  };
}

// ════════════════════════════════════════════════════════════════════════
// CATEGORIES (for display grouping)
// ════════════════════════════════════════════════════════════════════════

export const FAQ_CATEGORIES = {
  BOOKING_PAYMENT: 'Booking & Payment',
  ARRIVAL_LOGISTICS: 'Arrival & Logistics',
  STAFF_SERVICE: 'Staff & Service',
  FOOD_DINING: 'Food & Dining',
  AMENITIES: 'Amenities & Equipment',
  TECHNOLOGY: 'Technology & Connectivity',
  SAFETY_SECURITY: 'Safety & Security',
  FAMILIES_KIDS: 'Families & Children',
  EVENTS_WEDDINGS: 'Events & Weddings',
  EXCURSIONS: 'Excursions & Activities',
  NIGHTLIFE: 'Nightlife & Dining Out',
  ACCESSIBILITY: 'Accessibility',
  PETS: 'Pets',
  WEATHER_CLIMATE: 'Weather & Climate',
  HOUSE_RULES: 'House Rules & Policies',
  REMOTE_WORK: 'Remote Work & Corporate',
  SUSTAINABILITY: 'Sustainability',
  PRIVACY_VIP: 'Privacy & VIP',
  SPORTS_WELLNESS: 'Sports & Wellness',
  CONTENT_PRODUCTION: 'Content Production',
  LOCATION: 'Location & Neighborhoods',
  BEACH_CLUBS: 'Beach Clubs & Day Trips',
} as const;

// ════════════════════════════════════════════════════════════════════════
// CLUSTERS (for SEO topic grouping)
// ════════════════════════════════════════════════════════════════════════

export const FAQ_CLUSTERS = {
  BOOKING_PAYMENTS: 'booking-payments',
  ARRIVAL_TRANSFERS: 'arrival-transfers',
  LOCATION_NEIGHBORHOODS: 'location-neighborhoods',
  STAFF_SERVICE: 'staff-service',
  FOOD_DRINKS: 'food-drinks',
  AMENITIES_HARDWARE: 'amenities-hardware',
  TECH_REMOTE_WORK: 'tech-remote-work',
  EXPERIENCES_EXCURSIONS: 'experiences-excursions',
  BEACH_CLUBS: 'beach-clubs',
  WEDDINGS_EVENTS: 'weddings-events',
  HOUSE_RULES: 'house-rules',
  SAFETY_MEDICAL: 'safety-medical',
  PRIVACY_SECURITY: 'privacy-security',
  FAMILIES_KIDS: 'families-kids',
} as const;

export type FaqCluster = typeof FAQ_CLUSTERS[keyof typeof FAQ_CLUSTERS];

// ════════════════════════════════════════════════════════════════════════
// MASTER FAQ BANK (array of FaqEntry)
// ════════════════════════════════════════════════════════════════════════

export const masterFaqBank: FaqEntry[] = [
  // ==================== BOOKING & PAYMENT ====================
  {
    id: 'booking-min-stay',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'core',
    tags: ['booking', 'minimum-stay', 'reservation'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'pricing',
    librarySection: 'core',
    translations: {
      en: {
        q: 'What is the minimum stay at the villa?',
        a: 'Our standard minimum stay is 3 nights, with a 4–5 night minimum during peak holiday periods such as Christmas, New Year\'s, and Easter. For shorter stays, please inquire and we will confirm based on availability and season.'
      },
      es: {
        q: '¿Cuál es la estancia mínima en la villa?',
        a: 'Nuestra estancia mínima estándar es de 3 noches, con un mínimo de 4-5 noches durante los períodos de vacaciones como Navidad, Año Nuevo y Semana Santa. Para estancias más cortas, consulte y confirmaremos según la disponibilidad y la temporada.'
      },
      fr: {
        q: 'Quelle est la durée minimale de séjour à la villa ?',
        a: 'Notre séjour minimum standard est de 3 nuits, avec un minimum de 4 à 5 nuits pendant les périodes de vacances de pointe telles que Noël, le Nouvel An et Pâques. Pour des séjours plus courts, veuillez vous renseigner et nous confirmerons en fonction de la disponibilité et de la saison.'
      }
    }
  },
  {
    id: 'booking-advance-booking',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'standard',
    tags: ['booking', 'high-season', 'availability'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'How far in advance should we book for high season?',
        a: 'For Christmas, New Year\'s, and major events in Cartagena, we recommend booking 6–9 months in advance. For regular weekends and low season dates, 2–3 months is usually sufficient, although last-minute availability can be limited.'
      },
      es: {
        q: '¿Con cuánta antelación debemos reservar para la temporada alta?',
        a: 'Para Navidad, Año Nuevo y eventos importantes en Cartagena, recomendamos reservar con 6 a 9 meses de antelación. Para fines de semana regulares y fechas de temporada baja, 2 a 3 meses suelen ser suficientes, aunque la disponibilidad de última hora puede ser limitada.'
      },
      fr: {
        q: 'Combien de temps à l’avance devons-nous réserver pour la haute saison ?',
        a: 'Pour Noël, le Nouvel An et les grands événements à Carthagène, nous recommandons de réserver 6 à 9 mois à l’avance. Pour les week-ends réguliers et les dates de basse saison, 2 à 3 mois suffisent généralement, bien que la disponibilité de dernière minute puisse être limitée.'
      }
    }
  },
  {
    id: 'booking-temporary-hold',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'standard',
    tags: ['booking', 'hold', 'reservation'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we place a temporary hold on dates while we decide?',
        a: 'In most cases, we can hold your preferred dates for 48 hours without obligation while you coordinate flights and confirm with your group. After that window, a deposit is required to secure the booking.'
      }
    }
  },
  {
    id: 'booking-deposit',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'core',
    tags: ['booking', 'deposit', 'payment'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'pricing',
    librarySection: 'core',
    translations: {
      en: {
        q: 'What deposit is required to confirm a booking?',
        a: 'A 50% deposit is typically required to secure your dates, with the remaining 50% due 30 days prior to arrival. For last-minute bookings, full payment may be required upfront.'
      }
    }
  },
  {
    id: 'booking-platforms',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'standard',
    tags: ['booking', 'platforms', 'direct'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we book through Airbnb or other platforms?',
        a: 'Yes, the villa may appear on platforms like Airbnb or Vrbo, but booking direct through our VIP concierge team saves you on platform fees, offers the most flexible terms, priority on special requests, and the best overall value.'
      }
    }
  },
  {
    id: 'booking-extended-stay-discount',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'optional',
    tags: ['booking', 'discount', 'long-stay'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'pricing',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Do you offer discounts for extended stays?',
        a: 'Yes. For stays of 10 nights or longer, we can offer preferential rates or added-value inclusions such as additional boat transfers, complimentary activities, or late checkout, depending on the dates.'
      }
    }
  },
  {
    id: 'rates-cancellation-policy',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'core',
    tags: ['cancellation', 'refund', 'policy'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'legal',
    requiresDisclaimer: true,
    librarySection: 'core',
    tokensUsed: ['cancellationPolicy'],
    translations: {
      en: {
        q: 'What is the cancellation policy?',
        a: '{{cancellationPolicy}}'
      },
      es: {
        q: '¿Cuál es la política de cancelación?',
        a: '{{cancellationPolicy}}'
      }
    }
  },
  {
    id: 'rates-payment-methods',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'core',
    tags: ['payment', 'credit-card', 'wire-transfer'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Do you accept credit cards?',
        a: 'Yes. We accept Visa, MasterCard, and AMEX via a secure Stripe link (3% processing fee applies). Wire transfers have no fee.'
      }
    }
  },
  {
    id: 'rates-security-deposit',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'core',
    tags: ['deposit', 'security', 'refund'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'legal',
    requiresDisclaimer: true,
    librarySection: 'core',
    tokensUsed: ['securityDepositPolicy'],
    translations: {
      en: {
        q: 'Is there a security deposit?',
        a: '{{securityDepositPolicy}}'
      },
      es: {
        q: '¿Hay un depósito de seguridad?',
        a: '{{securityDepositPolicy}}'
      }
    }
  },
  {
    id: 'rates-taxes',
    category: FAQ_CATEGORIES.BOOKING_PAYMENT,
    priority: 'core',
    tags: ['tax', 'iva', 'colombia'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'pricing',
    requiresDisclaimer: true,
    librarySection: 'core',
    tokensUsed: ['taxDisclaimer'],
    translations: {
      en: {
        q: 'Do we pay taxes?',
        a: 'Foreign tourists are generally exempt from the 19% IVA tax with valid documentation. Colombian nationals and residents pay tax by law. {{taxDisclaimer}}'
      }
    }
  },

  // ==================== ARRIVAL & LOGISTICS ====================
  {
    id: 'arrival-airport-vip',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'optional',
    tags: ['airport', 'vip', 'concierge', 'immigration'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.ARRIVAL_TRANSFERS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Do you offer VIP airport meet-and-greet services?',
        a: 'Yes. Our VIP concierge can arrange meet-and-greet at Rafael Núñez International Airport (CTG), expediting immigration and customs for a seamless arrival.'
      }
    }
  },
  {
    id: 'arrival-armored-vehicles',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'optional',
    tags: ['transport', 'security', 'armored'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.ARRIVAL_TRANSFERS,
    claimType: 'none',
    librarySection: 'deep-library',
    tokensUsed: ['conciergeFacilitation'],
    translations: {
      en: {
        q: 'Can you arrange armored vehicles for transport?',
        a: '{{conciergeFacilitation}}'
      },
      es: {
        q: '¿Pueden organizar vehículos blindados para el transporte?',
        a: '{{conciergeFacilitation}}'
      }
    }
  },
  {
    id: 'arrival-helicopter',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'optional',
    tags: ['helicopter', 'transfer', 'luxury'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: ['isla-tierrabomba'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.ARRIVAL_TRANSFERS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can we arrive by helicopter?',
        a: 'Yes. {{helicopterArrivalDetails}}'
      }
    }
  },
  {
    id: 'arrival-pier-depth',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'standard',
    tags: ['pier', 'yacht', 'dock'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: ['has-private-pier'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.ARRIVAL_TRANSFERS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is the private pier deep enough for large yachts?',
        a: '{{pierDetails}}'
      }
    }
  },
  {
    id: 'arrival-transfer-time',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'core',
    tags: ['transfer', 'time', 'airport'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.ARRIVAL_TRANSFERS,
    claimType: 'none',
    librarySection: 'core',
    tokensUsed: ['airportName', 'arrivalRouteSummary'],
    translations: {
      en: {
        q: 'What is the transfer time from {{airportName}} to the villa?',
        a: '{{arrivalRouteSummary}}'
      }
    }
  },
  {
    id: 'arrival-luggage-logistics',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'standard',
    tags: ['luggage', 'logistics', 'groups'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.ARRIVAL_TRANSFERS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do you handle luggage logistics for large groups?',
        a: 'Yes. For large groups with excessive luggage, we arrange a separate luggage boat to ensure your arrival on the main speedboat is comfortable and uncluttered.'
      }
    }
  },
  {
    id: 'arrival-rental-boat-docking',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'optional',
    tags: ['boat', 'docking', 'rental'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: ['has-private-pier'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.ARRIVAL_TRANSFERS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can we dock our own rental boat?',
        a: 'Yes. {{rentalBoatDockingDetails}}'
      }
    }
  },

  // ==================== LOCATION & NEIGHBORHOODS ====================
  {
    id: 'location-walled-city',
    category: FAQ_CATEGORIES.LOCATION,
    priority: 'core',
    tags: ['location', 'old-town', 'centro-historico'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.LOCATION_NEIGHBORHOODS,
    claimType: 'none',
    librarySection: 'core',
    tokensUsed: ['walledCityAccessSummary'],
    translations: {
      en: {
        q: 'How close is the villa to the Walled City (Old Town)?',
        a: '{{walledCityAccessSummary}}'
      }
    }
  },
  {
    id: 'location-getsemani',
    category: FAQ_CATEGORIES.LOCATION,
    priority: 'standard',
    tags: ['location', 'getsemani', 'plaza'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.LOCATION_NEIGHBORHOODS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is it easy to visit Getsemaní?',
        a: 'Yes. Our boat drops you at the Muelle de los Pegasos, a 5-minute walk from the heart of Getsemaní, famous for Plaza de la Trinidad and street art.'
      }
    }
  },
  {
    id: 'location-bocagrande',
    category: FAQ_CATEGORIES.LOCATION,
    priority: 'standard',
    tags: ['location', 'bocagrande', 'shopping'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.LOCATION_NEIGHBORHOODS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we visit Bocagrande from the villa?',
        a: '{{bocagrandeAccessSummary}}'
      }
    }
  },
  {
    id: 'location-privacy',
    category: FAQ_CATEGORIES.LOCATION,
    priority: 'standard',
    tags: ['location', 'privacy', 'island'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: ['isla-tierrabomba'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.LOCATION_NEIGHBORHOODS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is the villa\'s side of the island private?',
        a: '{{locationPrivacyDetails}}'
      }
    }
  },

  // ==================== STAFF & SERVICE ====================
  {
    id: 'staff-butler',
    category: FAQ_CATEGORIES.STAFF_SERVICE,
    priority: 'core',
    tags: ['staff', 'butler', 'service'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.STAFF_SERVICE,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Do you have a butler?',
        a: 'Yes. Your dedicated butler manages drinks service, meal setups, towel refreshment, and acts as your primary liaison with the kitchen team.'
      }
    }
  },
  {
    id: 'staff-languages',
    category: FAQ_CATEGORIES.STAFF_SERVICE,
    priority: 'standard',
    tags: ['staff', 'languages', 'translation'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.STAFF_SERVICE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What languages does the staff speak?',
        a: 'Our VIP Concierge team is fluent in English and Spanish. House staff are primarily Spanish-speaking, but our concierge assists with any translation needs.'
      }
    }
  },
  {
    id: 'staff-availability',
    category: FAQ_CATEGORIES.STAFF_SERVICE,
    priority: 'core',
    tags: ['staff', 'hours', 'availability'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.STAFF_SERVICE,
    claimType: 'none',
    librarySection: 'core',
    tokensUsed: ['staffDescription'],
    translations: {
      en: {
        q: 'What staff is included with the villa?',
        a: '{{staffDescription}}'
      },
      es: {
        q: '¿Qué personal está incluido con la villa?',
        a: '{{staffDescription}}'
      }
    }
  },
  {
    id: 'staff-accommodation',
    category: FAQ_CATEGORIES.STAFF_SERVICE,
    priority: 'standard',
    tags: ['staff', 'accommodation', 'privacy', 'security'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.STAFF_SERVICE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Does the staff sleep on the property?',
        a: 'Yes. A live-in administrator provides 24/7 security and is available for emergencies. Their quarters are separate from guest areas to ensure your privacy. Daytime staff (cook/maid) work scheduled hours.'
      },
      es: {
        q: '¿El personal duerme en la propiedad?',
        a: 'Sí. Un administrador residente proporciona seguridad 24/7 y está disponible para emergencias. Sus habitaciones están separadas de las áreas de huéspedes para garantizar su privacidad. El personal diurno (cocinero/mucama) trabaja en horarios programados.'
      }
    }
  },
  {
    id: 'staff-female-only',
    category: FAQ_CATEGORIES.STAFF_SERVICE,
    priority: 'optional',
    tags: ['staff', 'privacy', 'cultural'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.STAFF_SERVICE,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can we request a female-only staff?',
        a: 'For cultural or religious privacy requirements, our concierge can arrange an all-female house service team. Please note this may not extend to security personnel. Advance notice required.'
      }
    }
  },
  {
    id: 'staff-turndown',
    category: FAQ_CATEGORIES.STAFF_SERVICE,
    priority: 'standard',
    tags: ['staff', 'turndown', 'housekeeping'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.STAFF_SERVICE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do you provide turndown service?',
        a: 'Yes. Housekeeping performs an evening turndown service, closing blackout curtains, refreshing towels, and preparing the suites for sleep.'
      }
    }
  },

  // ==================== FOOD & DINING ====================
  {
    id: 'food-breakfast-included',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'core',
    tags: ['food', 'breakfast', 'chef'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Is breakfast included?',
        a: 'Yes! Breakfast preparation can be arranged with our chef services (groceries cost extra).'
      }
    }
  },
  {
    id: 'food-chef-specialty',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'standard',
    tags: ['food', 'chef', 'cuisine'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What cuisine does the chef specialize in?',
        a: 'Our chef excels in Colombian Caribbean cuisine (fresh seafood, coconut rice, patacones) but is trained in international, Italian, and BBQ grill menus.'
      }
    }
  },
  {
    id: 'food-kosher-halal',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'optional',
    tags: ['food', 'dietary', 'kosher', 'halal'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can you accommodate Kosher or Halal diets?',
        a: 'Yes. With advance notice, we can source Kosher or Halal meats and dedicated cookware to adhere to dietary laws.'
      }
    }
  },
  {
    id: 'food-vegan-vegetarian',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'standard',
    tags: ['food', 'vegan', 'vegetarian', 'dietary'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do you offer a vegan or vegetarian menu?',
        a: 'Absolutely. We create rich plant-based menus using local tropical fruits and vegetables. Favorite dishes include ceviche de mango and coconut vegetable curries.'
      }
    }
  },
  {
    id: 'food-groceries',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'core',
    tags: ['food', 'groceries', 'shopping'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'core',
    tokensUsed: ['groceryPolicy'],
    translations: {
      en: {
        q: 'How are groceries procured?',
        a: '{{groceryPolicy}}'
      },
      es: {
        q: '¿Cómo se obtienen los víveres?',
        a: '{{groceryPolicy}}'
      }
    }
  },
  {
    id: 'food-alcohol',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'core',
    tags: ['food', 'alcohol', 'bar'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Is alcohol included?',
        a: 'No, but we can pre-stock the bar with your preferred wines, spirits, and mixers before arrival. You pay retail price with no markup.'
      }
    }
  },
  {
    id: 'food-mixologist',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'optional',
    tags: ['food', 'bar', 'cocktails'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can we hire a mixologist?',
        a: 'Yes. We can bring in a professional bartender to create signature cocktails for a pool party or sunset hour.'
      }
    }
  },
  {
    id: 'food-coffee',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'standard',
    tags: ['food', 'coffee', 'nespresso'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is there a coffee machine?',
        a: 'Yes. The kitchen is equipped with a Nespresso machine (pods provided) and a traditional Colombian drip coffee setup.'
      }
    }
  },
  {
    id: 'food-romantic-dinner',
    category: FAQ_CATEGORIES.FOOD_DINING,
    priority: 'optional',
    tags: ['food', 'romantic', 'special-occasion'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FOOD_DRINKS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can the chef prepare a romantic dinner?',
        a: 'Absolutely. We can arrange a private candlelit dinner by the pool or on the rooftop terrace with city views, complete with flowers, ambient music, and a custom tasting menu prepared by our chef.'
      },
      es: {
        q: '¿Puede el chef preparar una cena romántica?',
        a: 'Por supuesto. Podemos organizar una cena privada con velas junto a la piscina o en la terraza de la azotea con vistas a la ciudad, con flores, música ambiental y un menú de degustación personalizado preparado por nuestro chef.'
      }
    }
  },

  // ==================== AMENITIES & EQUIPMENT ====================
  {
    id: 'amenities-toiletries',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'standard',
    tags: ['amenities', 'toiletries', 'bathroom'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What toiletries are provided?',
        a: '{{toiletriesDetails}}'
      }
    }
  },
  {
    id: 'amenities-bed-configuration',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'core',
    tags: ['amenities', 'beds', 'rooms'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'core',
    tokensUsed: ['bedConfiguration'],
    translations: {
      en: {
        q: 'What is the bed configuration?',
        a: '{{bedConfiguration}}'
      }
    }
  },
  {
    id: 'amenities-linens',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'standard',
    tags: ['amenities', 'linens', 'quality'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Are the linens luxury grade?',
        a: 'Yes. We use 600-thread-count Egyptian cotton sheets and plush, hotel-quality towels.'
      }
    }
  },
  {
    id: 'amenities-hair-dryer',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'standard',
    tags: ['amenities', 'bathroom', 'hair-dryer'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is there a hair dryer in every room?',
        a: 'Yes. Every bathroom is equipped with a professional-grade hair dryer.'
      }
    }
  },
  {
    id: 'amenities-safe',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'core',
    tags: ['amenities', 'safe', 'security'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Is there a safe for valuables?',
        a: 'Yes. Each bedroom has a digital programmable safe large enough for laptops and jewelry.'
      }
    }
  },
  {
    id: 'amenities-steam-iron',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'standard',
    tags: ['amenities', 'iron', 'laundry'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do you have a steam iron?',
        a: 'Yes. We have a steamer and ironing board available. Staff can also press clothes for you.'
      }
    }
  },
  {
    id: 'amenities-tennis-court',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'standard',
    tags: ['amenities', 'tennis', 'sports'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: ['has-tennis-court'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Tell me about the tennis court.',
        a: '{{tennisCourtDetails}}'
      }
    }
  },
  {
    id: 'amenities-gym',
    category: FAQ_CATEGORIES.AMENITIES,
    priority: 'standard',
    tags: ['amenities', 'gym', 'fitness', 'tennis'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.AMENITIES_HARDWARE,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is there a gym or tennis court?',
        a: 'There\'s no on-site gym or tennis court, but our VIP concierge can facilitate access to fitness centers and tennis clubs in the city. For jogging, the historic Getsemaní streets and nearby parks are ideal.'
      },
      es: {
        q: '¿Hay gimnasio o cancha de tenis?',
        a: 'No hay gimnasio ni cancha de tenis en la propiedad, pero nuestro concierge VIP puede facilitar acceso a gimnasios y clubes de tenis en la ciudad. Para correr, las calles históricas de Getsemaní y parques cercanos son ideales.'
      }
    }
  },

  // ==================== TECHNOLOGY & CONNECTIVITY ====================
  {
    id: 'tech-internet',
    category: FAQ_CATEGORIES.TECHNOLOGY,
    priority: 'core',
    tags: ['technology', 'wifi', 'internet'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.TECH_REMOTE_WORK,
    claimType: 'none',
    librarySection: 'core',
    tokensUsed: ['wifiSpec'],
    translations: {
      en: {
        q: 'How reliable is the internet?',
        a: '{{wifiSpec}}'
      }
    }
  },
  {
    id: 'tech-printer',
    category: FAQ_CATEGORIES.TECHNOLOGY,
    priority: 'optional',
    tags: ['technology', 'printer', 'business'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.TECH_REMOTE_WORK,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is there a printer available?',
        a: 'The villa does not have an on-site printer, but our VIP concierge can assist with printing needs—whether arranging pickup from a nearby print shop or coordinating delivery for boarding passes or documents.'
      },
      es: {
        q: '¿Hay impresora disponible?',
        a: 'La villa no tiene impresora en el sitio, pero nuestro concierge VIP puede asistir con necesidades de impresión—ya sea organizando recogida en una imprenta cercana o coordinando entrega de pases de abordar o documentos.'
      }
    }
  },
  {
    id: 'tech-tv-channels',
    category: FAQ_CATEGORIES.TECHNOLOGY,
    priority: 'standard',
    tags: ['technology', 'tv', 'entertainment'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.TECH_REMOTE_WORK,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What TV channels do you have?',
        a: '{{entertainmentDetails}}'
      }
    }
  },
  {
    id: 'tech-power-adapter',
    category: FAQ_CATEGORIES.TECHNOLOGY,
    priority: 'standard',
    tags: ['technology', 'electricity', 'adapter'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.TECH_REMOTE_WORK,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do I need a power adapter?',
        a: 'The villa uses Type A/B plugs (same as USA/Canada). European guests will need a standard adapter.'
      }
    }
  },

  // ==================== EXCURSIONS & ACTIVITIES ====================
  {
    id: 'excursions-rosario-islands',
    category: FAQ_CATEGORIES.EXCURSIONS,
    priority: 'standard',
    tags: ['excursions', 'islands', 'day-trip'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we go to the Rosario Islands?',
        a: 'Absolutely! The Rosario Islands are a must-see. From the villa, it\'s a 5-minute taxi to Muelle de la Bodeguita, then 45-60 minutes by boat. Highlights include the Oceanarium and famous sunken plane snorkeling. Our concierge arranges private boats or group tours.'
      },
      es: {
        q: '¿Podemos ir a las Islas del Rosario?',
        a: '¡Por supuesto! Las Islas del Rosario son imperdibles. Desde la villa, es taxi de 5 minutos al Muelle de la Bodeguita, luego 45-60 minutos en bote. Incluye el Oceanario y el famoso snorkel del avión hundido. Nuestro concierge organiza botes privados o tours grupales.'
      }
    }
  },
  {
    id: 'excursions-cholon',
    category: FAQ_CATEGORIES.EXCURSIONS,
    priority: 'standard',
    tags: ['excursions', 'party', 'boat'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What about Cholón?',
        a: 'Cholón is the famous floating party spot in the Rosario Islands. Our concierge can arrange a yacht rental or catamaran from Cartagena marina (5-min taxi) for a full day trip with return by sunset.'
      },
      es: {
        q: '¿Qué hay de Cholón?',
        a: 'Cholón es el famoso lugar de fiesta flotante en las Islas del Rosario. Nuestro concierge puede organizar un yate o catamarán desde la marina de Cartagena (5 min en taxi) para un día completo con regreso al atardecer.'
      }
    }
  },
  {
    id: 'excursions-historical-tour',
    category: FAQ_CATEGORIES.EXCURSIONS,
    priority: 'standard',
    tags: ['excursions', 'tour', 'history'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can you arrange a historical tour?',
        a: 'Yes. We can book private bilingual guides for walking tours of the Walled City, the Castle of San Felipe, or the Inquisition Palace.'
      }
    }
  },
  {
    id: 'excursions-fishing',
    category: FAQ_CATEGORIES.EXCURSIONS,
    priority: 'optional',
    tags: ['excursions', 'fishing', 'sports'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Do you offer fishing trips?',
        a: 'Yes. We can arrange local fishing outings with island fishermen or charter a professional sport-fishing boat for deep-sea excursions.'
      }
    }
  },
  {
    id: 'excursions-massages',
    category: FAQ_CATEGORIES.EXCURSIONS,
    priority: 'standard',
    tags: ['excursions', 'spa', 'wellness'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we get massages at the villa?',
        a: 'Yes. We have a roster of professional therapists who can perform deep tissue or relaxing massages on the open-air deck.'
      }
    }
  },
  {
    id: 'excursions-yoga',
    category: FAQ_CATEGORIES.EXCURSIONS,
    priority: 'standard',
    tags: ['excursions', 'yoga', 'wellness'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we do yoga?',
        a: 'Yes. We can bring a private yoga instructor to the villa for sunrise or sunset sessions on the terrace.'
      }
    }
  },

  // ==================== BEACH CLUBS & DAY TRIPS ====================
  {
    id: 'beach-club-time-savings',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'standard',
    tags: ['beach-clubs', 'location', 'convenience'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'How convenient is beach club access from the villa?',
        a: 'From {{villaName}}, it\'s a quick 5-minute taxi to Muelle de la Bodeguita pier. From there: Tierrabomba beach clubs (Amare, Anaho, Namaste) are 10-15 minutes by boat; Rosario Islands (Bora Bora, Blue Apple) are 45-60 minutes. Our concierge arranges boats and reservations.'
      },
      es: {
        q: '¿Qué tan conveniente es el acceso a clubes de playa?',
        a: 'Desde {{villaName}}, es un taxi rápido de 5 minutos al Muelle de la Bodeguita. Desde allí: clubes de Tierrabomba (Amare, Anaho, Namaste) están a 10-15 minutos en bote; Islas del Rosario (Bora Bora, Blue Apple) a 45-60 minutos. Nuestro concierge organiza botes y reservaciones.'
      }
    }
  },
  {
    id: 'beach-club-nearby',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'standard',
    tags: ['beach-clubs', 'nearby', 'tierrabomba'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Which beach clubs are closest?',
        a: 'From Cartagena: Tierrabomba clubs (Amare, Anaho, Namaste) are 15 minutes by boat from Muelle de la Bodeguita. Rosario Island clubs (Bora Bora, Blue Apple, Cholon) are 45-60 minutes. Our VIP concierge handles boat arrangements and club reservations.'
      },
      es: {
        q: '¿Cuáles clubes de playa están más cerca?',
        a: 'Desde Cartagena: clubes de Tierrabomba (Amare, Anaho, Namaste) están a 15 minutos en bote desde Muelle de la Bodeguita. Clubes de Islas del Rosario (Bora Bora, Blue Apple, Cholon) a 45-60 minutos. Nuestro concierge VIP gestiona botes y reservaciones.'
      }
    }
  },
  {
    id: 'beach-club-bora-bora',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'standard',
    tags: ['beach-clubs', 'rosario-islands', 'party'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is Bora Bora Beach Club accessible?',
        a: 'Yes. Bora Bora is in the Rosario Islands, {{transferTimeBoraBoraFromVilla}}.'
      }
    }
  },
  {
    id: 'beach-club-amare',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'standard',
    tags: ['beach-clubs', 'tierrabomba', 'family-friendly'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'How far is Amare Beach Club from {{villaName}}?',
        a: 'Amare Beach Club (Punta Arena, Tierrabomba) is an eco-friendly local hotspot with live music, hammocks and a family-friendly atmosphere. From {{villaName}}, {{transferTimeAmare}}. From Cartagena it\'s about 15 minutes by boat. Amare has a sustainable, community-focused vibe ideal for relaxed days.'
      }
    }
  },
  {
    id: 'beach-club-anaho',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'luxury'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Anaho Beach Club from {{villaName}}?',
        a: 'Anaho Beach Club is a luxury retreat on Punta Arena with private sunbeds, gourmet dining and open-ocean views. From {{villaName}}, {{transferTimeAnaho}}. Cartagena trips are about 15 minutes. Anaho is ideal for upscale, quiet relaxation.'
      }
    }
  },
  {
    id: 'beach-club-ancestral',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'culture'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Ancestral Lounge Beach Club from the villa?',
        a: 'Ancestral Lounge, located in central Tierrabomba, blends Caribbean culture with live music, cocktails and chill-out areas. From {{villaName}}, {{transferTimeAncestral}}. From Cartagena, it\'s about 15 minutes. Great for groups seeking authentic island energy.'
      }
    }
  },
  {
    id: 'beach-club-atolon',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'wellness'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Atolón Tierra Bomba Beach Club from {{villaName}}?',
        a: 'Atolón, on Punta Arena, focuses on serenity with pools, cabanas and wellness activities like yoga. From {{villaName}}, {{transferTimeAtolon}}. From Cartagena it\'s around 15 minutes. Ideal for guests wanting a calm, wellness-centered day.'
      }
    }
  },
  {
    id: 'beach-club-blue-apple',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'standard',
    tags: ['beach-clubs', 'tierrabomba', 'lgbtq', 'sustainability'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'How far is Blue Apple Beach Club from the villa?',
        a: 'Blue Apple Beach (south Tierrabomba) is Mediterranean-inspired with pool parties, strong cocktails, excellent wine and a B-Corp sustainability focus. From {{villaName}}, {{transferTimeBlueApple}}. From Cartagena, 20–30 minutes by their shuttle. It\'s LGBTQI+ friendly with a lively social scene.'
      }
    }
  },
  {
    id: 'beach-club-bomba',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'eco-friendly'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Bomba Beach Club from {{villaName}}?',
        a: 'Bomba Beach Club (central Tierrabomba) offers tropical hammocks, a seafood restaurant and a pool. From {{villaName}}, {{transferTimeBomba}}. From Cartagena it\'s about 10 minutes. Eco-conscious, plastic-free and easygoing.'
      }
    }
  },
  {
    id: 'beach-club-kabanna',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'nightlife'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Club Kabanna from {{villaName}}?',
        a: 'Club Kabanna (Punta Arena) is an exclusive lounge with Nikkei fusion dining, a private beach and a party-forward energy. From {{villaName}}, {{transferTimeKabanna}}. Open until 11 PM. Cartagena access is roughly 10 minutes.'
      }
    }
  },
  {
    id: 'beach-club-eteka',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'wellness', 'eco'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Eteka Slow Beach from {{villaName}}?',
        a: 'Eteka Slow Beach is a wellness-oriented eco-spot with yoga sessions, nature trails and a slow-paced atmosphere. From {{villaName}}, {{transferTimeEteka}}. From Cartagena, expect around 15 minutes. Ideal for couples and families seeking tranquility.'
      }
    }
  },
  {
    id: 'beach-club-fenix',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'bohemian'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Fénix Beach Club from {{villaName}}?',
        a: 'Fénix Beach Club (Punta Arena) has a bohemian-modern feel with skyline views, volleyball and paella lunches. From {{villaName}}, {{transferTimeFenix}}. Cartagena departures take around 15 minutes. Festival vibes on weekends and holidays.'
      }
    }
  },
  {
    id: 'beach-club-hi-cartagena',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'youthful'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Hi Cartagena Beach Club from the villa?',
        a: 'Hi Cartagena Beach Club (central Tierrabomba) is a newer venue with urban music and a youthful vibe. From {{villaName}}, {{transferTimeHiCartagena}}. From Cartagena, about 15 minutes. Ideal for younger groups.'
      }
    }
  },
  {
    id: 'beach-club-makani',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'ultra-luxury'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Makani Luxury Beach Club from {{villaName}}?',
        a: 'Makani (Punta Arena) offers ultra-luxury amenities including an infinity pool, yoga decks, fine dining and water sports. From {{villaName}}, {{transferTimeMakani}}. Cartagena trips are about 15 minutes. Perfect for upscale events and stylish lounging.'
      }
    }
  },
  {
    id: 'beach-club-mangata',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'gourmet'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Mangata Beach Club from {{villaName}}?',
        a: 'Mangata Beach Club (Punta Arena) is known for gourmet-focused tranquility, premium cocktails and upscale loungers. From {{villaName}}, {{transferTimeMangata}}. Great for serene luxury days.'
      }
    }
  },
  {
    id: 'beach-club-namaste',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'wellness', 'vegan'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Namasté Beach Club from {{villaName}}?',
        a: 'Namasté Beach Club (Punta Arena) is a holistic, wellness-oriented space offering vegan/vegetarian food, spa services, pools and ancestral ceremonies. From {{villaName}}, {{transferTimeNamaste}}. From Cartagena, about the same. Perfect for mind-body balance.'
      }
    }
  },
  {
    id: 'beach-club-palmarito',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'tierrabomba', 'relaxed'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Palmarito Beach Club from {{villaName}}?',
        a: 'Palmarito Beach Club (Punta Arena) is relaxed and natural with cabanas, snorkeling spots and a low-key luxury feel. From {{villaName}}, {{transferTimePalmarito}}. From Cartagena it\'s roughly 15 minutes.'
      }
    }
  },
  {
    id: 'beach-club-area',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'luxury'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Área Beach (Arena Beach) in the Rosario Islands?',
        a: 'Área Beach (Isla Grande) offers luxury open-bar days and traditional island lunches. From {{villaName}}, {{transferTimeArea}}. Expect clear water and a vibrant, upscale crowd.'
      }
    }
  },
  {
    id: 'beach-club-bendita',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'exclusive'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Bendita Beach Club from {{villaName}}?',
        a: 'Bendita Beach (Isla Grande) features clean, vendor-free sands, pools and DJs. From {{villaName}}, {{transferTimeBendita}}. From Cartagena it\'s about 45 minutes. A refined escape with great reviews for exclusivity.'
      }
    }
  },
  {
    id: 'beach-club-ibbiza',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'exclusive'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Ibbiza Island Beach Club from {{villaName}}?',
        a: 'Ibbiza Island Beach Club (central Rosario Islands) offers an exclusive white-sand escape with gourmet lunches and panoramic sea views. From {{villaName}}, {{transferTimeIbbiza}}. From Cartagena, usually the same. Ideal for quiet, high-end days.'
      }
    }
  },
  {
    id: 'beach-club-islabela',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'family-friendly'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Islabela Cartagena Beach Club from the villa?',
        a: 'Islabela (Isla Grande) provides a private beach, pool, kayaks and full-day passes with lunch. From {{villaName}}, {{transferTimeIslabela}}. Cartagena departures are 45 minutes. Very family-friendly with calm waters.'
      }
    }
  },
  {
    id: 'beach-club-mantas',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'baru', 'nature'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Mantas Beach Hideaway & Lounge from {{villaName}}?',
        a: 'Mantas Beach (Barú, edge of Rosario Islands) is a quiet hideaway centered on nature and serenity. From {{villaName}}, {{transferTimeMantas}}. From Cartagena the trip is similar. Best for peaceful escapes.'
      }
    }
  },
  {
    id: 'beach-club-pao-pao',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'adults-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Pa\'o Pa\'o Beach Club from the villa?',
        a: 'Pa\'o Pa\'o (central Rosario Islands) is adults-only with chic pool beds, DJ sessions and a lively-but-stylish ambiance. From {{villaName}}, {{transferTimePaoPao}}. Cartagena departures are roughly 45–60 minutes.'
      }
    }
  },
  {
    id: 'beach-club-paue',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'eco-chic'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Paue Cartagena Beach Lounge from {{villaName}}?',
        a: 'Paue Beach Lounge (Isla Grande) is eco-chic with white sands, cocktails and group-friendly setups. From {{villaName}}, {{transferTimePaue}}. Cartagena access is also around 45 minutes.'
      }
    }
  },
  {
    id: 'beach-club-rosario',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'live-music'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Rosario Beach Club from {{villaName}}?',
        a: 'Rosario Beach Club (Isla Grande) features wide beaches, luxury facilities and live music events. From {{villaName}}, {{transferTimeRosario}}. From Cartagena, around 45 minutes as well.'
      }
    }
  },
  {
    id: 'beach-club-rosario-del-mar',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'open-bar'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Rosario del Mar from the villa?',
        a: 'Rosario del Mar (Isla Grande) offers open-bar day passes, snorkeling and upbeat island energy. From {{villaName}}, {{transferTimeRosarioDelMar}}. Cartagena departures take the same time.'
      }
    }
  },
  {
    id: 'beach-club-vistamar',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'rosario-islands', 'modern'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Vistamar Beach Club by Bluemars from {{villaName}}?',
        a: 'Vistamar by Bluemars (central Rosario Islands) has modern loungers, fresh seafood and relaxed oceanfront vibes. From {{villaName}}, {{transferTimeVistamar}}. From Cartagena, around 45 minutes.'
      }
    }
  },
  {
    id: 'beach-club-playa-blanca',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'baru', 'traditional'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Club de Playa Playa Blanca from {{villaName}}?',
        a: 'Club de Playa Playa Blanca (Barú) offers relaxed snorkeling, white sands and traditional Caribbean cuisine. From {{villaName}}, {{transferTimePlayaBlanca}}. By land from Cartagena, the trip is also roughly 45 minutes.'
      }
    }
  },
  {
    id: 'beach-club-mambo',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'baru', 'vibrant'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Mambo Beach Club (Barú) from {{villaName}}?',
        a: 'Mambo Beach (Playa Blanca, Barú) is vibrant with urban music, great seafood, VIP beds and exceptionally clear water. From {{villaName}}, {{transferTimeMambo}}. By land from Cartagena it\'s also about 45 minutes.'
      }
    }
  },
  {
    id: 'beach-club-nena',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'baru', 'stylish'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Nena Beach Club from {{villaName}}?',
        a: 'Nena Beach Club (Playa Blanca, Barú) is a stylish, vendor-free beach setting perfect for long lunches and sunsets. From {{villaName}}, {{transferTimeNena}}. On land from Cartagena it\'s also 45 minutes.'
     
      }
    }
  },
  {
    id: 'beach-club-sabai',
    category: FAQ_CATEGORIES.BEACH_CLUBS,
    priority: 'optional',
    tags: ['beach-clubs', 'baru', 'secluded'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How far is Sabai Barú Beach Club from {{villaName}}?',
        a: 'Sabai Barú (Playa Blanca, Barú) has secluded mangroves, an infinity pool, rooftop views and gourmet dining. From {{villaName}}, {{transferTimeSabai}}. On land from Cartagena, also about 45 minutes.'
      }
    }
  },

  // ==================== EVENTS & WEDDINGS ====================
  {
    id: 'events-wedding-capacity',
    category: FAQ_CATEGORIES.EVENTS_WEDDINGS,
    priority: 'standard',
    tags: ['wedding', 'events', 'capacity'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.WEDDINGS_EVENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What is the capacity for a wedding?',
        a: 'We can host intimate weddings and events for up to 60 guests. The pool deck and rooftop terrace can be configured for ceremonies and receptions with stunning city views.'
      },
      es: {
        q: '¿Cuál es la capacidad para una boda?',
        a: 'Podemos organizar bodas íntimas y eventos para hasta 60 invitados. La terraza de la piscina y la azotea se pueden configurar para ceremonias y recepciones con impresionantes vistas de la ciudad.'
      }
    }
  },
  {
    id: 'events-noise-curfew',
    category: FAQ_CATEGORIES.EVENTS_WEDDINGS,
    priority: 'standard',
    tags: ['wedding', 'events', 'noise'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.WEDDINGS_EVENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is there a noise curfew for parties?',
        a: 'As a city villa, local noise ordinances apply. Music should be lowered by midnight out of respect for neighbors. For late-night celebrations, our VIP concierge can arrange private venue rentals at nearby clubs.'
      },
      es: {
        q: '¿Hay toque de queda para fiestas?',
        a: 'Como villa urbana, aplican las ordenanzas locales de ruido. La música debe bajarse a medianoche por respeto a los vecinos. Para celebraciones nocturnas, nuestro concierge VIP puede organizar alquileres de locales privados en clubes cercanos.'
      }
    }
  },
  {
    id: 'events-vendors',
    category: FAQ_CATEGORIES.EVENTS_WEDDINGS,
    priority: 'standard',
    tags: ['wedding', 'events', 'vendors'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.WEDDINGS_EVENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we bring outside vendors?',
        a: 'Yes. We welcome outside caterers, decorators, florists, and wedding planners. As a city villa, vendors have easy street access for deliveries and setup. Our concierge coordinates all logistics and scheduling.'
      },
      es: {
        q: '¿Podemos traer proveedores externos?',
        a: 'Sí. Aceptamos caterers, decoradores, floristas y organizadores de bodas externos. Como villa urbana, los proveedores tienen fácil acceso por la calle para entregas y montaje. Nuestro concierge coordina toda la logística.'
      }
    }
  },
  {
    id: 'events-fee',
    category: FAQ_CATEGORIES.EVENTS_WEDDINGS,
    priority: 'standard',
    tags: ['wedding', 'events', 'fee'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.WEDDINGS_EVENTS,
    claimType: 'pricing',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do you require an event fee?',
        a: 'Yes. An event fee applies for any gathering larger than the registered house guests (16 people). Please inquire for specific rates.'
      }
    }
  },
  {
    id: 'events-power-live-band',
    category: FAQ_CATEGORIES.EVENTS_WEDDINGS,
    priority: 'standard',
    tags: ['wedding', 'events', 'power', 'music'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.WEDDINGS_EVENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is there power for a live band?',
        a: 'Yes. The villa has reliable city power with multiple outlets on the rooftop and pool deck for full AV setups, lighting rigs, and live bands.'
      },
      es: {
        q: '¿Hay electricidad para una banda en vivo?',
        a: 'Sí. La villa tiene electricidad confiable de la ciudad con múltiples tomacorrientes en la azotea y terraza de la piscina para equipos de AV, iluminación y bandas en vivo.'
      }
    }
  },
  {
    id: 'events-wedding-planners',
    category: FAQ_CATEGORIES.EVENTS_WEDDINGS,
    priority: 'standard',
    tags: ['wedding', 'events', 'planners'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.WEDDINGS_EVENTS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do you work with wedding planners?',
        a: 'We have preferred relationships with Cartagena\'s top planners, including Caribe Cordial and various luxury event producers.'
      }
    }
  },

  // ==================== HOUSE RULES & POLICIES ====================
  {
    id: 'house-rules-smoking',
    category: FAQ_CATEGORIES.HOUSE_RULES,
    priority: 'core',
    tags: ['rules', 'smoking', 'policy'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'What are the smoking rules at the villa?',
        a: 'Smoking is not allowed inside the bedrooms or interior spaces. Guests may smoke outdoors in designated areas such as the pool deck or terrace, using the ashtrays provided to protect the property and environment.'
      }
    }
  },
  {
    id: 'house-rules-visitors',
    category: FAQ_CATEGORIES.HOUSE_RULES,
    priority: 'core',
    tags: ['rules', 'visitors', 'guests'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Are outside visitors allowed during our stay?',
        a: 'Yes, daytime visitors are allowed with prior notice to our VIP concierge and security team. For larger gatherings or events beyond the registered house guests, event rules and additional fees may apply.'
      }
    }
  },
  {
    id: 'house-rules-maximum-capacity',
    category: FAQ_CATEGORIES.HOUSE_RULES,
    priority: 'core',
    tags: ['rules', 'capacity', 'guests'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Is there a maximum number of people allowed on the property at any time?',
        a: 'Overnight capacity is limited to 16 registered guests. For events or daytime gatherings, we can host up to 60 people with prior approval, an event plan, and payment of the applicable event fee.'
      }
    }
  },
  {
    id: 'house-rules-drones',
    category: FAQ_CATEGORIES.HOUSE_RULES,
    priority: 'optional',
    tags: ['rules', 'drones', 'photography'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Are drones allowed on the property?',
        a: 'Drones are permitted for private use provided they do not disturb neighboring properties and comply with Colombian aviation regulations. For professional shoots, prior approval is required.'
      }
    }
  },
  {
    id: 'house-rules-loud-music',
    category: FAQ_CATEGORIES.HOUSE_RULES,
    priority: 'standard',
    tags: ['rules', 'music', 'noise', 'parties'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can we play loud music late at night?',
        a: 'You are free to enjoy music at reasonable volumes throughout the day and evening. For parties, we generally ask that music be reduced after 2:00 AM out of respect for staff, the environment, and local regulations. Note: if noise exceeds levels permitted by local law and police are called, you will be required to turn off the music. Music is allowed within reason.'
      },
      es: {
        q: '¿Podemos poner música alta tarde en la noche?',
        a: 'Pueden disfrutar música a volúmenes razonables durante el día y la noche. Para fiestas, generalmente pedimos que la música se baje después de las 2:00 AM por respeto al personal, el ambiente y las regulaciones locales. Nota: si el ruido excede los niveles permitidos por la ley local y llaman a la policía, deberán apagar la música. La música está permitida dentro de lo razonable.'
      }
    }
  },

  // ==================== SAFETY & SECURITY ====================
  {
    id: 'safety-area-safe',
    category: FAQ_CATEGORIES.SAFETY_SECURITY,
    priority: 'core',
    tags: ['safety', 'security', 'area'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.SAFETY_MEDICAL,
    claimType: 'safety',
    requiresDisclaimer: true,
    librarySection: 'core',
    tokensUsed: ['safetyDisclaimer'],
    translations: {
      en: {
        q: 'Is the area safe?',
        a: 'The property is located in a well-regarded area. As with any destination, we recommend standard travel precautions. {{safetyDisclaimer}}'
      }
    }
  },
  {
    id: 'safety-hospital',
    category: FAQ_CATEGORIES.SAFETY_SECURITY,
    priority: 'core',
    tags: ['safety', 'medical', 'hospital'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.SAFETY_MEDICAL,
    claimType: 'medical',
    librarySection: 'core',
    tokensUsed: ['nearestHospitalDetails'],
    translations: {
      en: {
        q: 'Is there a hospital nearby?',
        a: '{{nearestHospitalDetails}}'
      }
    }
  },
  {
    id: 'safety-first-aid',
    category: FAQ_CATEGORIES.SAFETY_SECURITY,
    priority: 'core',
    tags: ['safety', 'medical', 'first-aid'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.SAFETY_MEDICAL,
    claimType: 'medical',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Do you have first aid on site?',
        a: 'Yes. We maintain a fully stocked medical kit. All staff are trained in basic emergency response protocols.'
      }
    }
  },
  {
    id: 'safety-water-current',
    category: FAQ_CATEGORIES.SAFETY_SECURITY,
    priority: 'standard',
    tags: ['safety', 'water', 'swimming'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.SAFETY_MEDICAL,
    claimType: 'safety',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is the water current strong?',
        a: 'The water in front of the villa is typically calm, but currents can change. We advise swimming only when conditions are green-flagged by the captain.'
      }
    }
  },
  {
    id: 'safety-jellyfish',
    category: FAQ_CATEGORIES.SAFETY_SECURITY,
    priority: 'standard',
    tags: ['safety', 'water', 'marine-life'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.SAFETY_MEDICAL,
    claimType: 'medical',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Are there jellyfish?',
        a: 'Seasonally (usually mid-year), small jellyfish can appear. We monitor the water daily and advise guests accordingly.'
      }
    }
  },

  // ==================== NIGHTLIFE & DINING OUT ====================
  {
    id: 'nightlife-restaurants',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['nightlife', 'restaurants', 'dining'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What are the best restaurants in Cartagena?',
        a: 'We recommend La Vitrola (classic Cuban), Carmen (modern Colombian), Celele (Caribbean fusion), and Alma (upscale). Our VIP concierge handles reservations.'
      }
    }
  },
  {
    id: 'nightlife-best-spots',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['nightlife', 'bars', 'clubs'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Where is the best nightlife?',
        a: 'Alquímico (world-ranked bar), Café Havana (salsa in Getsemaní), and La Movida (club) are top choices.'
      }
    }
  },
  {
    id: 'nightlife-safety-walk',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['nightlife', 'safety', 'walking'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'safety',
    requiresDisclaimer: true,
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is it safe to walk in the Walled City at night?',
        a: 'The Walled City and Getsemaní are popular tourist areas with regular police presence. As always, stay aware of your surroundings and avoid poorly lit streets. {{safetyDisclaimer}}'
      }
    }
  },

  // ==================== FAMILIES & CHILDREN ====================
  {
    id: 'families-crib',
    category: FAQ_CATEGORIES.FAMILIES_KIDS,
    priority: 'standard',
    tags: ['families', 'kids', 'infants'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FAMILIES_KIDS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do you have a crib?',
        a: 'Yes. We have a Pack \'n Play style crib and a high chair available for infants.'
      }
    }
  },
  {
    id: 'families-pool-safety',
    category: FAQ_CATEGORIES.FAMILIES_KIDS,
    priority: 'core',
    tags: ['families', 'kids', 'pool', 'safety'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.FAMILIES_KIDS,
    claimType: 'safety',
    librarySection: 'core',
    translations: {
      en: {
        q: 'Is the pool safe for kids?',
        a: 'The pool has a shallow ledge, but it is not fenced. Children must be supervised at all times. We can install a temporary mesh fence for stays with toddlers upon request.'
      }
    }
  },
  {
    id: 'families-babysitter',
    category: FAQ_CATEGORIES.FAMILIES_KIDS,
    priority: 'standard',
    tags: ['families', 'kids', 'babysitting'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FAMILIES_KIDS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Can you arrange a babysitter?',
        a: 'Yes. We work with a trusted nanny agency in Cartagena that provides background-checked, CPR-certified babysitters.'
      }
    }
  },
  {
    id: 'families-teenagers',
    category: FAQ_CATEGORIES.FAMILIES_KIDS,
    priority: 'standard',
    tags: ['families', 'kids', 'teenagers'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.FAMILIES_KIDS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What activities are there for teenagers?',
        a: 'Teens love exploring Getsemaní\'s street art and nightlife, boat trips to beach clubs for jet skis and paddleboards, the famous "sunken plane" snorkeling at the Rosario Islands, and touring historic forts like Castillo San Felipe. Our concierge arranges all activities.'
      },
      es: {
        q: '¿Qué actividades hay para adolescentes?',
        a: 'A los adolescentes les encanta explorar el arte callejero y la vida nocturna de Getsemaní, excursiones en bote a clubes de playa para jet skis y paddleboards, el famoso snorkel del "avión hundido" en las Islas del Rosario, y tours a fuertes históricos como el Castillo San Felipe. Nuestro concierge organiza todas las actividades.'
      }
    }
  },

  // ==================== ACCESSIBILITY ====================
  {
    id: 'accessibility-wheelchair',
    category: FAQ_CATEGORIES.ACCESSIBILITY,
    priority: 'optional',
    tags: ['accessibility', 'wheelchair', 'disabled'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is the villa wheelchair accessible?',
        a: 'The main floor (living, dining, pool deck) and one ground-floor bedroom are wheelchair-friendly once inside. Note: The historic colonial entrance has steps from street level. Please contact our concierge in advance to discuss accessibility needs.'
      },
      es: {
        q: '¿La villa es accesible para sillas de ruedas?',
        a: 'El piso principal (sala, comedor, terraza de piscina) y un dormitorio en planta baja son accesibles una vez dentro. Nota: La entrada colonial histórica tiene escalones desde la calle. Contacte a nuestro concierge con anticipación para discutir necesidades de accesibilidad.'
      }
    }
  },
  {
    id: 'accessibility-elevator',
    category: FAQ_CATEGORIES.ACCESSIBILITY,
    priority: 'optional',
    tags: ['accessibility', 'elevator', 'stairs'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Does the villa have an elevator?',
        a: 'No. The villa is two stories. The upper bedrooms are accessed via a wide staircase.'
      }
    }
  },

  // ==================== PETS ====================
  {
    id: 'pets-pet-friendly',
    category: FAQ_CATEGORIES.PETS,
    priority: 'standard',
    tags: ['pets', 'dogs', 'animals'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is the villa pet-friendly?',
        a: 'Yes, for small, well-behaved dogs. A pet cleaning fee applies, and pets are not allowed on furniture or in the pool.'
      }
    }
  },

  // ==================== WEATHER & CLIMATE ====================
  {
    id: 'weather-rainy-season',
    category: FAQ_CATEGORIES.WEATHER_CLIMATE,
    priority: 'standard',
    tags: ['weather', 'climate', 'rain'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'When is the rainy season?',
        a: 'October and November are the wettest months, though rains are usually short tropical bursts followed by sun.'
      }
    }
  },
  {
    id: 'weather-breeze',
    category: FAQ_CATEGORIES.WEATHER_CLIMATE,
    priority: 'standard',
    tags: ['weather', 'climate', 'wind'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Is there a breeze?',
        a: 'Yes. Cartagena enjoys consistent Caribbean trade winds. The rooftop terrace catches excellent breezes, and all rooms have air conditioning. Getsemaní\'s proximity to the bay keeps temperatures comfortable.'
      },
      es: {
        q: '¿Hay brisa?',
        a: 'Sí. Cartagena disfruta de vientos alisios caribeños constantes. La terraza en la azotea capta excelentes brisas, y todas las habitaciones tienen aire acondicionado. La proximidad de Getsemaní a la bahía mantiene temperaturas confortables.'
      }
    }
  },
  {
    id: 'weather-best-months',
    category: FAQ_CATEGORIES.WEATHER_CLIMATE,
    priority: 'standard',
    tags: ['weather', 'climate', 'best-time'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'What are the best months to visit for calm seas and sunshine?',
        a: 'December through April typically brings the sunniest days and steady trade winds. Sea conditions are generally calm in the mornings year-round, making early boat trips and water activities ideal.'
      }
    }
  },
  {
    id: 'weather-hurricanes',
    category: FAQ_CATEGORIES.WEATHER_CLIMATE,
    priority: 'standard',
    tags: ['weather', 'climate', 'hurricanes'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Does Cartagena experience hurricanes?',
        a: 'Cartagena is outside the main Atlantic hurricane corridor. While we can experience strong rains and occasional storms, direct hurricanes are extremely rare compared to many Caribbean islands.'
      }
    }
  },

  // ==================== REMOTE WORK & CORPORATE ====================
  {
    id: 'remote-work-corporate-retreats',
    category: FAQ_CATEGORIES.REMOTE_WORK,
    priority: 'optional',
    tags: ['remote-work', 'corporate', 'retreat'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.TECH_REMOTE_WORK,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is the villa suitable for corporate retreats or team offsites?',
        a: 'Yes. {{villaName}} is ideal for executive retreats and small team offsites. We can arrange meeting spaces, breakout areas, audiovisual equipment, private chefs, and curated experiences designed around strategy, wellness, or team-building.'
      }
    }
  },
  {
    id: 'remote-work-equipment',
    category: FAQ_CATEGORIES.REMOTE_WORK,
    priority: 'optional',
    tags: ['remote-work', 'office', 'equipment'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.TECH_REMOTE_WORK,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can you provide additional workstations or office equipment?',
        a: 'We can provide extra ergonomic chairs, worktables, power strips, and a printer. On request, we can also arrange external monitors, flip charts, and whiteboards for workshop-style sessions.'
      }
    }
  },
  {
    id: 'remote-work-wifi-multiple-users',
    category: FAQ_CATEGORIES.REMOTE_WORK,
    priority: 'core',
    tags: ['remote-work', 'wifi', 'internet'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.TECH_REMOTE_WORK,
    claimType: 'none',
    librarySection: 'core',
    tokensUsed: ['wifiSpec'],
    translations: {
      en: {
        q: 'Is the Wi-Fi strong enough for multiple people working remotely?',
        a: 'Absolutely. {{wifiSpec}} Several guests can comfortably run video conferences, upload large files, and work online simultaneously throughout the property.'
      },
      es: {
        q: '¿Es el Wi-Fi suficiente para varias personas trabajando remotamente?',
        a: 'Absolutamente. {{wifiSpec}} Varios huéspedes pueden cómodamente tener videoconferencias, subir archivos grandes y trabajar en línea simultáneamente en toda la propiedad.'
      }
    }
  },

  // ==================== SUSTAINABILITY ====================
  {
    id: 'sustainability-practices',
    category: FAQ_CATEGORIES.SUSTAINABILITY,
    priority: 'optional',
    tags: ['sustainability', 'eco', 'environment'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What sustainability practices does the villa follow?',
        a: 'We prioritize responsible water use, low-plastic operations, and local sourcing. The villa uses filtered water dispensers, eco-conscious cleaning products where possible, and supports local fishermen and farmers for fresh ingredients.'
      }
    }
  },
  {
    id: 'sustainability-waste',
    category: FAQ_CATEGORIES.SUSTAINABILITY,
    priority: 'optional',
    tags: ['sustainability', 'recycling', 'waste'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How do you handle waste and recycling?',
        a: 'Waste is separated at the villa for recycling and collected by municipal services. We minimize single-use plastics and favor reusable containers and filtered water stations throughout the property.'
      },
      es: {
        q: '¿Cómo manejan los residuos y reciclaje?',
        a: 'Los residuos se separan en la villa para reciclaje y son recogidos por servicios municipales. Minimizamos plásticos de un solo uso y favorecemos contenedores reutilizables y estaciones de agua filtrada en toda la propiedad.'
      }
    }
  },
  {
    id: 'sustainability-wildlife',
    category: FAQ_CATEGORIES.SUSTAINABILITY,
    priority: 'optional',
    tags: ['sustainability', 'wildlife', 'environment'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Do lights and music affect local wildlife?',
        a: 'We encourage responsible use of exterior lighting and sound, especially late at night, to respect local bird and marine life. Our team can advise on best practices during your stay.'
      }
    }
  },

  // ==================== PRIVACY & VIP ====================
  {
    id: 'privacy-vip-suitable',
    category: FAQ_CATEGORIES.PRIVACY_VIP,
    priority: 'optional',
    tags: ['privacy', 'vip', 'high-profile'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.PRIVACY_SECURITY,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is the villa suitable for high-profile or VIP guests?',
        a: 'Yes. {{villaName}} is frequently chosen by VIP and high-profile guests who value privacy. Access to the property is controlled, staff are trained in discretion, and we can implement additional security protocols on request.'
      }
    }
  },
  {
    id: 'privacy-ndas',
    category: FAQ_CATEGORIES.PRIVACY_VIP,
    priority: 'optional',
    tags: ['privacy', 'nda', 'confidentiality'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.PRIVACY_SECURITY,
    claimType: 'legal',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can you sign NDAs or confidentiality agreements?',
        a: 'Yes. Our management company is accustomed to working under non-disclosure agreements for corporate retreats, celebrity stays, and confidential projects.'
      }
    }
  },
  {
    id: 'privacy-cctv',
    category: FAQ_CATEGORIES.PRIVACY_VIP,
    priority: 'optional',
    tags: ['privacy', 'security', 'cctv'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.PRIVACY_SECURITY,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'How is CCTV used on the property?',
        a: 'CCTV cameras monitor only external access points such as the dock and main entrance for security reasons. There are no cameras inside the villa or in private guest areas.'
      }
    }
  },
  {
    id: 'privacy-data-sharing',
    category: FAQ_CATEGORIES.PRIVACY_VIP,
    priority: 'optional',
    tags: ['privacy', 'data', 'security'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.PRIVACY_SECURITY,
    claimType: 'legal',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Do you share guest data with third parties?',
        a: 'No. Guest information is used solely for reservation, billing, and service coordination. We do not sell or share guest data with third-party marketers.'
      }
    }
  },

  // ==================== SPORTS & WELLNESS ====================
  {
    id: 'sports-tennis-clinic',
    category: FAQ_CATEGORIES.SPORTS_WELLNESS,
    priority: 'optional',
    tags: ['sports', 'tennis', 'wellness'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can you organize a tennis clinic or mini-tournament?',
        a: 'Yes. We can coordinate certified tennis coaches, hitting partners, and organized round-robin formats for groups. Scoreboards, ball baskets, and refreshments can be set up courtside.'
      }
    }
  },
  {
    id: 'sports-personal-trainer',
    category: FAQ_CATEGORIES.SPORTS_WELLNESS,
    priority: 'optional',
    tags: ['sports', 'fitness', 'wellness'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Do you offer personal trainers or fitness sessions?',
        a: 'We work with personal trainers who can lead functional training, boxing, HIIT, or mobility sessions on the terrace, tennis court, or beach at sunrise or sunset.'
      }
    }
  },
  {
    id: 'sports-wellness-retreats',
    category: FAQ_CATEGORIES.SPORTS_WELLNESS,
    priority: 'optional',
    tags: ['sports', 'wellness', 'retreat'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Are there wellness-focused retreats available?',
        a: 'On request, we can design wellness-oriented stays featuring yoga, massage, healthy menus, breathwork sessions, and digital detox experiences tailored to your group.'
      }
    }
  },

  // ==================== CONTENT PRODUCTION ====================
  {
    id: 'content-photoshoot',
    category: FAQ_CATEGORIES.CONTENT_PRODUCTION,
    priority: 'optional',
    tags: ['content', 'photoshoot', 'production'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can we use the villa for a photoshoot or video production?',
        a: 'Yes. {{villaName}} is available for brand shoots, fashion campaigns, and content productions. Location fees and production guidelines apply depending on crew size and usage.'
      }
    }
  },
  {
    id: 'content-influencer-support',
    category: FAQ_CATEGORIES.CONTENT_PRODUCTION,
    priority: 'optional',
    tags: ['content', 'influencer', 'social-media'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Do you offer support for social media creators or influencers?',
        a: 'We can help coordinate optimal shooting times, boat and drone shots, and local creatives such as photographers, videographers, makeup artists, and stylists familiar with the area.'
      }
    }
  },

  // ==================== LONG STAYS & SPECIAL CASES ====================
  {
    id: 'long-stays-packages',
    category: FAQ_CATEGORIES.HOUSE_RULES,
    priority: 'optional',
    tags: ['long-stay', 'packages', 'delivery'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can we receive packages or deliveries during our stay?',
        a: 'Yes. Packages can be sent to our Cartagena office or dock and then forwarded to the villa by boat. Please coordinate in advance with our VIP concierge to manage timing and handling.'
      }
    }
  },
  {
    id: 'long-stays-monthly',
    category: FAQ_CATEGORIES.HOUSE_RULES,
    priority: 'optional',
    tags: ['long-stay', 'monthly', 'extended'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-30',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.HOUSE_RULES,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is the villa suitable for month-long or seasonal stays?',
        a: 'Yes. For extended stays, we can adapt staffing schedules, design a rotating menu plan, and customize housekeeping frequency. Long-stay pricing is available on request.'
      }
    }
  },

  // ==================== BASIC FAQS (General) ====================
  {
    id: 'general-beach-distance',
    category: FAQ_CATEGORIES.LOCATION,
    priority: 'core',
    tags: ['beach', 'access', 'distance'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.LOCATION_NEIGHBORHOODS,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'How far is the beach?',
        a: 'Bocagrande beach is a 10-minute taxi ride. For pristine Caribbean beaches, Tierrabomba island is 15 minutes by boat from Muelle de la Bodeguita (5-min taxi from villa). Our concierge arranges all beach transportation.'
      },
      es: {
        q: '¿Qué tan lejos está la playa?',
        a: 'La playa de Bocagrande está a 10 minutos en taxi. Para playas caribeñas prístinas, la isla Tierrabomba está a 15 minutos en bote desde Muelle de la Bodeguita (5 min en taxi desde la villa). Nuestro concierge organiza todo el transporte.'
      }
    }
  },

  // ==================== CITY VILLA LOGISTICS (Walled City / Getsemaní) ====================
  {
    id: 'location-marina-access',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'standard',
    tags: ['marina', 'boat-trips', 'logistics', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.LOCATION_NEIGHBORHOODS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    tokensUsed: ['villaName'],
    translations: {
      en: {
        q: 'How do we get to our boat or yacht charter?',
        a: 'Since {{villaName}} is in the city, our concierge will arrange a 5-minute taxi to Muelle de la Bodeguita or Muelle de los Pegasos (Pegasus Pier). Your captain will meet you there for departure to islands or beach clubs.'
      },
      es: {
        q: '¿Cómo llegamos a nuestro barco o yate?',
        a: 'Como {{villaName}} está en la ciudad, nuestro concierge organizará un taxi de 5 minutos al Muelle de la Bodeguita o Muelle de los Pegasos. Su capitán lo esperará allí para la salida a las islas o clubes de playa.'
      }
    }
  },
  {
    id: 'location-marina-bodeguita',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'standard',
    tags: ['marina', 'pier', 'beach-clubs', 'city-only', 'rosario'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Which pier do beach club boats leave from?',
        a: 'Most beach club shuttles and day-trips depart from Muelle de la Bodeguita (5-minute taxi from the villa). This is the main tourist pier directly in front of the Walled City near the Pegasus statues. Note: A port tax of approx. 23,000–29,000 COP (~$6 USD) is required in cash at the entrance before boarding.'
      },
      es: {
        q: '¿De qué muelle salen los barcos a los clubes de playa?',
        a: 'La mayoría de los traslados a clubes de playa salen del Muelle de la Bodeguita (5 minutos en taxi desde la villa). Es el muelle turístico principal frente a la Ciudad Amurallada, cerca de las estatuas de Pegaso. Nota: Se requiere un impuesto portuario de aprox. 23,000–29,000 COP (~$6 USD) en efectivo en la entrada antes de abordar.'
      }
    }
  },
  {
    id: 'location-marina-vip-charters',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'standard',
    tags: ['marina', 'yacht', 'vip', 'city-only', 'private'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Where do private yacht charters depart from?',
        a: 'For private yacht rentals and premium speedboat charters, Marina Todomar in Bocagrande (10-minute taxi) offers a VIP experience: no queues, air-conditioned waiting areas, and direct boarding. Our concierge coordinates all arrangements.'
      },
      es: {
        q: '¿De dónde salen los yates privados?',
        a: 'Para alquiler de yates privados y lanchas premium, Marina Todomar en Bocagrande (10 minutos en taxi) ofrece una experiencia VIP: sin colas, áreas de espera con aire acondicionado y embarque directo. Nuestro concierge coordina todos los arreglos.'
      }
    }
  },
  {
    id: 'location-marina-port-tax',
    category: FAQ_CATEGORIES.ARRIVAL_LOGISTICS,
    priority: 'standard',
    tags: ['marina', 'tax', 'cash', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'medium',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'pricing',
    librarySection: 'plan-your-trip',
    translations: {
      en: {
        q: 'Do we need cash for the port/marina?',
        a: 'Yes. At Muelle de la Bodeguita (the main tourist pier), a government port tax of approximately 23,000–29,000 COP (~$6 USD) must be paid in cash before boarding. Cards are not accepted for this specific fee. Our staff will remind you to bring cash on beach club days.'
      },
      es: {
        q: '¿Necesitamos efectivo para el puerto/marina?',
        a: 'Sí. En el Muelle de la Bodeguita (el muelle turístico principal), se debe pagar en efectivo un impuesto portuario de aproximadamente 23,000–29,000 COP (~$6 USD) antes de abordar. No se aceptan tarjetas para esta tasa específica. Nuestro personal le recordará llevar efectivo los días de club de playa.'
      }
    }
  },
  {
    id: 'location-beach-access-city',
    category: FAQ_CATEGORIES.LOCATION,
    priority: 'core',
    tags: ['beach', 'boat', 'city-only', 'tierrabomba', 'rosario'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BEACH_CLUBS,
    claimType: 'none',
    librarySection: 'core',
    translations: {
      en: {
        q: 'How do we get to the beach from the villa?',
        a: 'As a city-center villa, the best beaches require a boat ride. A 5-minute taxi takes you to Muelle de la Bodeguita, where you can catch boats to: Tierrabomba beach clubs (10–20 min boat), Rosario Islands (40–50 min boat), or Barú/Playa Blanca (45 min boat). Our concierge books all transfers and beach club reservations.'
      },
      es: {
        q: '¿Cómo llegamos a la playa desde la villa?',
        a: 'Como villa en el centro de la ciudad, las mejores playas requieren un viaje en bote. Un taxi de 5 minutos lo lleva al Muelle de la Bodeguita, donde puede tomar barcos a: clubes de playa de Tierrabomba (10-20 min en bote), Islas del Rosario (40-50 min en bote), o Barú/Playa Blanca (45 min en bote). Nuestro concierge reserva todos los traslados y clubes de playa.'
      }
    }
  },

  // ==================== ELITE 30: TOP RESTAURANTS (Getsemaní/Walled City) ====================
  {
    id: 'dining-top-restaurants',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'core',
    tags: ['restaurants', 'dining', 'fine-dining', 'city-only', 'getsemani'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    tokensUsed: ['topRestaurantsSummary'],
    translations: {
      en: {
        q: 'What are the best restaurants near the villa?',
        a: '{{topRestaurantsSummary}}'
      },
      es: {
        q: '¿Cuáles son los mejores restaurantes cerca de la villa?',
        a: '{{topRestaurantsSummary}}'
      }
    }
  },
  {
    id: 'dining-celele',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'getsemani', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can you tell me about Celele restaurant?',
        a: 'Celele (2-minute walk) is ranked among the World\'s 50 Best Restaurants. Chef Jaime Rodríguez showcases Caribbean experimental cuisine with foraged local ingredients. Reservations should be made weeks in advance—our concierge can assist.'
      }
    }
  },
  {
    id: 'dining-la-vitrola',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is La Vitrola like?',
        a: 'La Vitrola (11-minute walk) is the classic Cartagena fine dining experience. Located in a colonial mansion, it features live Cuban son music, impeccable service, and legendary seafood. A must-visit for first-time Cartagena visitors.'
      }
    }
  },
  {
    id: 'dining-carmen',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is Carmen restaurant worth visiting?',
        a: 'Carmen (12-minute walk) offers contemporary molecular Colombian cuisine in a stunning garden courtyard setting. Chef Rob Sobczynski creates innovative dishes that redefine Colombian flavors. Perfect for a special occasion dinner.'
      }
    }
  },
  {
    id: 'dining-alma',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What about Alma restaurant?',
        a: 'Alma (10-minute walk) is located in the beautiful Hotel Casa San Agustin. Known for upscale seafood, especially their famous lobster, and a romantic courtyard atmosphere. Ideal for intimate dinners and special celebrations.'
      }
    }
  },
  {
    id: 'dining-mar-y-zielo',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is Mar y Zielo known for?',
        a: 'Mar y Zielo (7-minute walk) offers high-concept Colombian cuisine with an exceptional rooftop bar. Great for pre-dinner cocktails with city views before transitioning to their elegant dining room.'
      }
    }
  },
  {
    id: 'dining-casual-options',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'casual-dining', 'getsemani', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What about more casual dining options nearby?',
        a: 'For casual dining within minutes: Demente (3-min walk) for artisan pizza and tapas with a retractable roof; Pezetarian (4-min) for excellent sushi and plant-based bowls; and Cocina de Pepina (4-min) for legendary traditional coastal soups—a true local gem.'
      }
    }
  },
  // Additional Top 20 Restaurants with exact distances
  {
    id: 'dining-marea',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only', 'sunset'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What about Marea restaurant?',
        a: 'Marea (7-minute walk) overlooks the Clock Tower and bay—widely considered the best sunset dining view in Cartagena. Excellent seafood and Mediterranean-inspired dishes in an upscale setting.'
      }
    }
  },
  {
    id: 'dining-cande',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only', 'cultural'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is Candé worth visiting?',
        a: 'Candé (14-minute walk) offers full cultural immersion with traditional Colombian recipes and live dancing performances. Perfect for groups wanting an authentic experience beyond just dining.'
      }
    }
  },
  {
    id: 'dining-el-baron',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'tapas', 'walled-city', 'city-only', 'cocktails'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is El Barón like?',
        a: 'El Barón (9-minute walk) is perfectly located on Plaza San Pedro—the heart of the Walled City. Known for excellent tapas and expertly crafted cocktail pairings. Ideal for people-watching over drinks.'
      }
    }
  },
  {
    id: 'dining-donjuan',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Tell me about DonJuán restaurant?',
        a: 'DonJuán (11-minute walk) is Chef Juan Felipe Camacho\'s celebrated Caribbean bistro. Consistently excellent, high-end Caribbean cuisine with impeccable service. A reliable choice for special dinners.'
      }
    }
  },
  {
    id: 'dining-harrys',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only', 'fusion'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is Harry\'s restaurant known for?',
        a: 'Harry\'s (12-minute walk) offers sophisticated international-Colombian fusion in a beautifully restored colonial house. Elegant atmosphere, excellent wine list, and creative fusion dishes.'
      }
    }
  },
  {
    id: 'dining-club-de-pesca',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'seafood', 'walled-city', 'city-only', 'marina'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Can you recommend Club de Pesca?',
        a: 'Club de Pesca (10-minute walk) is uniquely located inside a historic fort overlooking the marina. Fresh seafood with stunning waterfront views. The sunset here is spectacular.'
      }
    }
  },
  {
    id: 'dining-lobo-de-mar',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'seafood', 'walled-city', 'city-only', 'mediterranean'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What about Lobo de Mar?',
        a: 'Lobo de Mar (11-minute walk) specializes in modern Mediterranean-Caribbean fusion. Incredible fish dishes in a stylish setting. Great for seafood lovers wanting something beyond traditional Colombian.'
      }
    }
  },
  {
    id: 'dining-mistura',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'nikkei', 'walled-city', 'city-only', 'fusion'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is Mistura good for groups?',
        a: 'Mistura (14-minute walk) offers excellent Nikkei (Japanese-Peruvian) fusion in a lively atmosphere. Large portions make it great for groups, and the energy is always vibrant.'
      }
    }
  },
  {
    id: 'dining-maria',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only', 'design'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is María restaurant like?',
        a: 'María (11-minute walk) is a design-forward restaurant with a beautiful interior. Colombian-inspired dishes with modern presentation. Excellent for group dinners in a stylish setting.'
      }
    }
  },
  {
    id: 'dining-1621',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'fine-dining', 'walled-city', 'city-only', 'sofitel'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What about Restaurante 1621?',
        a: 'Restaurante 1621 (12-minute walk) is the signature restaurant at the Sofitel Legend Santa Clara, located in a converted 17th-century convent. Fine dining in one of Cartagena\'s most historic and elegant settings.'
      }
    }
  },
  {
    id: 'dining-cuzco',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'peruvian', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is there good Peruvian food nearby?',
        a: 'Cuzco (11-minute walk) is the top Peruvian restaurant in Cartagena. High-end ceviches, tiraditos, and classic Peruvian dishes. Large portions make it excellent for groups.'
      }
    }
  },
  {
    id: 'dining-agua-de-mar',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['restaurants', 'spanish', 'walled-city', 'city-only', 'wine'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is Agua de Mar known for?',
        a: 'Agua de Mar (11-minute walk) serves contemporary Spanish-inspired cuisine with an excellent wine list. Sophisticated atmosphere, perfect for wine lovers and those wanting a European-style dining experience.'
      }
    }
  },

  // ==================== ELITE 30: NIGHTLIFE & BARS ====================
  {
    id: 'nightlife-top-bars',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'core',
    tags: ['nightlife', 'bars', 'clubs', 'city-only', 'getsemani'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'plan-your-trip',
    tokensUsed: ['topNightlifeSummary'],
    translations: {
      en: {
        q: 'What is the nightlife like near the villa?',
        a: '{{topNightlifeSummary}}'
      },
      es: {
        q: '¿Cómo es la vida nocturna cerca de la villa?',
        a: '{{topNightlifeSummary}}'
      }
    }
  },
  {
    id: 'nightlife-alquimico',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['bars', 'cocktails', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is Alquímico bar like?',
        a: 'Alquímico (8-minute walk) has been voted the #1 bar in Latin America and ranks among the World\'s 50 Best Bars. Three floors of experimental cocktails with unique Colombian ingredients. Expect a queue on weekends—arrive early or ask our concierge to coordinate.'
      }
    }
  },
  {
    id: 'nightlife-cafe-havana',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['clubs', 'salsa', 'dancing', 'getsemani', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Should we visit Café Havana?',
        a: 'Café Havana (5-minute walk) is the heart of Getsemaní nightlife. Authentic live salsa bands, classic mojitos, and a packed dance floor. It\'s been visited by everyone from Barack Obama to Mick Jagger. An absolute must-do Cartagena experience.'
      }
    }
  },
  {
    id: 'nightlife-space-getsemani',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['clubs', 'electronic', 'getsemani', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Where can we hear electronic music?',
        a: 'Space (4-minute walk) is Getsemaní\'s best electronic music venue. House and techno sets from local and international DJs in an intimate industrial space. Perfect for groups who want to dance without traveling far.'
      }
    }
  },
  {
    id: 'nightlife-la-movida',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['clubs', 'elite', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What about more upscale nightclubs?',
        a: 'La Movida (9-minute walk) is where Cartagena\'s jet-set parties. European house music meets local crossover hits. Dress code is smart-casual, and the crowd tends to be well-heeled locals and international visitors. Our concierge can arrange table reservations.'
      }
    }
  },
  {
    id: 'nightlife-mister-babilla',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'optional',
    tags: ['clubs', 'crossover', 'getsemani', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Where do locals go to party?',
        a: 'Mister Babilla (6-minute walk) is Cartagena\'s most famous "crossover" club—reggaeton, champeta, salsa, and Colombian hits all night. This is where you experience the total Cartagena party vibe with a mixed local and tourist crowd.'
      }
    }
  },
  // Additional Top 10 Nightlife Venues
  {
    id: 'nightlife-mirador',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['bars', 'rooftop', 'walled-city', 'city-only', 'views'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Where is the best rooftop bar for views?',
        a: 'Mirador (7-minute walk) offers direct views of the Clock Tower and is the best high-volume rooftop bar in the area. Perfect for sunset drinks with a lively atmosphere.'
      }
    }
  },
  {
    id: 'nightlife-fragma',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['clubs', 'multi-room', 'walled-city', 'city-only'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'What is Fragma nightclub like?',
        a: 'Fragma (9-minute walk) is a Walled City classic with three rooms playing different music genres. You can move between electronic, reggaeton, and crossover—something for everyone in your group.'
      }
    }
  },
  {
    id: 'nightlife-la-jugada',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['clubs', 'disco', 'walled-city', 'city-only', 'rooftop'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Where can we go for high-energy dancing?',
        a: 'La Jugada (10-minute walk) is a multi-level disco-club with a great rooftop. High energy all night, popular with groups looking for a big party atmosphere.'
      }
    }
  },
  {
    id: 'nightlife-townhouse',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['bars', 'brunch', 'walled-city', 'city-only', 'sunset'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Is there a good bottomless brunch nearby?',
        a: 'Townhouse (11-minute walk) is famous for their "Bottomless Brunch" and sunset cocktails. Great rooftop atmosphere, popular with international visitors and the expat crowd.'
      }
    }
  },
  {
    id: 'nightlife-el-coro',
    category: FAQ_CATEGORIES.NIGHTLIFE,
    priority: 'standard',
    tags: ['bars', 'cocktails', 'sofitel', 'walled-city', 'city-only', 'live-music'],
    schemaEligible: true,
    appliesTo: ['cartagena'],
    appliesToProperties: [PROPERTY_FEATURES.WALLED_CITY],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.EXPERIENCES_EXCURSIONS,
    claimType: 'none',
    librarySection: 'deep-library',
    translations: {
      en: {
        q: 'Where can we find sophisticated cocktails with live music?',
        a: 'El Coro (12-minute walk) is located in the stunning Sofitel Legend Santa Clara. Elite cocktails in a historic convent setting with live music. The most refined bar experience in Cartagena.'
      }
    }
  },

  // ==================== CONCIERGE FALLBACK ====================
  {
    id: 'concierge-fallback-general',
    category: FAQ_CATEGORIES.STAFF_SERVICE,
    priority: 'optional',
    tags: ['concierge', 'help', 'requests'],
    schemaEligible: true,
    appliesTo: ['all'],
    lastReviewed: '2025-12-31',
    riskLevel: 'low',
    cluster: FAQ_CLUSTERS.BOOKING_PAYMENTS,
    claimType: 'none',
    librarySection: 'deep-library',
    tokensUsed: ['conciergeFallback'],
    translations: {
      en: {
        q: 'Can you arrange services not listed here?',
        a: '{{conciergeFallback}}'
      },
      es: {
        q: '¿Pueden organizar servicios no listados aquí?',
        a: '{{conciergeFallback}}'
      }
    }
  }
];

// ════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════

export function getFaqById(id: string): FaqEntry | undefined {
  return masterFaqBank.find(faq => faq.id === id);
}

export function getFaqsByCategory(category: string): FaqEntry[] {
  return masterFaqBank.filter(faq => faq.category === category);
}

export function getFaqsByTag(tag: string): FaqEntry[] {
  return masterFaqBank.filter(faq => faq.tags.includes(tag));
}

export function getCoreFaqs(): FaqEntry[] {
  return masterFaqBank.filter(faq => faq.priority === 'core');
}

export function getSchemaEligibleFaqs(): FaqEntry[] {
  return masterFaqBank.filter(faq => faq.schemaEligible);
}

export function getFaqsByGeoScope(scope: string): FaqEntry[] {
  return masterFaqBank.filter(faq => faq.appliesTo.includes(scope));
}

export function getFaqsByCluster(cluster: string): FaqEntry[] {
  return masterFaqBank.filter(faq => faq.cluster === cluster);
}

export function getFaqCountsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  
  masterFaqBank.forEach(faq => {
    counts[faq.category] = (counts[faq.category] || 0) + 1;
  });
  
  return counts;
}

/**
 * Get FAQs filtered by geo scope AND property ID
 * This is the main resolver for multi-villa generation
 */
export function getFaqsForVilla(params: {
  scope: string;          // e.g. 'cartagena'
  propertyId: string;     // e.g. 'mark-villa-014'
  lang?: 'en' | 'es' | 'fr' | 'el' | 'ru';
}): FaqEntry[] {
  const { scope, propertyId } = params;

  return masterFaqBank.filter(faq => {
    // Check geo scope
    const geoOk = faq.appliesTo.includes('all') || faq.appliesTo.includes(scope);

    // Check property scope
    const props = faq.appliesToProperties;
    const propOk =
      !props ||
      props.includes('all') ||
      props.includes(propertyId);

    return geoOk && propOk;
  });
}

// ════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS (for build-time safety)
// ════════════════════════════════════════════════════════════════════════

/** Regex to detect unresolved template tokens */
const UNRESOLVED_TOKEN_REGEX = /\{\{.+?\}\}/g;

/**
 * Check if a string contains unresolved tokens
 * Use after interpolation to catch missing villa data
 */
export function hasUnresolvedTokens(text: string): boolean {
  return UNRESOLVED_TOKEN_REGEX.test(text);
}

/**
 * Extract all unresolved tokens from a string
 */
export function getUnresolvedTokens(text: string): string[] {
  const matches = text.match(UNRESOLVED_TOKEN_REGEX);
  return matches ? matches.map(m => m.slice(2, -2)) : [];
}

/**
 * Validate that all appliesToProperties values are valid PropertyFeatures
 * Returns array of invalid entries for reporting
 */
export function validatePropertyFeatures(): Array<{
  faqId: string;
  invalidFeatures: string[];
}> {
  const errors: Array<{ faqId: string; invalidFeatures: string[] }> = [];
  
  for (const faq of masterFaqBank) {
    if (faq.appliesToProperties) {
      const invalid = faq.appliesToProperties.filter(
        f => !VALID_PROPERTY_FEATURES.has(f as PropertyFeature) && f !== 'all'
      );
      if (invalid.length > 0) {
        errors.push({ faqId: faq.id, invalidFeatures: invalid });
      }
    }
  }
  
  return errors;
}

/**
 * Validate a resolved FAQ answer has no unresolved tokens
 * Use this in your build pipeline after token interpolation
 */
export function validateResolvedFaq(params: {
  faqId: string;
  villaId: string;
  resolvedAnswer: string;
}): { valid: boolean; missingTokens: string[] } {
  const tokens = getUnresolvedTokens(params.resolvedAnswer);
  return {
    valid: tokens.length === 0,
    missingTokens: tokens,
  };
}

/**
 * Get all tokens used across the FAQ bank (for documentation/reporting)
 */
export function getAllUsedTokens(): Map<string, string[]> {
  const tokenToFaqs = new Map<string, string[]>();
  
  for (const faq of masterFaqBank) {
    // Check declared tokensUsed
    if (faq.tokensUsed) {
      for (const token of faq.tokensUsed) {
        const existing = tokenToFaqs.get(token) || [];
        existing.push(faq.id);
        tokenToFaqs.set(token, existing);
      }
    }
    
    // Also scan answer text for tokens (catches undeclared ones)
    const answerTokens = getUnresolvedTokens(faq.translations.en.a);
    for (const token of answerTokens) {
      const existing = tokenToFaqs.get(token) || [];
      if (!existing.includes(faq.id)) {
        existing.push(faq.id);
        tokenToFaqs.set(token, existing);
      }
    }
  }
  
  return tokenToFaqs;
}

/**
 * Get FAQs that require tokens the villa doesn't provide
 * Use this to warn about incomplete villa data
 */
export function getMissingTokensForVilla(params: {
  villaId: string;
  villaTokens: Record<string, string>; // tokens the villa provides
  faqs: FaqEntry[];
}): Array<{ faqId: string; missingTokens: string[] }> {
  const results: Array<{ faqId: string; missingTokens: string[] }> = [];
  
  for (const faq of params.faqs) {
    const requiredTokens = getUnresolvedTokens(faq.translations.en.a);
    const missing = requiredTokens.filter(t => !(t in params.villaTokens));
    
    if (missing.length > 0) {
      results.push({ faqId: faq.id, missingTokens: missing });
    }
  }
  
  return results;
}

/**
 * Audit report: which FAQs have tokens but no tokensUsed declaration
 */
export function getUndeclaredTokenUsage(): Array<{
  faqId: string;
  undeclaredTokens: string[];
}> {
  const results: Array<{ faqId: string; undeclaredTokens: string[] }> = [];
  
  for (const faq of masterFaqBank) {
    const actualTokens = getUnresolvedTokens(faq.translations.en.a);
    const declaredTokens = new Set(faq.tokensUsed || []);
    const undeclared = actualTokens.filter(t => !declaredTokens.has(t));
    
    if (undeclared.length > 0) {
      results.push({ faqId: faq.id, undeclaredTokens: undeclared });
    }
  }
  
  return results;
}

// ════════════════════════════════════════════════════════════════════════
// FEATURE-BASED TOKEN REQUIREMENTS
// ════════════════════════════════════════════════════════════════════════

/**
 * Get required tokens for a villa based on its features
 * This ensures villas with specific features provide the necessary data
 */
export function getRequiredTokensForFeatures(
  villaFeatures: PropertyFeature[]
): { universal: string[]; featureBased: Array<{ feature: PropertyFeature; tokens: string[] }> } {
  const universal: string[] = [];
  const featureBased: Array<{ feature: PropertyFeature; tokens: string[] }> = [];
  
  for (const [tokenKey, def] of Object.entries(TOKEN_DEFINITIONS)) {
    if (def.universal) {
      universal.push(tokenKey);
    }
    
    if (def.requiredWhenFeatures) {
      for (const feature of def.requiredWhenFeatures) {
        if (villaFeatures.includes(feature)) {
          let featureEntry = featureBased.find(f => f.feature === feature);
          if (!featureEntry) {
            featureEntry = { feature, tokens: [] };
            featureBased.push(featureEntry);
          }
          featureEntry.tokens.push(tokenKey);
        }
      }
    }
  }
  
  return { universal, featureBased };
}

/**
 * Villa completeness report - actionable checklist per villa
 */
export interface VillaCompletenessReport {
  villaId: string;
  completenessScore: number; // 0-100
  missingUniversalTokens: string[];
  missingFeatureTokens: Array<{ feature: PropertyFeature; tokens: string[] }>;
  faqsWithMissingTokens: Array<{ faqId: string; priority: string; tokens: string[] }>;
  warnings: string[];
}

export function getVillaCompletenessReport(params: {
  villaId: string;
  villaFeatures: PropertyFeature[];
  villaTokens: Record<string, string>;
  scope: string;
}): VillaCompletenessReport {
  const { villaId, villaFeatures, villaTokens, scope } = params;
  const warnings: string[] = [];
  
  // Get required tokens
  const { universal, featureBased } = getRequiredTokensForFeatures(villaFeatures);
  
  // Check universal tokens
  const missingUniversalTokens = universal.filter(t => !(t in villaTokens));
  
  // Check feature-based tokens
  const missingFeatureTokens: Array<{ feature: PropertyFeature; tokens: string[] }> = [];
  for (const { feature, tokens } of featureBased) {
    const missing = tokens.filter(t => !(t in villaTokens));
    if (missing.length > 0) {
      missingFeatureTokens.push({ feature, tokens: missing });
    }
  }
  
  // Get FAQs for this villa and check each
  const villaFaqs = getFaqsForVilla({ scope, propertyId: villaId });
  const faqsWithMissingTokens: Array<{ faqId: string; priority: string; tokens: string[] }> = [];
  
  for (const faq of villaFaqs) {
    const requiredTokens = getUnresolvedTokens(faq.translations.en.a);
    const missing = requiredTokens.filter(t => !(t in villaTokens));
    if (missing.length > 0) {
      faqsWithMissingTokens.push({ 
        faqId: faq.id, 
        priority: faq.priority, 
        tokens: missing 
      });
      if (faq.priority === 'core') {
        warnings.push(`Core FAQ "${faq.id}" missing tokens: ${missing.join(', ')}`);
      }
    }
  }
  
  // Calculate completeness score
  const totalRequired = universal.length + featureBased.reduce((acc, f) => acc + f.tokens.length, 0);
  const totalMissing = missingUniversalTokens.length + missingFeatureTokens.reduce((acc, f) => acc + f.tokens.length, 0);
  const completenessScore = totalRequired > 0 
    ? Math.round(((totalRequired - totalMissing) / totalRequired) * 100)
    : 100;
  
  return {
    villaId,
    completenessScore,
    missingUniversalTokens,
    missingFeatureTokens,
    faqsWithMissingTokens,
    warnings,
  };
}

// ════════════════════════════════════════════════════════════════════════
// BUILD-TIME VALIDATION (strict mode for CI/production)
// ════════════════════════════════════════════════════════════════════════

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Full validation for build pipeline
 * In production: errors cause build failure
 * In dev: warnings are logged but don't fail
 */
export function runFullValidation(options: {
  strictMode?: boolean; // Fail on warnings too (for CI)
  coreFaqsOnly?: boolean; // Only validate core FAQs strictly
} = {}): ValidationResult {
  const { strictMode = false, coreFaqsOnly = false } = options;
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 1. Validate property features
  const featureErrors = validatePropertyFeatures();
  for (const { faqId, invalidFeatures } of featureErrors) {
    errors.push(`FAQ "${faqId}" has invalid property features: ${invalidFeatures.join(', ')}`);
  }
  
  // 2. Check for FAQs with tokens not listed in their tokensUsed field
  const undeclared = getUndeclaredTokenUsage();
  for (const { faqId, undeclaredTokens } of undeclared) {
    const faq = getFaqById(faqId);
    const isCore = faq?.priority === 'core';
    const message = `FAQ "${faqId}" missing tokensUsed declaration for: ${undeclaredTokens.join(', ')}`;
    
    if (isCore || strictMode) {
      if (coreFaqsOnly && !isCore) {
        warnings.push(message);
      } else {
        errors.push(message);
      }
    } else {
      warnings.push(message);
    }
  }
  
  // 3. Check for unknown tokens (not in TOKEN_DEFINITIONS)
  const allUsed = getAllUsedTokens();
  for (const [token] of allUsed) {
    if (!TOKEN_DEFINITIONS[token]) {
      errors.push(`Unknown token "{{${token}}}" used but not defined in TOKEN_DEFINITIONS`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Interpolate tokens in FAQ answer
 * Throws in strict mode if unresolved tokens remain
 */
export function resolveFaqAnswer(params: {
  faqId: string;
  villaId: string;
  answer: string;
  tokens: Record<string, string>;
  strictMode?: boolean;
}): string {
  const { faqId, villaId, answer, tokens, strictMode = true } = params;
  
  let resolved = answer;
  for (const [key, value] of Object.entries(tokens)) {
    resolved = resolved.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  
  // Validate no unresolved tokens remain
  const remaining = getUnresolvedTokens(resolved);
  if (remaining.length > 0) {
    const message = `[FAQ Bank] Unresolved tokens in ${faqId} for ${villaId}: ${remaining.join(', ')}`;
    if (strictMode) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
  
  return resolved;
}

// ════════════════════════════════════════════════════════════════════════
// BUILD-TIME SELF-VALIDATION (runs on import in production builds)
// ════════════════════════════════════════════════════════════════════════

/**
 * Immediately-invoked validation that runs when this module is imported.
 * In production builds (CI/build), errors will cause compilation to fail.
 * In development, warnings are logged but don't halt.
 */
const BUILD_TIME_VALIDATION_ENABLED = true;

if (BUILD_TIME_VALIDATION_ENABLED) {
  try {
    const result = runFullValidation({ strictMode: false, coreFaqsOnly: true });
    
    // Log warnings in all environments
    if (result.warnings.length > 0) {
      console.warn('\n[FAQ Bank] Build-time validation warnings:');
      result.warnings.forEach(w => console.warn(`  ⚠️  ${w}`));
    }
    
    // Errors are always surfaced
    if (result.errors.length > 0) {
      console.error('\n[FAQ Bank] Build-time validation ERRORS:');
      result.errors.forEach(e => console.error(`  ❌ ${e}`));
      
      // In production builds, throw to fail the build
      // Check if we're in a build environment (not dev server)
      const isProduction = process.env.NODE_ENV === 'production';
      const isBuild = process.argv?.some(arg => arg.includes('build')) ?? false;
      
      if (isProduction || isBuild) {
        throw new Error(`[FAQ Bank] ${result.errors.length} validation error(s) - build aborted. Fix errors above.`);
      }
    }
    
    // Success message (only in verbose mode or if errors/warnings present)
    if (result.valid && result.warnings.length === 0) {
      // Silent success - don't clutter logs
    } else if (result.valid) {
      console.log(`\n[FAQ Bank] ✅ Validation passed with ${result.warnings.length} warning(s)`);
    }
  } catch (err) {
    // Re-throw in production, just warn in dev
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      throw err;
    }
    console.error('[FAQ Bank] Self-validation error (non-fatal in dev):', err);
  }
}

/**
 * Quick stats about the FAQ bank for reports/debugging
 */
export function getFaqBankStats(): {
  totalFaqs: number;
  coreFaqs: number;
  standardFaqs: number;
  optionalFaqs: number;
  categoryCounts: Record<string, number>;
  appliesToCounts: Record<string, number>;
  definedTokens: number;
  usedTokensUnique: number;
} {
  const entries = Object.values(masterFaqBank);
  
  const categoryCounts: Record<string, number> = {};
  const appliesToCounts: Record<string, number> = {};
  
  for (const faq of entries) {
    categoryCounts[faq.category] = (categoryCounts[faq.category] || 0) + 1;
    for (const target of faq.appliesTo) {
      appliesToCounts[target] = (appliesToCounts[target] || 0) + 1;
    }
  }
  
  const allUsedTokens = getAllUsedTokens();
  
  return {
    totalFaqs: entries.length,
    coreFaqs: entries.filter(f => f.priority === 'core').length,
    standardFaqs: entries.filter(f => f.priority === 'standard').length,
    optionalFaqs: entries.filter(f => f.priority === 'optional').length,
    categoryCounts,
    appliesToCounts,
    definedTokens: Object.keys(TOKEN_DEFINITIONS).length,
    usedTokensUnique: allUsedTokens.size,
  };
}

/**
 * Generate a comprehensive markdown report of the FAQ bank state
 */
export function generateFaqBankReport(): string {
  const stats = getFaqBankStats();
  const validation = runFullValidation({ strictMode: false, coreFaqsOnly: false });
  const allTokens = getAllUsedTokens();
  const undeclared = getUndeclaredTokenUsage();
  
  const lines: string[] = [
    '# FAQ Bank Status Report',
    `> Generated: ${new Date().toISOString()}`,
    '',
    '## Overview',
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total FAQs | ${stats.totalFaqs} |`,
    `| Core FAQs | ${stats.coreFaqs} |`,
    `| Standard FAQs | ${stats.standardFaqs} |`,
    `| Optional FAQs | ${stats.optionalFaqs} |`,
    `| Defined Tokens | ${stats.definedTokens} |`,
    `| Unique Tokens Used | ${stats.usedTokensUnique} |`,
    '',
    '## Validation Status',
    validation.valid 
      ? '✅ **All validations passing**'
      : `❌ **${validation.errors.length} error(s) detected**`,
    '',
  ];
  
  if (validation.errors.length > 0) {
    lines.push('### Errors (must fix)');
    validation.errors.forEach(e => lines.push(`- ❌ ${e}`));
    lines.push('');
  }
  
  if (validation.warnings.length > 0) {
    lines.push('### Warnings');
    validation.warnings.forEach(w => lines.push(`- ⚠️ ${w}`));
    lines.push('');
  }
  
  lines.push(
    '## FAQs by Category',
    '| Category | Count |',
    '|----------|-------|',
  );
  Object.entries(stats.categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      lines.push(`| ${cat} | ${count} |`);
    });
  
  lines.push(
    '',
    '## FAQs by Applies To',
    '| Target Region | Count |',
    '|---------------|-------|',
  );
  Object.entries(stats.appliesToCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([target, count]) => {
      lines.push(`| ${target} | ${count} |`);
    });
  
  lines.push(
    '',
    '## Token Usage',
    '| Token | Used in FAQs | Defined | Universal |',
    '|-------|-------------|---------|-----------|',
  );
  
  // Sort by usage count
  const sortedTokens = Array.from(allTokens.entries())
    .sort((a, b) => b[1].length - a[1].length);
  
  for (const [token, faqIds] of sortedTokens) {
    const def = TOKEN_DEFINITIONS[token];
    const defined = def ? '✅' : '❌';
    const universal = def?.universal ? '✅' : '-';
    lines.push(`| \`{{${token}}}\` | ${faqIds.length} | ${defined} | ${universal} |`);
  }
  
  if (undeclared.length > 0) {
    lines.push(
      '',
      '## FAQs Missing tokensUsed Declaration',
      '_These FAQs use tokens but don\'t have `tokensUsed` field populated for tracking._',
      '',
    );
    undeclared.forEach(({ faqId, undeclaredTokens }) => {
      lines.push(`- **${faqId}**: ${undeclaredTokens.map(t => `\`{{${t}}}\``).join(', ')}`);
    });
  }
  
  lines.push(
    '',
    '## Property Feature Scoping',
    'FAQs with `appliesToProperties`:',
    '',
  );
  
  const scopedFaqs = Object.values(masterFaqBank).filter(f => f.appliesToProperties && f.appliesToProperties.length > 0);
  if (scopedFaqs.length === 0) {
    lines.push('_No property-scoped FAQs defined._');
  } else {
    lines.push('| FAQ ID | Scoped To |');
    lines.push('|--------|-----------|');
    scopedFaqs.forEach(faq => {
      lines.push(`| ${faq.id} | ${faq.appliesToProperties!.join(', ')} |`);
    });
  }
  
  lines.push(
    '',
    '---',
    '_This report is auto-generated by the FAQ Bank validation system._',
  );
  
  return lines.join('\n');
}