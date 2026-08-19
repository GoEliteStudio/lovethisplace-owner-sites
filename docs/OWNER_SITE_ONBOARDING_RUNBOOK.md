# Owner-Site Onboarding Runbook

Use this sequence for every independent villa or yacht site.

## 1. Commercial and identity intake

Record the approved commercial model, the contracting parties, who markets the property, who confirms availability, who receives traveler funds, and who handles the guest. Do not infer these roles from a listing.

Create the property as `private-preview`. Public indexing is never the default.

## 2. Secure owner materials immediately

Download expiring owner transfers the day they arrive. Keep originals in the private source area, record the archive hash and authorization boundary, and never copy the source archive into public assets or Git.

Only curated, resized, metadata-stripped derivatives enter `public/images/villas/{slug}/`.

## 3. Build the factual matrix

Before writing copy, reconcile:

- official property name and any former name;
- exact location and travel times;
- capacity, bedrooms, beds, bathrooms, and en-suites;
- land, waterfront, pool, and amenity measurements;
- inclusions and optional services;
- rates, currencies, date bands, minimum stays, taxes, fees, deposit, and cancellation policy;
- owner/host names and the verified family/property story;
- press mentions and awards, described precisely.

Public sources may fill practical gaps. Never copy reseller prose and never create a new fact by averaging conflicting listings.

## 4. Choose the product and theme

Use the LoveThisPlace storefront when the property is joining the platform's discovery experience.

Use the independent owner site when the deliverable is a canonical property website on an owner-controlled or dedicated domain.

When both products exist, record their separate roles explicitly. The LoveThisPlace storefront remains the indexed platform-discovery page. The independent site remains open by URL but `noindex` until its legal, commercial, inquiry, domain, and approval gates pass. Do not share an engine path or a URL containing `preview`; assign a clean property domain and root presentation.

Select `classic` for a dense agency-led flow or `heritage-signature` for an editorial owner-led property. Both must retain conversion essentials.

## 5. Create the private implementation

Add the registry entry with:

- explicit visibility;
- explicit canonical origin;
- clean root-domain presentation when the site is intended to become the property's standalone website;
- explicit theme;
- supported languages;
- currency and routing;
- no public indexing.

Add structured content, optimized image derivatives, descriptive alt text, rates, details, FAQs, and an inquiry path. Do not invent testimonials to fill an empty section.

### Large approved photo archives

Preserve both media layers: curate the main sales page and build the complete gallery separately. Confirm chapter counts, duplicate removal, descriptive alt text, responsive WebP variants, lazy loading, stable lightbox geometry, and that every published derivative can be traced to the approved source archive.

The complete gallery is optional; it should not make the main page longer or less decisive. When used, register it as an auxiliary page so a future public property can include it in discovery while a private preview remains excluded.

## 6. Verify locally

Run:

```powershell
npm run validate
npm run build
npm run dev
```

Review at minimum:

- desktop 1440px;
- mobile 390px;
- keyboard navigation;
- reduced motion;
- no horizontal overflow;
- image loading and lightbox behavior;
- form labels and error states;
- metadata, canonical, noindex, and structured data;
- sitemap and robots behavior;
- no private source files, secrets, or personal operating data in the build.

## 7. Owner review

Send a private preview only after internal QA. Ask the owner to approve:

- name, story, photos, captions, and amenities;
- rates, inclusions, fees, deposit, and cancellation terms;
- inquiry and booking flow;
- operator/provider identity;
- publication domain.

Track corrections as facts, commercial decisions, or design preferences. Do not silently make commercial changes.

## 8. Public-release preparation

Before changing visibility to `public`:

- complete the signed agreement;
- obtain legal entity and signatory details;
- finish privacy, terms, and traveler disclosures;
- configure the production domain and canonical origin;
- configure approved email, Firebase, analytics, and payment environments;
- add durable abuse protection and origin validation;
- perform one labeled end-to-end inquiry test;
- receive explicit owner and Juan approval.

## 9. Release and verify the live artifact

Deploy the reviewed commit. Then fetch the actual public URL, not localhost or a preview alias, and verify:

- HTTP 200;
- correct custom domain and canonical;
- index/follow only on the approved public property;
- sitemap contains the property and excludes owner-facing/transactional pages;
- robots rules match the publication state;
- responsive images resolve;
- inquiry reaches the approved operator and client receipt works;
- attribution survives through the lead record.

Submit the canonical public URL to the relevant search console only after these checks pass.

## 10. Preserve the template

After release, update this runbook with any new reusable lesson. Keep property-specific source records private. Reuse the engine and QA, not another property's copy, identity, analytics, credentials, or commercial terms.
