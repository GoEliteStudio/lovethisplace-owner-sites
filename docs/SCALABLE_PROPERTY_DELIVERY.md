# Scalable Property Delivery Standard

Status: canonical fast-lane procedure, version 1, 2026-08-27.

## Outcome

The engine must turn one verified property packet into two complementary
products without redesigning either product:

- the LoveThisPlace storefront: discovery, comparison, trust, and attributed
  inquiry;
- the owner site: the property's own durable identity and direct-business
  asset.

The target is a first private preview within two operator hours only when the
property qualifies for the fast lane. The time is measured and recorded; it is
not promised before intake is complete.

## Fast-lane qualification

Work starts only when all build gates pass:

1. The property and decision-maker identity are known.
2. Written permission exists to use the supplied facts and media in a private
   preview.
3. The commercial path is recorded: paid founding storefront, commission-only
   partner, or explicitly approved Go Elite showcase.
4. A source archive or approved public media set exists.
5. Core facts, rate basis, inquiry recipient, owner-site theme, and publication
   state are decided.
6. The property fits an existing engine capability.

Missing cancellation policy, legal entity, or banking details may block public
commerce without blocking a noindex preview. The validator reports those two
states separately.

## One packet, one source of truth

Create a private JSON packet from
`templates/property-packet.v1.example.json`. Store the real packet outside Git
or under ignored `.source/`. The packet feeds both repositories. Do not maintain
two independent versions of facts, rates, alt text, or contact routing.

Every claim must be owner-confirmed or have a recorded source URL. Never invent
reviews, ratings, awards, availability, exclusivity, security claims, rates, or
host biography.

## Locked product boundary

Supported owner-site themes are `classic` and `heritage-signature`. Choose one;
do not design a third theme for a property.

Reuse the existing:

- responsive header and mobile navigation;
- cinematic hero behavior;
- fixed facts, amenities, rates, location, hosts, FAQ, inquiry, and legal
  sections;
- gallery grid and lightbox interaction;
- inquiry proxy, attribution, success state, and anti-spam controls;
- schema, robots, sitemap, canonical, noindex, and deployment isolation logic.

The media contract is one responsive WebP/AVIF ladder at 640, 960, and 1280,
with a source-faithful top tier no larger than 2048. Never upscale. Use stable
dimensions, meaningful alt text, one neutral gallery surface, uniform gutters,
and the existing lightbox. Source-specific widths below the top tier are allowed
only when the original cannot support the standard size.

## Clock

Record actual start and finish times in the packet.

- 0-15 minutes: validate packet, authorization, commercial path, and source
  archive receipt.
- 15-35 minutes: curate hero, 15-image editorial set, gallery chapters, facts,
  rates, and policy state.
- 35-65 minutes: configure the LoveThisPlace storefront.
- 65-100 minutes: configure the owner site using an existing theme.
- 100-115 minutes: automated build, route/media isolation, metadata, and
  inquiry checks.
- 115-120 minutes: visual review on phone and desktop; prepare the presentation
  link.

If a shared engine defect appears, stop the property clock. Log one engine gap,
fix the shared component once on its own branch, add a regression test, and then
resume. Never patch the same behavior independently into two property copies.

## Required release gates

Private preview:

- packet validator says `BUILD READY`;
- source archive is private and checksummed;
- no unverified facts or fabricated trust signals;
- all manifest and srcset assets resolve locally;
- mobile and desktop gallery/navigation/inquiry states pass;
- owner site is `noindex, nofollow` and has no password wall;
- dedicated build sets `VILLA_SLUG` and contains only its property routes/media.

Public commerce additionally requires:

- signed commercial terms and use authorization;
- exact cancellation/refund and booking terms;
- legal entity/signatory details;
- verified payment/settlement instructions through an approved secure channel;
- tested traveler inquiry/payment responsibility;
- canonical domain, indexing decision, robots, sitemap, schema, and analytics;
- explicit release approval.

## Definition of done

A build is not done because localhost works, a PR merged, or Vercel reported
success. It is done only after the public presentation URL is fetched in a
logged-out browser, expected routes and every responsive image candidate return
success, cross-property routes/media fail, inquiry attribution is tested, and
the result is recorded in the portfolio status.

