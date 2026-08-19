#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const errors = [];
const pass = (message) => console.log(`[owner-sites] PASS: ${message}`);
const fail = (message) => errors.push(message);
const assert = (condition, message) => condition ? pass(message) : fail(message);

const registry = read('src/config/i18n.ts');
const route = read('src/pages/villas/[slug]/[lang].astro');
const schema = read('src/lib/schema.ts');
const sitemap = read('src/pages/sitemap.xml.ts');
const robots = read('src/pages/robots.txt.ts');
const layout = read('src/layouts/BaseLayout.astro');
const inquiry = read('src/pages/api/inquire.ts');
const inquiryForm = read('src/components/InquiryForm.astro');
const ownerAbout = read('src/pages/villas/[slug]/[lang]/about.astro');
const heritagePage = read('src/components/HeritageVillaPage.astro');
const molonta = JSON.parse(read('src/content/villas/molonta-heritage-estate.en.json'));
const heritageGalleryPage = read('src/components/HeritageGalleryPage.astro');
const completeGalleryRoute = read('src/pages/villas/[slug]/[lang]/gallery.astro');
const rootRoute = read('src/pages/index.astro');
const cleanAuxRoute = read('src/pages/[page].astro');
const completeGallery = JSON.parse(read('src/content/galleries/molonta-heritage-estate.en.json'));

assert(registry.includes("slug: 'molonta-heritage-estate'"), 'Molonta is registered');
assert(registry.includes("domain: 'molonta.lovethisplace.co'"), 'Molonta has the approved clean custom domain');
assert(registry.includes("canonicalOrigin: 'https://molonta.lovethisplace.co'"), 'Molonta canonicals use the clean custom domain');
assert(registry.includes('rootCanonical: true'), 'Molonta is configured for root-domain presentation');
assert(rootRoute.includes('Astro.rewrite(internalTarget)'), 'root-canonical properties render without exposing the engine route');
assert(rootRoute.includes("split(':')[0].toLowerCase()"), 'root routing normalizes production host headers');
assert(cleanAuxRoute.includes('villa.auxPages.includes(page)') && cleanAuxRoute.includes('Astro.rewrite(internalTarget)'), 'clean auxiliary routes are restricted to registered property pages');
assert(registry.includes("visibility: 'private-preview'"), 'the registry supports a private-preview state');
assert(registry.includes("theme: 'heritage-signature'"), 'the heritage-signature theme is explicit');
assert(registry.includes('getIndexableVillas'), 'public discovery is generated from an indexable allowlist');
assert(route.includes("villaConfig.theme === 'heritage-signature'"), 'the reusable renderer is selected by configuration');
assert(route.includes("description={villa.seo?.description || villa.summary}"), 'property SEO descriptions feed page metadata');
assert(layout.includes('registryNoindex'), 'auxiliary pages inherit registry-driven noindex protection');
assert(robots.includes('Disallow: /'), 'unknown and preview hosts fail closed in robots.txt');
assert(sitemap.includes("['thank-you', 'about']"), 'owner-facing and transactional pages are excluded from sitemaps');
assert(ownerAbout.includes('noindex={true}'), 'the owner-facing sales page is explicitly noindex');
assert(sitemap.includes('getIndexableVillas'), 'private previews cannot enter sitemap discovery');
assert(sitemap.includes('villas.length > 0 ? generateUrlEntry'), 'private hosts publish an empty sitemap rather than a root discovery URL');
assert(inquiry.includes('getVillaBySlug(slug)'), 'inquiries reject unregistered properties');
assert(
  inquiry.includes('ownerActionWorkflowReady') &&
    inquiry.includes('import.meta.env.OWNER_ACTION_SECRET') &&
    inquiry.includes('import.meta.env.STRIPE_SECRET_KEY') &&
    inquiry.includes('if (inquiryId && ownerActionWorkflowReady)'),
  'owner action links require signing and payment configuration'
);
assert(!inquiry.includes("request.headers.get('x-forwarded-for')"), 'raw IP addresses are not added to inquiry payloads');
assert(!inquiry.includes("request.headers.get('user-agent')"), 'user-agent strings are not added to inquiry payloads');
assert(
  inquiry.includes("'molonta-heritage-estate'") &&
    inquiry.includes("https://www.lovethisplace.co/api/storefront/inquiries") &&
    inquiry.includes("forwarded.set('kind', 'villa')") &&
    inquiry.includes("forwarded.set('utmSource', 'molonta_owner_showcase')"),
  'Molonta inquiries reuse the established LoveThisPlace villa pipeline with explicit attribution'
);
assert(
  inquiryForm.includes('name="phone"') &&
    inquiryForm.includes('name="consent"') &&
    inquiryForm.includes('Privacy policy'),
  'the owner-site inquiry form collects a response number and explicit privacy consent'
);
assert(inquiryForm.includes('privacyHref') && heritagePage.includes('privacyHref={privacyHref}'), 'owner-site privacy links use the clean public route');
assert(route.includes('Traveler service and booking coordination by Go Elite Global.'), 'root-canonical owner sites explain the LoveThisPlace and Go Elite Global roles');

