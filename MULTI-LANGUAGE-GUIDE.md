# Multi-Language Owner-Site Guide

Last reviewed: 2026-08-19

Language support is a property-level product decision, not a global switch.

## 1. Source of truth

The language list belongs to the property's entry in `src/config/i18n.ts`:

```ts
{
  slug: 'example-property',
  langs: ['en', 'fr'],
  defaultLang: 'en'
}
```

Language display metadata belongs in `LANG_META` in the same file:

```ts
fr: { name: 'Français', locale: 'fr-FR', dir: 'ltr' }
```

Do not edit a route-local `VILLA_LANGUAGES` constant. The exported map is generated from the registry for backward compatibility.

## 2. Content files

Each supported property-language pair needs `src/content/villas/{slug}.{lang}.json`.

The translated file must retain the expected schema and identity. Translate guest-facing copy, labels, policies, FAQs, and calls to action. Do not translate slugs, identifiers, currency codes, image paths, analytics keys, or attribution values unless explicitly required.

## 3. Translation standard

A language is not supported until a human has reviewed it in context. Verify names, capacity, dimensions, rates, taxes, deposits, minimum stays, legal meaning, natural place names, layout fit, inquiry states, and locale-appropriate dates, numbers, and currency.

Never invent amenities, access, awards, reviews, availability, or guarantees. Machine translation may produce a draft, but it is not publication approval.

## 4. Adding a language

1. Confirm the language is commercially useful and name its human reviewer.
2. Add accurate `LANG_META` data if needed.
3. Copy the approved source JSON to `{slug}.{lang}.json`.
4. Translate guest-facing fields without changing facts or structure.
5. Add the code to the property's `langs` array.
6. Change `defaultLang` only when the canonical audience requires it.
7. Run validation and an isolated build.
8. Inspect main and auxiliary routes in the new language.
9. Obtain human approval.
10. Deploy through the property-isolated release process.

## 5. Routes

Internal routes follow `/villas/{slug}/{lang}/`, with equivalent gallery, contact, rates, terms, and privacy routes.

For a root-canonical site, the default language may appear at clean hostname-root routes. Verify the specific property behavior before launch; do not assume every translated route is hidden behind the same clean path.

## 6. Canonical and alternates

Emit a language alternate only when the equivalent page exists and is approved. Do not advertise a fallback, untranslated page, or 404.

For public properties, verify self-consistent canonicals, page-equivalent alternates, correct locale metadata, a useful language switcher, and sitemap entries limited to real public routes. Private previews remain `noindex` regardless of language count.

## 7. Inquiry and email review

For each language test labels, validation, consent, success state, property identity, dates, guests, locale, operator notification, traveler confirmation, reply-to behavior, and attribution.

If operations cannot serve that language, establish the response workflow before publishing it.

## 8. Validation

```powershell
npm run validate
npm run check
$env:VILLA_SLUG='{slug}'
npm run build
```

The build must use the exact slug configured in Vercel and contain no unrelated property output.

Inspect desktop, laptop, narrow-mobile, and short-height/mobile-landscape layouts. Translated words frequently expose navigation, button, and heading failures that English does not.

## 9. Deployment rule

Every dedicated property project still needs `VILLA_SLUG={exact-registry-slug}`. Deploy the reviewed commit to the correct project and verify the real hostname. Localhost and build logs are not production proof.

## 10. Definition of done

A language is complete only when registry and content agree, a human approves it, facts remain consistent, all routes render, inquiry/email flows work, discovery metadata matches publication state, the isolated build contains one property, and the deployed hostname is verified.

Language expansion is not a ranking guarantee. Its value comes from serving a real audience with accurate, useful, accessible content.
