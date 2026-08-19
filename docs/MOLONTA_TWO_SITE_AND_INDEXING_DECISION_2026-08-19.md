# Molonta Two-Site and Indexing Decision

Decision date: 2026-08-19

Last verified: 2026-08-19

## Decision

Molonta Heritage Estate has two complementary public-facing products with separate responsibilities.

### 1. LoveThisPlace storefront

- URL: `https://www.lovethisplace.co/en/storefront/molonta-heritage-estate`
- Role: indexed LoveThisPlace discovery page.
- Identity: LoveThisPlace as the platform, Molonta Heritage Estate as the property, and Go Elite Global in the approved operating role.
- Conversion: inquiries enter the established LoveThisPlace villa inquiry pipeline with property and source attribution.
- Search status: public and eligible for indexing.

### 2. Independent Molonta owner site

- Current share URL while DNS is pending: `https://molonta-heritage-estate.vercel.app/`
- Public-launch URL after DNS and the indexing gate: `https://molonta.lovethisplace.co/`
- Role: full property-branded presentation and future canonical owner website.
- Identity: Molonta Heritage Estate leads the presentation; LoveThisPlace and Go Elite Global appear only where their platform and operating roles need to be clear.
- Conversion: inquiries enter the same established LoveThisPlace villa inquiry pipeline so leads are not fragmented.
- Current search status: `private-preview`, open by URL without a password, `noindex`, blocked from discovery in `robots.txt`, and excluded from public sitemaps.

The independent site is not a second indexed copy while it remains `private-preview`. The LoveThisPlace storefront continues to own platform discovery during this period.

## Clean URL rule

The independent site is presented at the property domain root. Visitors should see clean paths such as:

- `/`
- `/gallery/`
- `/contact/`
- `/rates/`
- `/terms/`
- `/privacy/`

Engine paths such as `/villas/{slug}/{language}/` and URLs containing `preview` are implementation details and must not be shared as the property website.

## Exact indexing launch gate

Do not change the independent site from `private-preview` to `public` until all of the following are true:

1. `molonta.lovethisplace.co` resolves to the reviewed production deployment and every canonical uses that origin.
2. The isolated Vercel project sets `VILLA_SLUG=molonta-heritage-estate`, and the post-build isolation check proves that no other villa route was generated.
3. The signed commercial agreement and the provider/operator roles are final.
4. The cancellation policy, traveler terms, privacy disclosures, rates, fees, taxes, deposits, and minimum stays are final and consistent.
5. One labeled production inquiry proves that the operator email, traveler receipt, stored lead, property identity, and source attribution all survive end to end.
6. Juan explicitly approves the indexing launch after reviewing the live custom-domain site.

After all six gates pass:

1. Change Molonta's registry visibility to `public`.
2. Rebuild and deploy the reviewed commit.
3. Verify `index,follow`, public `robots.txt`, canonical URLs, and sitemap inclusion on the actual custom domain.
4. Submit the canonical root and gallery URLs through the appropriate search console.
5. Continue monitoring both LoveThisPlace storefront attribution and independent-site inquiries without merging their identities.

## Current status

The independent owner site is deployed from reviewed commit `5225c4d7dd49c7ed1d96660d67d12f0688cf43dc` to its dedicated Vercel project.

Verified at `https://molonta-heritage-estate.vercel.app/`:

- root, gallery, contact, rates, terms, and privacy resolve;
- unrelated Casa Del Toro, Villa Kassandra, and Villa Orama routes return `404`;
- the dedicated build uses `VILLA_SLUG=molonta-heritage-estate`;
- private-preview metadata and Open Graph media resolve;
- `noindex`, restrictive robots behavior, and exclusion from the public sitemap are active;
- the fabricated Google-review fallback is absent; and
- one labeled production inquiry reached the established workflow with the intended property and attribution.

The custom hostname `molonta.lovethisplace.co` is assigned in Vercel but did not resolve publicly at the last verification. DNS must use the exact record shown by Vercel and be verified from the public internet before that URL is shared or made canonical.

The indexing gate has not passed. The site must remain `noindex`. The LoveThisPlace storefront remains the indexed discovery surface. Prior approval of the presentation does not by itself approve indexing, legal terms, payment handling, or the custom-domain launch.