assert(molonta.slug === 'molonta-heritage-estate', 'Molonta content matches its private slug');
assert(Boolean(molonta.seo?.title && molonta.seo?.description), 'Molonta has property-specific SEO metadata');
assert(Array.isArray(molonta.content?.faq) && molonta.content.faq.length >= 15, 'Molonta has at least 15 useful traveler FAQs');
assert(Array.isArray(molonta.content?.testimonials) && molonta.content.testimonials.length === 0, 'no testimonial is invented');
assert(Array.isArray(molonta.images) && molonta.images.length === 15, 'the Molonta main page keeps 15 curated images');
assert(heritagePage.includes('const galleryPreviewIndexes = [1, 3, 8, 6, 5]'), 'the editorial gallery preview is deterministic');
assert(heritagePage.includes('gallery-card--feature') && heritagePage.includes('gallery-card--support'), 'the gallery uses one feature frame and aligned supporting frames');
assert(!heritagePage.includes('gallery-grid'), 'the misaligned masonry gallery cannot return');
assert(heritagePage.includes('hosts__legacy') && !heritagePage.includes('hosts__portrait'), 'the host section does not imply that an estate photograph is an owner portrait');
assert(heritagePage.includes('faq__layout') && heritagePage.includes('class="faq-item"'), 'the FAQ uses the refined split accordion layout');
assert(schema.includes("'@type': 'FAQPage'"), 'villa FAQs generate FAQPage structured data');
assert(heritagePage.includes('.gallery-card--feature { aspect-ratio: 16 / 9; }'), 'the desktop gallery feature frame has a fixed ratio');
assert(heritagePage.includes('.gallery-card--support { aspect-ratio: 16 / 10; }'), 'supporting desktop gallery frames share a fixed ratio');
assert(heritagePage.includes('id="amenities"'), 'the Amenities menu has a real section target');
assert(heritagePage.includes('https://www.google.com/maps?'), 'the location section uses an actionable map');
assert(heritagePage.includes('.details__grid > div:first-child { position: sticky;'), 'the suite overview uses the approved sticky split layout');
assert(heritagePage.includes('.lightbox[open] { display: grid; place-items: center; }'), 'the image viewer uses a stable centered frame');
assert(heritagePage.includes('object-fit: cover; object-position: center;'), 'lightbox images share one aligned presentation frame');
assert(molonta.completeGallery?.imageCount === 104, 'Molonta declares the 104-image complete collection');
assert(molonta.completeGallery?.chapterCount === 9, 'Molonta declares nine complete-gallery chapters');
assert(heritagePage.includes('Explore complete gallery'), 'the curated main page links to the complete gallery');
assert(heritagePage.includes('/gallery/'), 'the complete-gallery link is owner-site local');
assert(completeGalleryRoute.includes("pageType: 'gallery'"), 'the gallery route emits collection metadata');
assert(completeGalleryRoute.includes('noindex={!isVillaIndexable(villaConfig)}'), 'the gallery route inherits the private-preview discovery boundary');
assert(completeGalleryRoute.includes('<HeritageGalleryPage'), 'the gallery route renders the owner-branded collection');
assert(heritageGalleryPage.includes("loading={categoryIndex === 0 && index === 0 ? 'eager' : 'lazy'}"), 'only the first complete-gallery image loads eagerly');
assert(heritageGalleryPage.includes('content-visibility: auto'), 'off-screen gallery chapters defer rendering work');
assert(heritageGalleryPage.includes('position: sticky'), 'the complete gallery keeps its chapter index in reach');
assert(heritageGalleryPage.includes('object-fit: contain'), 'the complete-gallery lightbox preserves every image composition');
assert(heritageGalleryPage.includes('ArrowLeft') && heritageGalleryPage.includes('ArrowRight'), 'the complete-gallery lightbox supports keyboard navigation');
assert(schema.includes("'ImageGallery'"), 'gallery metadata identifies the page as an ImageGallery');
assert(registry.includes("'about', 'gallery', 'thank-you'"), 'the complete gallery is registered for future public sitemap discovery');


