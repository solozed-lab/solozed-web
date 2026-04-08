import { test, expect, Page } from '@playwright/test';

// WCAG AA minimum contrast ratios
const MIN_CONTRAST_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_LARGE_TEXT = 3.0; // 18pt+ or 14pt bold

// Colors to check
const COLORS = {
  cyan700: '#0E7490',  // links
  slate600: '#475569',  // body text
  background: '#F5F8FA',
};

interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  passAA: boolean;
  element: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function getElementColor(page: Page, selector: string): Promise<string | null> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return window.getComputedStyle(el).color;
  }, selector);
}

async function getElementBgColor(page: Page, selector: string): Promise<string | null> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return window.getComputedStyle(el).backgroundColor;
  }, selector);
}

async function getAllElementsColor(page: Page, selector: string): Promise<{color: string | null; bg: string | null}[]> {
  return page.evaluate((sel) => {
    const els = document.querySelectorAll(sel);
    return Array.from(els).map(el => ({
      color: window.getComputedStyle(el).color,
      bg: window.getComputedStyle(el).backgroundColor,
    }));
  }, selector);
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return '';
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

const results: ContrastResult[] = [];

test.describe('WCAG AA Color Contrast Compliance', () => {

  test('Blog list page - check tag buttons, card links, search input contrast', async ({ page }) => {
    await page.goto('http://localhost:4323/blog');
    await page.waitForLoadState('networkidle');

    // Check tag buttons
    const tagElements = await getAllElementsColor(page, 'button[class*="tag"], a[class*="tag"], span[class*="tag"]');
    console.log(`Found ${tagElements.length} tag elements`);

    for (let i = 0; i < Math.min(tagElements.length, 5); i++) {
      const el = tagElements[i];
      if (el.color && el.bg) {
        const bgHex = rgbToHex(el.bg);
        const fgHex = rgbToHex(el.color);
        const ratio = getContrastRatio(fgHex, bgHex);
        results.push({
          foreground: fgHex,
          background: bgHex,
          ratio: Math.round(ratio * 100) / 100,
          passAA: ratio >= MIN_CONTRAST_NORMAL_TEXT,
          element: `Tag button [${i}]`,
        });
      }
    }

    // Check card links
    const linkElements = await getAllElementsColor(page, 'a[class*="card"], article a, h2 a');
    const linkCount = linkElements.length;
    console.log(`Found ${linkCount} card links`);

    if (linkCount > 0) {
      const bg = await page.evaluate(() => {
        const el = document.querySelector('main, article, body');
        return el ? window.getComputedStyle(el).backgroundColor : null;
      });
      const sampleLink = linkElements[0];
      if (bg && sampleLink.color) {
        const bgHex = rgbToHex(bg);
        const fgHex = rgbToHex(sampleLink.color);
        const ratio = getContrastRatio(fgHex, bgHex);
        results.push({
          foreground: fgHex,
          background: bgHex,
          ratio: Math.round(ratio * 100) / 100,
          passAA: ratio >= MIN_CONTRAST_NORMAL_TEXT,
          element: `Card link`,
        });
      }
    }

    // Check search input
    const searchElements = await getAllElementsColor(page, 'input[type="search"], input[placeholder*="search" i]');
    if (searchElements.length > 0) {
      const sampleInput = searchElements[0];
      const placeholder = await page.locator('input[type="search"], input[placeholder*="search" i]').first().getAttribute('placeholder');
      if (sampleInput.color && sampleInput.bg) {
        const bgHex = rgbToHex(sampleInput.bg);
        const fgHex = rgbToHex(sampleInput.color);
        const ratio = getContrastRatio(fgHex, bgHex);
        results.push({
          foreground: fgHex,
          background: bgHex,
          ratio: Math.round(ratio * 100) / 100,
          passAA: ratio >= MIN_CONTRAST_NORMAL_TEXT,
          element: `Search input (placeholder: "${placeholder}")`,
        });
      }
    }
  });

  test('Blog post page - check article content links contrast', async ({ page }) => {
    await page.goto('http://localhost:4323/blog');
    await page.waitForLoadState('networkidle');

    // Click on first blog post link
    const firstPostLink = page.locator('article a, h2 a, a[class*="post"]').first();
    const href = await firstPostLink.getAttribute('href');

    if (href) {
      await page.goto(`http://localhost:4323${href}`);
      await page.waitForLoadState('networkidle');

      // Check article content links
      const articleLinkElements = await getAllElementsColor(page, 'article a, main a, .content a');
      const linkCount = articleLinkElements.length;
      console.log(`Found ${linkCount} article links`);

      const bg = await page.evaluate(() => {
        const el = document.querySelector('article, main, body');
        return el ? window.getComputedStyle(el).backgroundColor : null;
      });

      if (bg && linkCount > 0) {
        const sampleLink = articleLinkElements[0];
        if (sampleLink.color) {
          const bgHex = rgbToHex(bg);
          const fgHex = rgbToHex(sampleLink.color);
          const ratio = getContrastRatio(fgHex, bgHex);
          results.push({
            foreground: fgHex,
            background: bgHex,
            ratio: Math.round(ratio * 100) / 100,
            passAA: ratio >= MIN_CONTRAST_NORMAL_TEXT,
            element: `Article link`,
          });
        }
      }
    }
  });

  test('Nav focus outlines have visible contrast', async ({ page }) => {
    await page.goto('http://localhost:4323/blog');
    await page.waitForLoadState('networkidle');

    // Get nav element and check focus styles
    const nav = page.locator('nav');
    if (await nav.count() > 0) {
      const focusStyles = await page.evaluate(() => {
        const navEl = document.querySelector('nav');
        if (!navEl) return null;
        const styles = window.getComputedStyle(navEl);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      });

      // Check if nav links have focus outlines defined
      const navLinkFocus = await page.evaluate(() => {
        const links = document.querySelectorAll('nav a');
        if (links.length === 0) return null;
        const link = links[0];
        const styles = window.getComputedStyle(link, '::after');
        // Check outline style when focused
        return {
          linkColor: window.getComputedStyle(link).color,
          outlineColor: window.getComputedStyle(link).outlineColor,
        };
      });

      if (focusStyles) {
        console.log('Nav styles:', focusStyles);
      }
      if (navLinkFocus) {
        console.log('Nav link focus:', navLinkFocus);
      }
    }
  });

  test('Direct contrast verification of specified colors', async ({ page }) => {
    await page.goto('http://localhost:4323/blog');
    await page.waitForLoadState('networkidle');

    // Test #0E7490 on #F5F8FA
    const cyanOnLight = getContrastRatio(COLORS.cyan700, COLORS.background);
    results.push({
      foreground: COLORS.cyan700,
      background: COLORS.background,
      ratio: Math.round(cyanOnLight * 100) / 100,
      passAA: cyanOnLight >= MIN_CONTRAST_NORMAL_TEXT,
      element: '#0E7490 on #F5F8FA (expected link on bg)',
    });

    // Test #475569 on #F5F8FA
    const slateOnLight = getContrastRatio(COLORS.slate600, COLORS.background);
    results.push({
      foreground: COLORS.slate600,
      background: COLORS.background,
      ratio: Math.round(slateOnLight * 100) / 100,
      passAA: slateOnLight >= MIN_CONTRAST_NORMAL_TEXT,
      element: '#475569 on #F5F8FA (body text on bg)',
    });

    // Test white (#FFFFFF) on #0E7490
    const whiteOnCyan = getContrastRatio('#FFFFFF', COLORS.cyan700);
    results.push({
      foreground: '#FFFFFF',
      background: COLORS.cyan700,
      ratio: Math.round(whiteOnCyan * 100) / 100,
      passAA: whiteOnCyan >= MIN_CONTRAST_NORMAL_TEXT,
      element: '#FFFFFF on #0E7490 (white text on cyan)',
    });
  });

  test.afterAll(async () => {
    console.log('\n=== WCAG AA CONTRAST RESULTS ===\n');
    console.log('Minimum required ratio: 4.5:1 for normal text\n');

    let passCount = 0;
    let failCount = 0;

    for (const result of results) {
      const status = result.passAA ? 'PASS' : 'FAIL';
      console.log(`${status}: ${result.element}`);
      console.log(`  Foreground: ${result.foreground} | Background: ${result.background}`);
      console.log(`  Contrast ratio: ${result.ratio}:1 (required: ${MIN_CONTRAST_NORMAL_TEXT}:1)\n`);

      if (result.passAA) passCount++;
      else failCount++;
    }

    console.log('=== SUMMARY ===');
    console.log(`Total: ${results.length} | Passed: ${passCount} | Failed: ${failCount}`);
    console.log(`Overall: ${((passCount / results.length) * 100).toFixed(1)}% compliant\n`);
  });
});
