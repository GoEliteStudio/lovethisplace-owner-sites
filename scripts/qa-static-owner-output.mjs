#!/usr/bin/env node

import puppeteer from 'puppeteer-core';

const [baseUrl] = process.argv.slice(2);
if (!baseUrl) throw new Error('Pass the owner-site base URL to verify.');

const base = new URL(baseUrl);
const cleanPaths = ['/', '/about/', '/contact/', '/gallery/', '/privacy/', '/rates/', '/terms/', '/thank-you/'];

for (const route of cleanPaths) {
  const response = await fetch(new URL(route, base));
  if (!response.ok) throw new Error(`${route} returned ${response.status}`);
  if (!(response.headers.get('content-type') || '').includes('text/html')) {
    throw new Error(`${route} did not return HTML`);
  }
}

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  for (const viewport of [
    { name: 'mobile', width: 360, height: 800, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  ]) {
    const page = await browser.newPage();
    const failedImages = [];
    page.on('response', (response) => {
      if (response.request().resourceType() === 'image' && response.status() >= 400) {
        failedImages.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.setViewport(viewport);
    await page.goto(new URL('/gallery/', base).href, { waitUntil: 'networkidle0' });
    await page.click('[data-gallery-open]');
    await page.waitForSelector('[data-gallery-modal][open]');

    for (let step = 0; step < 40; step += 1) {
      await page.click('[data-gallery-next]');
    }

    await page.waitForFunction(() => {
      const image = document.querySelector('[data-gallery-image]');
      const current = document.querySelector('[data-gallery-current]');
      return image instanceof HTMLImageElement
        && image.complete
        && image.naturalWidth > 0
        && current?.textContent === '41';
    }, { timeout: 15000 });

    const result = await page.evaluate(() => {
      const image = document.querySelector('[data-gallery-image]');
      const stage = document.querySelector('.gallery-lightbox__stage');
      if (!(image instanceof HTMLImageElement) || !(stage instanceof HTMLElement)) {
        throw new Error('Gallery lightbox image or stage is missing');
      }
      const imageRect = image.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      return {
        currentSrc: image.currentSrc,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        imageWidth: imageRect.width,
        imageHeight: imageRect.height,
        stageWidth: stageRect.width,
        stageHeight: stageRect.height,
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    if (!result.currentSrc.includes('/images/villas/molonta-owner-preview/gallery/')) {
      throw new Error(`${viewport.name}: lightbox escaped the isolated Molonta media path`);
    }
    if (result.imageWidth < Math.min(300, result.viewportWidth - 24) || result.imageHeight < 200) {
      throw new Error(`${viewport.name}: lightbox image is displayed too small`);
    }
    if (result.scrollWidth > result.viewportWidth + 1) {
      throw new Error(`${viewport.name}: gallery overflows horizontally`);
    }
    if (failedImages.length > 0) {
      throw new Error(`${viewport.name}: broken gallery requests: ${failedImages.slice(0, 3).join(', ')}`);
    }

    console.log(JSON.stringify({ profile: viewport.name, ...result }));
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('[owner-static-qa] PASS: clean routes, rapid deep-gallery navigation, and mobile/desktop lightbox geometry.');
