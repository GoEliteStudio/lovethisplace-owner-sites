/**
 * FAQ Search Component — UX Specification
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This file documents the premium searchable FAQ UX for implementation
 * in the Astro component layer (FaqLibrary.astro).
 * 
 * TARGET: Client-side search for 100+ FAQs with premium feel
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * FaqLibrary Component Props
 */
export interface FaqLibraryProps {
  /** Resolved FAQ set from resolver */
  faqSet: import('./resolver').ResolvedFaqSet;
  
  /** Current language */
  lang: string;
  
  /** Villa slug for analytics */
  villaSlug: string;
  
  /** UI strings (i18n) */
  strings: {
    searchPlaceholder: string;    // "Search 120+ FAQs..."
    coreTitle: string;            // "Essential Information"
    planYourTripTitle: string;    // "Plan Your Trip"
    deepLibraryTitle: string;     // "Cartagena Guide"
    noResults: string;            // "No FAQs match your search"
    showingResults: string;       // "Showing {count} results"
    allCategories: string;        // "All"
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3-BLOCK LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Layout Structure:
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  🔍 Search 120+ FAQs...                                     │
 * ├─────────────────────────────────────────────────────────────┤
 * │  [All] [Booking] [Logistics] [Safety] [Food] [+5 more]     │  ← Category chips
 * ├─────────────────────────────────────────────────────────────┤
 * │                                                             │
 * │  ══ ESSENTIAL INFORMATION (10-15) ══                        │  ← Core block
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │ ▸ What is the minimum stay?                          │   │
 * │  │ ▸ What deposit is required?                          │   │
 * │  │ ▸ Is the area safe?                                  │   │
 * │  │ ...                                                  │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * │                                                             │
 * │  ══ PLAN YOUR TRIP (30-80) ══                              │  ← Plan block
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │ ▸ Can you arrange airport pickup?                    │   │
 * │  │ ▸ What dietary requirements can you accommodate?     │   │
 * │  │ ▸ Is the pool safe for children?                     │   │
 * │  │ ...                                                  │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * │                                                             │
 * │  ══ CARTAGENA GUIDE (searchable) ══                        │  ← Deep library
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │ 🔍 Search this section...                            │   │
 * │  │ ▸ Best rooftop bars in Getsemani?                    │   │
 * │  │ ▸ How to get to Playa Blanca?                        │   │
 * │  │ ...                                                  │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * │                                                             │
 * └─────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Search Features:
 * 
 * 1. INSTANT SEARCH (as-you-type)
 *    - Debounce: 150ms
 *    - Min chars: 2
 *    - Searches: question, answer, aliases, POI, neighborhoods
 * 
 * 2. TOP 5 PREVIEW
 *    - Shows top 5 matches as user types
 *    - Full results on Enter or blur
 * 
 * 3. HIGHLIGHT MATCHES
 *    - Wrap matched terms in <mark> tags
 *    - CSS: background: yellow; (or brand color)
 * 
 * 4. CATEGORY CHIPS
 *    - Click to filter by category
 *    - Multiple selection allowed
 *    - "All" clears filter
 *    - Show count badge: [Booking (12)]
 * 
 * 5. KEYBOARD NAVIGATION
 *    - Arrow keys navigate results
 *    - Enter expands selected FAQ
 *    - Escape clears search
 */

export interface SearchState {
  query: string;
  selectedCategories: string[];
  activeIndex: number;  // For keyboard nav
  isSearching: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT-SIDE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Example Alpine.js implementation:
 * 
 * ```html
 * <div x-data="faqSearch()" class="faq-library">
 *   <!-- Search input -->
 *   <input 
 *     type="search"
 *     x-model.debounce.150ms="query"
 *     :placeholder="strings.searchPlaceholder"
 *     @keydown.escape="clearSearch"
 *   />
 *   
 *   <!-- Category chips -->
 *   <div class="chips">
 *     <button 
 *       @click="clearFilters"
 *       :class="{ active: !hasFilters }"
 *     >All</button>
 *     <template x-for="cat in categories">
 *       <button 
 *         @click="toggleCategory(cat)"
 *         :class="{ active: isSelected(cat) }"
 *       >
 *         <span x-text="cat"></span>
 *         <span class="badge" x-text="getCategoryCount(cat)"></span>
 *       </button>
 *     </template>
 *   </div>
 *   
 *   <!-- Results -->
 *   <div x-show="query.length >= 2" class="search-preview">
 *     <template x-for="faq in topResults">
 *       <div @click="expandFaq(faq.id)">
 *         <span x-html="highlightMatch(faq.q)"></span>
 *       </div>
 *     </template>
 *   </div>
 *   
 *   <!-- 3 Blocks -->
 *   <section x-show="!isSearching">
 *     <h2>Essential Information</h2>
 *     <template x-for="faq in filteredCore">
 *       <details>
 *         <summary x-text="faq.q"></summary>
 *         <p x-text="faq.a"></p>
 *       </details>
 *     </template>
 *   </section>
 *   
 *   <!-- ... similar for Plan Your Trip and Deep Library -->
 * </div>
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════════
// HIGHLIGHT UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Highlight matched terms in text
 */
export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Track these events for optimization:
 * 
 * - faq_search: { query, resultCount, villaSlug }
 * - faq_expand: { faqId, category, villaSlug }
 * - faq_category_filter: { category, villaSlug }
 * - faq_no_results: { query, villaSlug }
 */

export interface FaqAnalyticsEvent {
  event: 'faq_search' | 'faq_expand' | 'faq_category_filter' | 'faq_no_results';
  data: {
    query?: string;
    faqId?: string;
    category?: string;
    resultCount?: number;
    villaSlug: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A11y Requirements:
 * 
 * 1. ARIA
 *    - role="search" on search container
 *    - aria-expanded on FAQ accordions
 *    - aria-controls linking summary to content
 *    - aria-live="polite" on results count
 * 
 * 2. Keyboard
 *    - Tab: navigate between FAQs
 *    - Enter/Space: expand/collapse
 *    - Arrow keys: navigate in search results
 * 
 * 3. Screen readers
 *    - Announce result count changes
 *    - Announce when FAQ expands
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CSS CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Recommended CSS structure:
 * 
 * .faq-library { }
 * .faq-library__search { }
 * .faq-library__chips { }
 * .faq-library__chip { }
 * .faq-library__chip--active { }
 * .faq-library__chip-badge { }
 * .faq-library__preview { }
 * .faq-library__preview-item { }
 * .faq-library__section { }
 * .faq-library__section-title { }
 * .faq-library__item { }
 * .faq-library__question { }
 * .faq-library__answer { }
 * .faq-library__highlight { background: var(--color-highlight); }
 * .faq-library__no-results { }
 */
