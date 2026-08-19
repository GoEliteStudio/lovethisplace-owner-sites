# Owner-Site and Storefront Onboarding Runbook

This is the canonical operating procedure for every new villa or yacht. It exists to make the next property faster without sacrificing authorization, identity, design quality, privacy, search integrity, or deployment isolation.

## 0. Preflight and ownership

Before touching code:

1. Read `PORTFOLIO_STATUS.md`, `OWNER_SITE_PRODUCT_V2.md`, and this runbook.
2. Confirm the repository and product boundary:
   - LoveThisPlace storefront work belongs in the LoveThisPlace storefront repository.
   - Independent property-site work belongs in this repository.
   - Elite Cartagena work belongs in the Elite repository and requires Juan's explicit approval.
3. Start from a clean branch or isolated worktree.
4. Record the task type and risk. Deployment, email, payments, analytics, indexing, privacy, and legal identity are high risk.
5. Do not run two modifying agents or processes against the same repository.

One property, one branch, one commercial decision record, and one reviewed PR.

## 1. Qualify the commercial relationship

No code should imply a partnership that does not exist. Record:

- property and owner/operator identity;
- authorization to use images, copy, rates, and branding;
- commercial model and commission;
- whether a setup or annual fee applies;
- who owns the traveler relationship;
- who confirms availability and price;
- who contracts with the traveler;
- who collects funds;
- who delivers the stay and handles issues;
- cancellation, refund, chargeback, tax, and deposit responsibilities;
- term, attribution window, and termination rules.

Add the property to `PORTFOLIO_STATUS.md` only after Juan approves its status. New properties begin as `private-preview`.

## 2. Decide the product before building

Choose one or both:

### LoveThisPlace storefront

Use when the property joins LoveThisPlace discovery and inquiry routing. The storefront carries LoveThisPlace platform identity and the approved Go Elite Global operating role.

### Independent owner site

Use when the property needs a full property-branded website on a dedicated domain. It may complement or eventually replace the owner's existing website.

### Both products

Record the distinct jobs in a dated decision file:

- which page is indexed first;
- which URL is canonical;
- how inquiries are attributed;
- whether the independent site is temporarily `noindex`;
- what event changes that state.

Never let two pages accidentally compete for the same canonical identity.

## 3. Secure source materials immediately

Owner transfers can expire. Download them the day they arrive.

Store originals only in an ignored private source directory. Record:

- archive filename and size;
- receipt date and expiry date;
- SHA-256 for the archive and important attachments;
- file count and media types;
- image dimensions;
- authorization received;
- restrictions or unanswered questions.

Security rules:

- reject unsafe archive paths before extraction;
- never commit the archive or originals;
- never expose private filenames, EXIF, credentials, rates, or owner correspondence;
- only approved, resized, metadata-stripped derivatives enter `public/`;
- do not use OneDrive unless Juan explicitly authorizes the exact folder.

## 4. Build the factual source matrix

Create one private factual record before writing copy. Reconcile:

- canonical property name, former names, and reseller aliases;
- location, coordinates, access, airport and destination times;
- capacity, bedrooms, beds, bathrooms, en-suites, and accessibility;
- land, coastline, beach/sea access, pool, and amenity measurements;
- included services and optional services;
- seasonal rates, currency, taxes, fees, deposits, minimum stays, and validity dates;
- cancellation and refund policy;
- owner/host names and verified story;
- press coverage, awards, reviews, and their exact attribution;
- inquiry, payment, and guest-service roles.

Source rules:

- owner-supplied written facts are primary;
- official public pages may fill practical gaps;
- reseller pages may corroborate but do not become authority on our public page;
- never copy reseller prose;
- never average conflicting facts;
- label unresolved items internally and omit them publicly until verified;
- never fabricate reviews or imply an award that was only editorial coverage.

## 5. Create the implementation record

For an independent owner site, add one registry entry in `src/config/i18n.ts` with:

- unique stable `slug`;
- languages and default language;
- `private-preview` visibility;
- dedicated domain and any approved aliases;
- canonical origin and temporary share origin;
- `rootCanonical` when clean root paths are required;
- region and currency;
- explicit theme;
- owner/operator notification address;
- auxiliary pages;
- asset slug only when a documented migration requires it.

Do not silently reuse another property's analytics, credentials, owner email, schema identity, rates, or commercial model.

For a LoveThisPlace storefront, create its record in the storefront repository and use the established storefront engine. Do not place storefront code in this repository.

