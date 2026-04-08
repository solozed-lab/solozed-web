const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().slice(0,200)); });
  page.on('pageerror', err => errors.push('[PAGE] ' + err.message.slice(0,200)));

  console.log('=== ROUTE LOGIC ===');

  // Blog listing -> detail
  await page.goto('http://localhost:4321/blog', { timeout: 15000 });
  const blogHrefs = await page.$$eval('a[href^="/blog/"]', els => els.map(e => e.getAttribute('href')));
  const blogLinks = blogHrefs.filter(h => !h.endsWith('/blog'));
  console.log('Blog index -> detail links:', blogLinks.length, blogLinks);

  // Tools listing -> detail
  await page.goto('http://localhost:4321/tools', { timeout: 15000 });
  const toolHrefs = await page.$$eval('a[href^="/tools/"]', els => els.map(e => e.getAttribute('href')));
  const toolLinks = toolHrefs.filter(h => !h.endsWith('/tools'));
  console.log('Tools index -> detail links:', toolLinks.length, toolLinks);

  // External link with rel
  await page.goto('http://localhost:4321/tools/claude-code', { timeout: 15000 });
  const externalLinks = await page.$$eval('a[target="_blank"]', els => els.map(e => ({ href: e.getAttribute('href'), rel: e.getAttribute('rel') })));
  console.log('External links:', JSON.stringify(externalLinks));

  // Nav exists on BaseLayout pages (blog/tools), not Layout pages (home)
  await page.goto('http://localhost:4321/blog', { timeout: 15000 });
  const blogNavLinks = await page.$$eval('nav a', els => els.map(e => ({ href: e.getAttribute('href'), label: e.textContent.trim() })));
  console.log('Blog page nav links:', JSON.stringify(blogNavLinks));

  // Click nav from blog -> tools
  await page.click('nav a[href="/tools"]');
  await page.waitForURL('**/tools', { timeout: 10000 });
  console.log('Nav click blog->tools:', page.url());

  // Click back to blog
  await page.click('nav a[href="/blog"]');
  await page.waitForURL('**/blog', { timeout: 10000 });
  console.log('Nav click tools->blog:', page.url());

  // === EDGE CASES ===
  console.log('\n=== EDGE CASES ===');
  const resp404 = await page.goto('http://localhost:4321/blog/nonexistent', { timeout: 15000 });
  console.log('404 behavior:', resp404.status(), 'url:', page.url());

  const resp404t = await page.goto('http://localhost:4321/tools/nonexistent', { timeout: 15000 });
  console.log('Tools 404:', resp404t.status(), 'url:', page.url());

  // === SEO ===
  console.log('\n=== SEO ===');
  await page.goto('http://localhost:4321/', { timeout: 15000 });
  console.log('Homepage title:', await page.$eval('title', el => el.textContent));
  console.log('Homepage canonical:', await page.$eval('link[rel="canonical"]', el => el.getAttribute('href')).catch(() => 'NOT FOUND'));
  console.log('Homepage og:title:', await page.$eval('meta[property="og:title"]', el => el.getAttribute('content')).catch(() => 'NOT FOUND'));

  await page.goto('http://localhost:4321/blog/first-post', { timeout: 15000 });
  console.log('Post title:', await page.$eval('title', el => el.textContent));

  // === WEBGL / ANIMATION ===
  console.log('\n=== WEBGL ===');
  await page.goto('http://localhost:4321/', { timeout: 15000 });
  await page.waitForTimeout(1500);
  const canvases = await page.$$('canvas');
  console.log('Canvas count on home:', canvases.length);
  const hasWebGL = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return false;
    return !!(c.getContext('webgl') || c.getContext('webgl2'));
  });
  console.log('WebGL available:', hasWebGL ? 'YES' : 'NO');

  // === CONTENT INTEGRITY ===
  console.log('\n=== CONTENT ===');
  await page.goto('http://localhost:4321/blog/first-post', { timeout: 15000 });
  const postTitle = await page.$eval('h1', el => el.textContent).catch(() => 'NOT FOUND');
  console.log('Post h1:', postTitle);

  await page.goto('http://localhost:4321/tools/claude-code', { timeout: 15000 });
  const toolName = await page.$eval('h1', el => el.textContent).catch(() => 'NOT FOUND');
  console.log('Tool h1:', toolName);

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
