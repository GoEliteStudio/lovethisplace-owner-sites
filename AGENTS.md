# Owner-Site Engine Instructions

Read these files before changing or creating a property:

1. `docs/PORTFOLIO_STATUS.md`
2. `docs/SCALABLE_PROPERTY_DELIVERY.md`
3. `docs/OWNER_SITE_PRODUCT_V2.md`
4. `docs/OWNER_SITE_ONBOARDING_RUNBOOK.md`

The canonical intake contract is `templates/property-packet.v1.example.json`.
Validate a private packet before editing the engine:

```powershell
node scripts/validate-property-packet.mjs C:\path\to\private-property-packet.json
```

Do not use `npm run villa:create` or `npm run villa:onboard` for commercial
delivery. Those legacy commands create placeholder copy and/or write to
Firestore before the current authorization, factual, commercial, and
publication gates. They may only be changed or run under a separate audit.

Property delivery is configuration and content work. Do not introduce a new
theme, gallery, lightbox, routing strategy, image ladder, placeholder system,
or deployment architecture inside a property build. Record an engine gap and
handle it separately.

Never expose owner source archives, private rates, contracts, bank details,
credentials, or inquiry data. Source media belongs under an ignored `.source/`
directory. Only curated, metadata-stripped derivatives may enter `public/`.

