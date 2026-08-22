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
const cleanRouteMaterializer = read('scripts/materialize-clean-owner-routes.mjs');
const outputIsolation = read('scripts/validate-output-isolation.mjs');
const completeGallery = JSON.parse(read('src/content/galleries/molonta-heritage-estate.en.json'));
const mobileHeroMenuQa = read('scripts/qa-mobile-hero-menu.mjs');

assert(registry.includes("slug: 'molonta-heritage-estate'"), 'Molonta is registered');
assert(registry.includes("domain: 'molonta.lovethisplace.co'"), 'Molonta has the approved clean custom domain');
assert(registry.includes("canonicalOrigin: 'https://molonta.lovethisplace.co'"), 'Molonta reserves the clean custom domain for public launch');
assert(registry.includes("previewOrigin: 'https://molonta-heritage-estate.vercel.app'"), 'Molonta previews use a live share origin');
assert(registry.includes("villa.visibility !== 'public' && villa.previewOrigin"), 'private-preview metadata never points at an unresolved custom domain');
assert(registry.includes('rootCanonical: true'), 'Molonta is configured for root-domain presentation');
assert(rootRoute.includes('export const prerender = true'), 'the root shell is static and cannot self-fetch the deployment');
assert(
  cleanRouteMaterializer.includes("fs.copyFileSync(source, destination)")
    && cleanRouteMaterializer.includes("const cleanPages = ['', ...villa.auxPages]"),
  'dedicated builds materialize registry-approved clean routes from prerendered pages'
);
assert(
  outputIsolation.includes('fileHash(internalFile) !== fileHash(cleanFile)')
    && outputIsolation.includes('expectedVariants.length'),
  'post-build validation proves clean routes and every gallery variant survived'
);
assert(registry.includes("visibility: 'private-preview'"), 'the registry supports a private-preview state');
assert(registry.includes("theme: 'heritage-signature'"), 'the heritage-signature theme is explicit');
assert(registry.includes('getIndexableVillas'), 'public discovery is generated from an indexable allowlist');
assert(
  registry.includes('process.env.VILLA_SLUG') &&
    registry.includes('getBuildVillas().map'),
  'isolated deployments generate routes only for their configured villa'
);
assert(route.includes("villaConfig.theme === 'heritage-signature'"), 'the reusable renderer is selected by configuration');
assert(route.includes("description={villa.seo?.description || villa.summary}"), 'property SEO descriptions feed page metadata');
assert(
  layout.includes('getVillaByHostname') &&
    layout.includes('canonicalUrlObject.hostname') &&
    layout.includes('canonicalVilla ? !isVillaIndexable(canonicalVilla)'),
  'auxiliary pages inherit registry-driven noindex protection on clean custom domains'
);
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
assert(
  molonta.hero?.mobileImage === '/images/villas/molonta-owner-preview/hero-infinity-pool.webp',
  'Molonta uses the approved infinity-pool opening frame on mobile',
);
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
const forbiddenLightboxRuntime = [
  'cachedImages',
  'renderRequest',
  'displayVariant',
  'deliveryWidth',
  'deliverySrc',
  'preloadVariant',
  'const preload =',
  '.decode(',
  'requestIdleCallback',
  'aria-busy',
];
for (const [source, label] of [
  [heritagePage, 'curated gallery'],
  [heritageGalleryPage, 'complete gallery'],
]) {
  for (const token of forbiddenLightboxRuntime) {
    assert(!source.includes(token), `${label} cannot reintroduce custom lightbox runtime: ${token}`);
  }
  assert(
    source.includes('image.srcset = item.srcset;')
      && source.includes('image.src = item.src;')
      && source.includes('image.width = item.width;')
      && source.includes('image.height = item.height;'),
    `${label} delegates responsive image selection directly to the browser`,
  );
}
assert(heritagePage.includes("image.sizes = '100vw';"), 'the curated gallery keeps its full-viewport responsive hint');
assert(heritageGalleryPage.includes('image.sizes = item.sizes;'), 'the complete gallery uses its measured modal display width');
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
assert(layout.includes('imagesrcset={lcpSrcset}') && layout.includes('imagesizes={lcpSizes}'), 'the base layout preloads responsive LCP candidates');
assert(route.includes('lcpSrcset={heritageHeroSrcset}') && route.includes("lcpSizes={heritageHeroSrcset ? '100vw' : undefined}"), 'heritage pages pass responsive hero preload metadata');
assert(
  layout.includes('media="(max-width: 760px)"')
    && route.includes('lcpMobileSrcset={heritageMobileHeroSrcset}'),
  'the art-directed mobile hero receives a responsive preload without preloading the desktop frame',
);
assert(heritagePage.includes('height: 100dvh'), 'the heritage lightbox uses the mobile dynamic viewport');
assert(heritageGalleryPage.includes('height: 100dvh'), 'the complete-gallery lightbox uses the mobile dynamic viewport');
assert(heritageGalleryPage.includes('display: block') && heritageGalleryPage.includes('position: absolute'), 'mobile complete-gallery navigation overlays the image instead of shrinking it');
assert(
  heritageGalleryPage.includes('const neighbour = new Image();')
    && heritageGalleryPage.includes('let warmTimer = 0;')
    && heritageGalleryPage.includes("image.addEventListener('load'")
    && heritageGalleryPage.includes('active === loadedIndex')
    && !heritageGalleryPage.includes('warmAdjacent(shownIndex)'),
  'complete-gallery neighbors warm through one stable debounced load listener',
);
assert(heritageGalleryPage.includes('calc(50vw - 20px)') && heritageGalleryPage.includes('calc(100vw - 32px)'), 'complete-gallery cards declare accurate responsive display sizes');
assert(heritageGalleryPage.includes('calc(100vw - 180px)'), 'complete-gallery lightbox declares its measured desktop display width');
const completeGalleryShowBlock = heritageGalleryPage.slice(
  heritageGalleryPage.indexOf('const show ='),
  heritageGalleryPage.indexOf("gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-open]')"),
);
assert(!/await|\.decode\(|addEventListener/.test(completeGalleryShowBlock), 'complete-gallery show remains synchronous, decode-free, and listener-free');
assert(
  heritagePage.includes('media="(min-width: 761px)"')
    && heritagePage.includes('srcset={srcset(frame.mobile.src)}')
    && heritagePage.includes('srcset={srcset(frame.desktop.src)}'),
  'heritage hero uses mobile-first frames and browser-native desktop art direction',
);
assert(
  heritagePage.includes('data-cinematic-hero')
    && heritagePage.includes('heroFrames.map')
    && heritagePage.includes('data-srcset={srcset(frame.desktop.src)}')
    && heritagePage.includes('data-srcset={srcset(frame.mobile.src)}'),
  'heritage hero renders one immediate frame and defers later cinematic frames',
);
assert(
  heritagePage.includes('const hydrateHeroSlide =')
    && heritagePage.includes('const hydrationPromises = new WeakMap()')
    && heritagePage.includes('await hydrateHeroSlide(heroSlides[nextIndex])')
    && heritagePage.includes('}, 7200);'),
  'heritage hero hydrates each later frame once before changing the visible frame',
);
assert(
  heritagePage.includes("window.matchMedia('(prefers-reduced-motion: reduce)')")
    && heritagePage.includes("document.addEventListener('visibilitychange'")
    && heritagePage.includes('showHeroSlide(0)'),
  'heritage hero pauses when hidden and preserves a static reduced-motion experience',
);
assert(
  heritagePage.includes('transition: opacity 1.2s ease')
    && heritagePage.includes('transition: transform 7s ease')
    && heritagePage.includes('translateZ(0) scale(1.035)')
    && heritagePage.includes('translateZ(0) scale(1);'),
  'heritage hero uses the proven storefront crossfade and cinematic transform timing',
);
assert(
  heritagePage.includes('<img width={lightboxItems[0].width} height={lightboxItems[0].height} alt="" />'),
  'the closed heritage lightbox does not download an unseen opening image',
);
assert(
  layout.includes('.nav-links.is-open { display: flex; }')
    && layout.includes('flex-direction: column;')
    && layout.includes("navLinks.classList.toggle('is-open', open)")
    && !layout.includes('navLinks.style.display'),
  'mobile navigation opens as a bounded vertical panel without inline desktop display overrides',
);
assert(
  mobileHeroMenuQa.includes("name: 'samsung-compact'")
    && mobileHeroMenuQa.includes("name: 'iphone-compact'")
    && mobileHeroMenuQa.includes("name: 'samsung-large'")
    && mobileHeroMenuQa.includes("textContent?.trim().toLowerCase() === 'gallery'")
    && mobileHeroMenuQa.includes("hero-infinity-pool-")
    && mobileHeroMenuQa.includes("hero-estate-twilight-"),
  'browser QA covers opened-menu clipping and mobile/desktop hero selection',
);
assert(
  heritagePage.includes('calc(100svh - 110px)')
    && heritagePage.includes('.inquire { gap: 32px; padding: 64px 24px; }')
    && heritagePage.includes('.inquire h2 { max-width: 10ch;'),
  'small-screen hero and inquiry composition stay proportionate and inset',
);
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
  if (
    widths.length < 5
    || widths[0] !== 480
    || widths[1] !== 640
    || widths[2] !== 768
    || widths[3] !== 960
    || widths.at(-1) < 1000
    || widths.at(-1) > 2560
    || new Set(widths).size !== widths.length
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
      || fs.statSync(assetPath).size > 1200 * 1024
    ) {
      completeAssetsValid = false;
    }
  }
}
assert(
  completeAssetNames.size === completeGallery.items.reduce((total, item) => total + item.variants.length, 0),
  'the complete gallery references every source-bounded responsive derivative exactly once',
);
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