const imageSources = molonta.images.map((image) => image.src);
assert(new Set(imageSources).size === imageSources.length, 'curated gallery sources are unique');

const variantBudgets = new Map([
  [480, 100],
  [768, 180],
  [1024, 300],
  [1280, 420],
  [1600, 600],
]);
for (const source of imageSources) {
  const relative = source.replace(/^\//, '');
  assert(exists(`public/${relative}`), `${source} exists`);
  if (source.endsWith('.webp')) {
    const masterPath = path.join(root, 'public', relative);
    const masterMetadata = await sharp(masterPath).metadata();
    assert(masterMetadata.format === 'webp', `${source} is WebP`);
    assert(masterMetadata.width === 1920, `${source} has a 1920px master`);
    assert(fs.statSync(masterPath).size <= 800 * 1024, `${source} stays within the master-image budget`);

    for (const width of [480, 768, 1024, 1280, 1600]) {
      const variant = source.replace(/\.webp$/, `-${width}.webp`).replace(/^\//, '');
      assert(exists(`public/${variant}`), `${variant} exists`);
      if (exists(`public/${variant}`)) {
        const variantPath = path.join(root, 'public', variant);
        const metadata = await sharp(variantPath).metadata();
        assert(metadata.format === 'webp' && metadata.width === width, `${variant} is a ${width}px WebP`);
        assert(fs.statSync(variantPath).size <= variantBudgets.get(width) * 1024, `${variant} stays within its delivery budget`);
      }
    }
  }
}


assert(Array.isArray(completeGallery.categories) && completeGallery.categories.length === 9, 'the complete gallery has nine chapters');
assert(Array.isArray(completeGallery.items) && completeGallery.items.length === 104, 'the complete gallery has 104 photographs');
assert(
  completeGallery.categories.reduce((total, category) => total + category.count, 0) === completeGallery.items.length,
  'chapter counts sum to the complete collection',
);

const completeIds = completeGallery.items.map((item) => item.id);
assert(new Set(completeIds).size === completeIds.length, 'complete-gallery item IDs are unique');
assert(
  completeGallery.items.every((item) =>
    typeof item.alt === 'string'
    && item.alt.length >= 24
    && !/\bview\s+\d+\b/i.test(item.alt)
  ),
  'every complete-gallery photograph has descriptive non-templated alt text',
);
assert(
  completeGallery.categories.every((category) =>
    completeGallery.items.filter((item) => item.categoryId === category.id).length === category.count
  ),
  'every chapter count matches its photographs',
);

const completeAssetNames = new Set();
let completeAssetsValid = true;
for (const item of completeGallery.items) {
  const widths = item.variants.map((variant) => variant.width).sort((a, b) => a - b);
  const [small, medium, large] = widths;
  if (
    widths.length !== 3
    || small !== 480
    || medium !== 960
    || large < 1000
    || large > 1600
  ) completeAssetsValid = false;
  for (const variant of item.variants) {
    const filename = path.posix.basename(variant.src);
    const relative = `public/images/villas/molonta-owner-preview/gallery/${filename}`;
    completeAssetNames.add(filename);
    if (!exists(relative)) {
      completeAssetsValid = false;
      continue;
    }
    const assetPath = path.join(root, relative);
    const metadata = await sharp(assetPath).metadata();
    if (
      metadata.format !== 'webp'
      || metadata.width !== variant.width
      || metadata.height !== variant.height
      || fs.statSync(assetPath).size > 900 * 1024
    ) {
      completeAssetsValid = false;
    }
  }
}
assert(completeAssetNames.size === 312, 'the complete gallery references 312 unique responsive derivatives');
assert(completeAssetsValid, 'all complete-gallery derivatives exist as dimensionally correct budgeted WebP files');
const prohibitedReviewClaims = ['Alexandra M.', 'James R.', 'Sofia L.', 'genericGoogleReviews'];
for (const claim of prohibitedReviewClaims) {
  assert(!route.includes(claim) && !schema.includes(claim), `fabricated review marker "${claim}" is absent`);
}

if (errors.length) {
  console.error('\nOwner-site validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\nOwner-site validation passed.');