## 6. Design and conversion standard

Select the visual system intentionally:

- `classic`: denser commercial presentation for fast comparison and direct action.
- `heritage-signature`: editorial owner-led presentation for properties where history, place, hosts, and photography are central.

Every finished property surface must still answer:

- What is it?
- Where is it?
- Who is it for?
- Why is it distinctive?
- What does it include?
- What does it cost or how is price confirmed?
- Who handles the inquiry?
- What happens next?

Quality requirements:

- no dead whitespace caused by mismatched columns or stacked section padding;
- consistent image frames and stable aspect ratios;
- no stretched, upscaled, or visibly degraded media;
- clear mobile hierarchy at 390px;
- keyboard-accessible menus, accordions, and lightbox;
- reduced-motion support;
- readable type and contrast;
- one clear primary CTA per decision stage;
- no decorative section that provides no traveler value;
- no repeated specification paragraph where a fact strip already does the job.

## 7. Media production standard

Maintain two layers when the owner provides a large approved archive:

1. Curated sales-page sequence: normally 12 to 20 exceptional images.
2. Complete gallery: optional, chaptered, searchable by section, and separate from the main conversion flow.

For each public image:

- generate responsive WebP derivatives appropriate to its display size;
- keep the source-faithful master within the established image budget;
- declare width and height to prevent layout shift;
- write unique, useful alt text based on what the image actually shows;
- load only the true LCP/first image eagerly;
- lazy-load off-screen media;
- preserve composition in the lightbox;
- remove exact and near duplicates;
- exclude low-quality images even if that reduces the total count;
- verify every derivative traces to an authorized source.

Do not upscale a small source merely to satisfy a nominal breakpoint.

## 8. Content, search, and structured-data standard

Write for travelers first and machines second. Use the language real guests use naturally: property type, destination, nearby landmark, capacity, defining amenity, and direct-booking intent.

Every page needs:

- one consistent property entity;
- useful title and meta description;
- intentional canonical URL;
- semantic headings;
- crawlable practical answers and FAQs;
- consistent visible facts and structured data;
- original descriptions grounded in verified facts;
- descriptive image alternatives;
- relevant internal links only;
- no artificial keyword repetition.

Structured data must reflect visible, verified content. Reviews are emitted only from genuine testimonials with a quote and attribution. Empty or invented review arrays are prohibited.

No ranking, rich result, or AI citation is guaranteed. Do not sell schema, FAQs, `llms.txt`, or any other tactic as a guarantee.

## 9. Inquiry and commercial routing

Before deployment, document and configure:

- property identity sent with the lead;
- operator notification recipient;
- traveler receipt sender and reply-to;
- source and campaign attribution;
- rate limiting and origin validation;
- privacy consent;
- minimum stay and date validation;
- whether price is fixed, seasonal, or request-only;
- human review before any payment or confirmation.

Never assume a form works because it renders. The release requires one labeled end-to-end test after deployment. Confirm:

- form success state;
- stored lead ID;
- property slug and source attribution;
- operator email;
- traveler receipt;
- no duplicate or unintended email;
- no secrets or private data in browser events.

Do not repeat a production test after it passes unless the route or environment changes.

## 10. Local verification

Install from the lockfile and run the full gates:

```powershell
npm ci
npm run validate
npm run check
```

Run the production-style isolated build:

```powershell
$env:VILLA_SLUG='property-slug'
$env:VERCEL='1'
npm run build
```

The build must end with:

```text
[build-isolation] PASS: only property-slug was generated.
```

Review at minimum:

- desktop 1440px and a common laptop viewport;
- mobile 390px and landscape mobile;
- navigation anchors;
- sticky sections and their release points;
- all gallery chapters and lightbox controls;
- no broken `srcset` candidates;
- no horizontal overflow;
- forms, errors, consent, and thank-you state;
- canonical, Open Graph, robots, sitemap, and structured data;
- no raw sources or internal notes in output;
- no other property's routes in the generated deployment.

## 11. Owner review and authorization

Send the clean share URL, not an engine path. The owner reviews:

- property identity and story;
- facts, images, and captions;
- rates and terms;
- inclusions and add-ons;
- inquiry and booking roles;
- legal and privacy identity;
- publication domain.

Classify corrections as factual, commercial, legal, or aesthetic. Factual and commercial changes require written confirmation. Do not let owner review silently change the agreed business model.

## 12. Dedicated Vercel project

