# Molonta Two-Site and Indexing Decision

Decision date: 2026-08-19

## Decision

Molonta Heritage Estate has two complementary public-facing products with separate responsibilities.

### 1. LoveThisPlace storefront

- URL: `https://www.lovethisplace.co/en/storefront/molonta-heritage-estate`
- Role: indexed LoveThisPlace discovery page.
- Identity: LoveThisPlace as the platform, Molonta Heritage Estate as the property, and Go Elite Global in the approved operating role.
- Conversion: inquiries enter the established LoveThisPlace villa inquiry pipeline with property and source attribution.
- Search status: public and eligible for indexing.

### 2. Independent Molonta owner site

- Intended URL: `https://molonta.lovethisplace.co/`
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
2. The signed commercial agreement and the provider/operator roles are final.
3. The cancellation policy, traveler terms, privacy disclosures, rates, fees, taxes, deposits, and minimum stays are final and consistent.
4. One labeled production inquiry proves that the operator email, traveler receipt, stored lead, property identity, and source attribution all survive end to end.
5. Juan explicitly approves the indexing launch after reviewing the live custom-domain site.

After all five gates pass:

1. Change Molonta's registry visibility to `public`.
2. Rebuild and deploy the reviewed commit.
3. Verify `index,follow`, public `robots.txt`, canonical URLs, and sitemap inclusion on the actual custom domain.
4. Submit the canonical root and gallery URLs through the appropriate search console.
5. Continue monitoring both LoveThisPlace storefront attribution and independent-site inquiries without merging their identities.

## Current status

The indexing gate has not passed. The independent site must remain `noindex`. The LoveThisPlace storefront remains the live indexed discovery surface.