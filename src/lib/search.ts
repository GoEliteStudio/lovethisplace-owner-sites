export type SearchItem = {
  type: 'faq' | 'amenity';
  title: string;
  content: string;
  searchText: string;
};

const toLower = (value: unknown): string => (typeof value === 'string' ? value.toLowerCase() : String(value || '').toLowerCase());
const toText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  return value ? String(value) : '';
};

type BankFaq = { q: string; a: string; category?: string };

export function buildSearchDataset(villa: any, bankFaqs?: BankFaq[]): SearchItem[] {
  if (!villa) return [];

  // Legacy FAQs from villa.content.faq
  const legacyFaqItems: SearchItem[] = Array.isArray(villa?.content?.faq)
    ? villa.content.faq.map((entry: any) => ({
        type: 'faq',
        title: toText(entry?.q),
        content: toText(entry?.a),
        searchText: toLower(`${toText(entry?.q)} ${toText(entry?.a)}`),
      }))
    : [];

  // Bank FAQs (new system)
  const bankFaqItems: SearchItem[] = Array.isArray(bankFaqs)
    ? bankFaqs.map((entry) => ({
        type: 'faq' as const,
        title: toText(entry.q),
        content: toText(entry.a),
        searchText: toLower(`${toText(entry.q)} ${toText(entry.a)}`),
      }))
    : [];

  const amenityItems: SearchItem[] = Array.isArray(villa?.amenities)
    ? villa.amenities.map((amenity: unknown) => {
        const label = toText(amenity);
        return {
          type: 'amenity',
          title: label,
          content: 'Available feature',
          searchText: toLower(amenity),
        } satisfies SearchItem;
      })
    : [];

  // Combine all - bank FAQs take precedence if both exist
  const faqItems = bankFaqItems.length > 0 ? bankFaqItems : legacyFaqItems;
  
  return [...faqItems, ...amenityItems];
}
