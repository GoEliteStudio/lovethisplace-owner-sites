#!/usr/bin/env node

import puppeteer from 'puppeteer-core';

const [url] = process.argv.slice(2);
if (!url) throw new Error('Pass the Molonta owner-site URL to verify.');

const mobileProfiles = [
  { name: 'samsung-compact', width: 360, height: 800, deviceScaleFactor: 3 },
  { name: 'iphone-compact', width: 393, height: 852, deviceScaleFactor: 3 },
  { name: 'samsung-large', width: 412, height: 915, deviceScaleFactor: 2.625 },
];

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  for (const profile of mobileProfiles) {
    const page = await browser.newPage();
    const initialImages = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'image') initialImages.push(request.url());
    });
    await page.setViewport({ ...profile, isMobile: true, hasTouch: true });
    await page.goto(url, { waitUntil: 'networkidle0' });

    const initial = await page.evaluate(() => {
      const hero = document.querySelector('.heritage-hero__media img');
      const button = document.querySelector('.mobile-menu-btn');
      const navigation = document.querySelector('#primary-navigation');
      if (!(hero instanceof HTMLImageElement)
        || !(button instanceof HTMLButtonElement)
        || !(navigation instanceof HTMLElement)) {
        throw new Error('Required mobile hero or navigation elements are missing');
      }
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        heroCurrentSrc: hero.currentSrc,
        heroComplete: hero.complete && hero.naturalWidth > 0,
        buttonDisplay: getComputedStyle(button).display,
        navigationDisplay: getComputedStyle(navigation).display,
      };
    });

    if (!initial.heroCurrentSrc.includes('hero-infinity-pool-')) {
      throw new Error(`${profile.name}: mobile hero is not the approved infinity-pool frame: ${initial.heroCurrentSrc}`);
    }
    if (!initial.heroComplete) throw new Error(`${profile.name}: mobile hero did not load`);
    const desktopHeroRequests = initialImages.filter((requestUrl) => requestUrl.includes('hero-estate-twilight-'));
    if (desktopHeroRequests.length > 0) {
      throw new Error(`${profile.name}: desktop hero was downloaded by the mobile viewport: ${desktopHeroRequests.join(', ')}`);
    }
    if (initial.scrollWidth > initial.viewportWidth + 1) {
      throw new Error(`${profile.name}: closed page overflows horizontally`);
    }
    if (initial.buttonDisplay === 'none' || initial.navigationDisplay !== 'none') {
      throw new Error(`${profile.name}: mobile navigation does not start collapsed`);
    }

    await page.click('.mobile-menu-btn');
    await page.waitForFunction(() =>
      document.querySelector('.mobile-menu-btn')?.getAttribute('aria-expanded') === 'true'
    );

    const opened = await page.evaluate(() => {
      const toRect = (value) => ({
        left: value.left,
        right: value.right,
        top: value.top,
        bottom: value.bottom,
        width: value.width,
        height: value.height,
      });
      const navigation = document.querySelector('#primary-navigation');
      const gallery = [...document.querySelectorAll('#primary-navigation a')]
        .find((link) => link.textContent?.trim().toLowerCase() === 'gallery');
      const links = [...document.querySelectorAll('#primary-navigation a')];
      if (!(navigation instanceof HTMLElement) || !(gallery instanceof HTMLElement)) {
        throw new Error('Opened mobile navigation or Gallery link is missing');
      }
      const navigationRect = navigation.getBoundingClientRect();
      const galleryRect = gallery.getBoundingClientRect();
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        navigation: {
          ...toRect(navigationRect),
          display: getComputedStyle(navigation).display,
          flexDirection: getComputedStyle(navigation).flexDirection,
          scrollWidth: navigation.scrollWidth,
          clientWidth: navigation.clientWidth,
        },
        gallery: toRect(galleryRect),
        everyLinkFits: links.every((link) => {
          const linkRect = link.getBoundingClientRect();
          return linkRect.left >= -1 && linkRect.right <= window.innerWidth + 1;
        }),
      };
    });

    if (opened.navigation.display !== 'flex' || opened.navigation.flexDirection !== 'column') {
      throw new Error(`${profile.name}: opened navigation is not a vertical flex panel`);
    }
    if (opened.navigation.left < -1 || opened.navigation.right > opened.viewportWidth + 1) {
      throw new Error(`${profile.name}: opened navigation leaves the viewport`);
    }
    if (opened.navigation.scrollWidth > opened.navigation.clientWidth + 1 || !opened.everyLinkFits) {
      throw new Error(`${profile.name}: opened navigation clips one or more links`);
    }
    if (opened.gallery.left < -1 || opened.gallery.right > opened.viewportWidth + 1) {
      throw new Error(`${profile.name}: Gallery is clipped`);
    }
    if (opened.scrollWidth > opened.viewportWidth + 1) {
      throw new Error(`${profile.name}: opened page overflows horizontally`);
    }

    await page.click('.mobile-menu-btn');
    await page.waitForFunction(() =>
      document.querySelector('.mobile-menu-btn')?.getAttribute('aria-expanded') === 'false'
    );
    const closedDisplay = await page.$eval('#primary-navigation', (element) => getComputedStyle(element).display);
    if (closedDisplay !== 'none') throw new Error(`${profile.name}: mobile navigation did not close`);

    console.log(JSON.stringify({ profile: profile.name, initial, opened }));
    await page.close();
  }

  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await desktop.goto(url, { waitUntil: 'networkidle0' });
  const desktopResult = await desktop.evaluate(() => {
    const hero = document.querySelector('.heritage-hero__media img');
    const button = document.querySelector('.mobile-menu-btn');
    const navigation = document.querySelector('#primary-navigation');
    if (!(hero instanceof HTMLImageElement)
      || !(button instanceof HTMLElement)
      || !(navigation instanceof HTMLElement)) {
      throw new Error('Required desktop hero or navigation elements are missing');
    }
    return {
      heroCurrentSrc: hero.currentSrc,
      heroComplete: hero.complete && hero.naturalWidth > 0,
      buttonDisplay: getComputedStyle(button).display,
      navigationDisplay: getComputedStyle(navigation).display,
      navigationDirection: getComputedStyle(navigation).flexDirection,
    };
  });
  if (!desktopResult.heroCurrentSrc.includes('hero-estate-twilight-')) {
    throw new Error(`desktop: twilight estate is no longer the opening frame: ${desktopResult.heroCurrentSrc}`);
  }
  if (!desktopResult.heroComplete) throw new Error('desktop: hero did not load');
  if (desktopResult.buttonDisplay !== 'none'
    || desktopResult.navigationDisplay !== 'flex'
    || desktopResult.navigationDirection !== 'row') {
    throw new Error('desktop: navigation behavior regressed');
  }
  console.log(JSON.stringify({ profile: 'desktop', ...desktopResult }));
  await desktop.close();
} finally {
  await browser.close();
}
