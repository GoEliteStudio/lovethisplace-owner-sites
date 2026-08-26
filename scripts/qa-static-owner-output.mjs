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

const measureCaptionAttachment = async (page, imageSelector, captionSelector) => page.evaluate(
  ({ imageSelector, captionSelector }) => {
    const image = document.querySelector(imageSelector);
    const caption = document.querySelector(captionSelector);
    if (!(image instanceof HTMLImageElement) || !(caption instanceof HTMLElement)) {
      throw new Error('Lightbox image or caption is missing');
    }

    const imageRect = image.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();
    const intrinsicWidth = image.naturalWidth || Number(image.getAttribute('width')) || 1;
    const intrinsicHeight = image.naturalHeight || Number(image.getAttribute('height')) || 1;
    const aspect = intrinsicWidth / intrinsicHeight;
    const visibleHeight = Math.min(imageRect.height, imageRect.width / aspect);
    const visibleTop = imageRect.top + ((imageRect.height - visibleHeight) / 2);
    const visibleBottom = visibleTop + visibleHeight;

    return {
      gap: captionRect.top - visibleBottom,
      caption: caption.textContent?.trim() || '',
      captionClipped: caption.scrollHeight > caption.clientHeight + 1,
    };
  },
  { imageSelector, captionSelector },
);

const auditEveryCaption = async (page, {
  label,
  count,
  openSelector,
  modalSelector,
  nextSelector,
  imageSelector,
  captionSelector,
  counterSelector,
}) => {
  await page.click(openSelector);
  await page.waitForSelector(modalSelector);
  const seen = new Set();

  for (let step = 0; step < count; step += 1) {
    const counter = await page.$eval(counterSelector, (element) => element.textContent?.trim() || '');
    seen.add(counter);
    const geometry = await measureCaptionAttachment(page, imageSelector, captionSelector);

    if (!geometry.caption) throw new Error(`${label} ${counter}: caption is empty`);
    if (geometry.captionClipped) throw new Error(`${label} ${counter}: caption is clipped`);
    if (geometry.gap < 6 || geometry.gap > 18) {
      throw new Error(`${label} ${counter}: visible image-to-caption gap is ${geometry.gap.toFixed(1)}px`);
    }

    if (step < count - 1) await page.click(nextSelector);
  }

  if (seen.size !== count) {
    throw new Error(`${label}: expected ${count} unique slides, measured ${seen.size}`);
  }
};

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

    if (viewport.name === 'mobile') {
      const captionPage = await browser.newPage();
      await captionPage.setViewport(viewport);

      await captionPage.goto(base.href, { waitUntil: 'networkidle0' });
      await auditEveryCaption(captionPage, {
        label: 'curated gallery',
        count: 15,
        openSelector: '.gallery-card',
        modalSelector: '#heritage-lightbox[open]',
        nextSelector: '.lightbox__next',
        imageSelector: '#heritage-lightbox img',
        captionSelector: '#heritage-lightbox figcaption',
        counterSelector: '.lightbox__counter',
      });

      await captionPage.goto(new URL('/gallery/', base).href, { waitUntil: 'networkidle0' });
      await auditEveryCaption(captionPage, {
        label: 'complete gallery',
        count: 104,
        openSelector: '[data-gallery-open]',
        modalSelector: '[data-gallery-modal][open]',
        nextSelector: '[data-gallery-next]',
        imageSelector: '[data-gallery-image]',
        captionSelector: '[data-gallery-caption]',
        counterSelector: '[data-gallery-current]',
      });

      await captionPage.close();
    }

    console.log(JSON.stringify({ profile: viewport.name, ...result }));
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('[owner-static-qa] PASS: clean routes, rapid deep-gallery navigation, and mobile/desktop lightbox geometry.');