Each independent property site receives one dedicated Vercel project. Configure:

- repository and reviewed branch/commit;
- `VILLA_SLUG=<property-slug>` in every environment that builds the owner site;
- approved runtime secrets and public configuration;
- dedicated production domain;
- preview/deployment protection consistent with the sharing decision;
- Node version compatible with the repository;
- no secrets copied from another property without an explicit shared-service decision.

Run the remote build and read its output. It must prove only the intended slug and its `assetSlug || slug` media directory were retained.

Shared Vercel builds without `VILLA_SLUG` generate active public villas only. If none exist, they produce a neutral shell with no property routes or property media. They are not a substitute for dedicated owner-site projects.

## 13. DNS and domain activation

Use the exact DNS record requested by the Vercel Domains screen for that domain. Do not rely on a generic remembered value when Vercel provides property-specific instructions.

Verify:

- DNS resolves publicly;
- Vercel shows the domain as valid;
- HTTPS is active;
- both intended host variants behave consistently;
- canonical and Open Graph URLs use a working origin;
- obsolete share aliases point to the current production deployment.

Until DNS resolves, use the approved Vercel share alias and keep metadata on a working origin.

## 14. Publication and indexing gate

`private-preview` remains `noindex` and excluded from the sitemap. Change to `public` only when all are true:

- authorization and signed commercial agreement are complete;
- identity and operating roles are final;
- rates, taxes, fees, deposits, minimum stays, and cancellation terms are final;
- privacy and traveler terms are final;
- custom domain and canonical resolve correctly;
- inquiry flow passed end to end;
- analytics and consent behavior are approved;
- owner approval is recorded when required;
- Juan explicitly approves indexing.

After changing visibility, rebuild and verify the actual custom domain for `index,follow`, canonical, robots, sitemap inclusion, structured data, and form routing. Submit only the canonical URL to search tools.

## 15. Production verification

Never report production success from localhost or a Vercel dashboard alone. Fetch the actual public artifact.

Verify and record:

- deployment ID and commit;
- production alias points at that deployment;
- expected pages return 200;
- forbidden cross-property routes return 404;
- metadata uses working URLs;
- publication state matches robots and sitemap;
- images return successfully;
- no fabricated review or stale property identity appears;
- inquiry attribution remains correct if the route changed.

If the custom domain and share alias point to different deployments, fix the aliases before sharing.

## 16. Source control and handoff

Before committing:

- inspect `git status` and `git diff --check`;
- exclude `.astro`, `.vercel`, `.env*`, private archives, raw assets, and audit output;
- keep the commit property-specific;
- update `PORTFOLIO_STATUS.md` and any dated decision record;
- update this runbook only for reusable lessons.

Use a reviewed PR. Before merging, audit every Vercel project affected by shared engine changes. A correct code change can still create an outage if a project lacks its required environment configuration.

The handoff must state:

- what changed;
- what was verified locally;
- what was verified live;
- deployment and PR links;
- current indexing state;
- remaining external actions;
- any deliberately unmerged work and why.

## 17. Rollback

If production verification fails:

1. stop sharing or promoting the affected URL;
2. identify the last verified deployment;
3. promote or redeploy that exact version;
4. verify the public URL again;
5. fix forward on a clean branch;
6. document the failure and add a behavioral check that would have caught it.

Do not use destructive Git resets on a shared or dirty worktree.

## 18. Rejected, expired, or terminated properties

When an owner declines or a relationship ends:

- update `PORTFOLIO_STATUS.md` immediately;
- remove the property from active registry and discovery surfaces;
- disable inquiry/payment routing;
- remove or redirect domains after checking active bookings;
- stop using its materials in presentations;
- retain or delete private sources according to authorization and need;
- verify former URLs no longer expose an active commercial page.
- verify representative former property image URLs also return 404; HTML `noindex` does not protect standalone media files.

Do not maintain speculative owner sites indefinitely. The reusable value belongs in the engine and QA system, not in unauthorized public pages.

## Definition of done

A property is done only when:

- commercial and identity roles are documented;
- approved source materials are traceable and private;
- content and media meet the quality standard;
- local validation and type checks pass;
- isolated build proves one property route and one allowed property-media directory only;
- dedicated deployment is Ready;
- live URLs, metadata, discovery state, and forbidden routes are verified;
- inquiry routing is proven when applicable;
- portfolio and decision documentation are current;
- the source commit is recoverable and professionally handed off.
