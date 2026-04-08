const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().slice(0,200)); });
  page.on('pageerror', err => errors.push('[PAGE] ' + err.message.slice(0,200)));

  // === ROUTE LOGIC ===
  console.log('=== ROUTE LOGIC ===');

  await page.goto('http://localhost:4321/blog', { timeout: 15000 });
  const blogLinks = await page.$$eval('a[href^="/blog/"]', els => els.map(e => e.getAttribute('href')).filter(h => !h.endsWith('/blog')));
  console.log('Blog index -> detail links:', blogLinks.length, blogLinks);

  await page.goto('http://localhost:4321/tools', { timeout: 15000 });
  const toolLinks = await page.$$eval('a[href^="/tools/"]', els => els.map(e => e.getAttribute('href')).filter(h => !h.endsWith('/tools')));
  console.log('Tools index -> detail links:', toolLinks.length, toolLinks);

  await page.goto('http://localhost:4321/tools/claude-code', { timeout: 15000 });
  const externalLinks = await page.$$eval('a[target="_blank"]', els => els.map(e => ({ href: e.getAttribute('href'), rel: e.getAttribute('rel') })));
  console.log('External links (target=_blank):', externalLinks.length, JSON.stringify(externalLinks));

  // Nav links
  await page.goto('http://localhost:4321/', { timeout: 15000 });
  const navLinks = await page.$$eval('nav a', els => els.map(e => ({ href: e.getAttribute('href'), label: e.textContent.trim() })));
  console.log('Nav links:', JSON.stringify(navLinks));

  await page.click('nav a[href="/blog"]');
  await page.waitForURL('**/blog', { timeout: 10000 });
  console.log('Nav click -> blog:', page.url());

  // === EDGE CASES ===
  console.log('\n=== EDGE CASES ===');
  const resp404 = await page.goto('http://localhost:4321/blog/nonexistent', { timeout: 15000 });
  console.log('404 behavior:', resp404.status(), page.url());

  // === SEO ===
  console.log('\n=== SEO ===');
  await page.goto('http://localhost:4321/', { timeout: 15000 });
  const seoTitle = await page.$eval('title', el => el.textContent);
  const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content);
  const canonical = await page.$eval('link[rel="canonical"]', el => el.href);
  console.log('Title:', seoTitle);
  console.log('OG title:', ogTitle);
  console.log('Canonical:', canonical);

  // === WEBGL ANIMATION CHECKS ===
  console.log('\n=== WEBGL ===');
  await page.goto('http://localhost:4321/', { timeout: 15000 });
  const hasCanvas = await page.$('canvas');
  console.log('Canvas elements on home:', hasCanvas ? 'YES' : 'NO');
  const hasWebGL = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    return !!gl;
  });
  console.log('WebGL context available:', hasWebGL ? 'YES' : 'NO');

  // === ERROR SUMMARY ===
  console.log('\n=== CONSOLE ERRORS ===');
  if (errors.length === 0) {
    console.log('None');
  } else {
    errors.forEach(e => console.log('  ' + e));
  }

  await browser.close();
  console.log('\nDone.');
})().catch(e => { console.error(e.message); process.exit(1); });
