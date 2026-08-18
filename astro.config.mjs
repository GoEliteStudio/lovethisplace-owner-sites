import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // The request host and each villa's explicit domain configuration determine
  // canonical URLs. Never put a customer domain in this global fallback.
  site: process.env.PUBLIC_SITE_URL || 'https://lovethisplace-sites.vercel.app',
  output: 'server',
  adapter: vercel(),
});
