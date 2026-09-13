#!/usr/bin/env node
/**
 * Read-only SEO smoke test. Requires Node.js 20 or later; no packages or credentials.
 *
 * Production: node scripts/audit-seo.mjs https://www.levon.blog
 * Local build with production metadata:
 *   node scripts/audit-seo.mjs http://localhost:3000 --expected-origin https://www.levon.blog
 * Preview: node scripts/audit-seo.mjs https://dev.example.amplifyapp.com --preview
 * Add --json for a machine-readable report. A failed check exits with status 1.
 */

const HELP = `Usage: node scripts/audit-seo.mjs <base-origin> [options]

Options:
  --expected-origin <origin>  Expected canonical/sitemap origin (defaults to base)
  --preview                   Require noindex and robots.txt crawl blocking
  --concurrency <1-8>          Parallel requests (default: 4)
  --timeout <milliseconds>     Per-request timeout (default: 15000; max: 60000)
  --max-pages <1-1000>         Maximum sitemap URLs (default: 200)
  --skip-legacy               Skip this repository's legacy redirect contracts
  --json                      Print JSON instead of the readable report
  --help                      Show this help

Only base-origin is fetched. Sitemap URLs on expected-origin are mapped to base-origin
so a local build can be audited without making requests to the production website.
Cross-origin redirects are reported, never followed. No HTML or response headers
are included in the report. The audit makes GET requests and changes no site data.`;

const options = {
  concurrency: 4,
  timeout: 15_000,
  maxPages: 200,
  preview: false,
  json: false,
  skipLegacy: false,
};

function originArgument(value, name) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || url.pathname !== '/') {
    throw new Error(`${name} must be an HTTP(S) origin without credentials, a path, or a query.`);
  }
  return url.origin;
}

function integerArgument(value, name, maximum) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > maximum) {
    throw new Error(`${name} must be an integer from 1 to ${maximum}.`);
  }
  return number;
}

function parseArguments() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || !args.length) {
    console.log(HELP);
    process.exit(args.length ? 0 : 2);
  }
  options.baseOrigin = originArgument(args.shift(), 'base-origin');
  while (args.length) {
    const argument = args.shift();
    switch (argument) {
      case '--expected-origin':
        options.expectedOrigin = originArgument(args.shift(), argument);
        break;
      case '--concurrency':
        options.concurrency = integerArgument(args.shift(), argument, 8);
        break;
      case '--timeout':
        options.timeout = integerArgument(args.shift(), argument, 60_000);
        break;
      case '--max-pages':
        options.maxPages = integerArgument(args.shift(), argument, 1_000);
        break;
      case '--preview': options.preview = true; break;
      case '--json': options.json = true; break;
      case '--skip-legacy': options.skipLegacy = true; break;
      default: throw new Error(`Unknown option: ${argument}`);
    }
  }
  options.expectedOrigin ||= options.baseOrigin;
}

const report = { checkedAt: new Date().toISOString(), pages: [], failures: [], warnings: [] };
const fail = (url, message) => report.failures.push({ url, message });
const warn = (url, message) => report.warnings.push({ url, message });
function urlAtOrigin(path, origin) {
  const url = new URL(origin);
  // Assigning pathname prevents a path beginning with // from selecting a host.
  url.pathname = path;
  return url.href;
}
const expectedUrl = (path) => urlAtOrigin(path, options.expectedOrigin);
const requestUrl = (path) => urlAtOrigin(path, options.baseOrigin);

function decodeEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
    if (!entity.startsWith('#')) return named[entity.toLowerCase()] ?? match;
    const point = entity[1].toLowerCase() === 'x'
      ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

function textContent(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function elements(html, name) {
  return Array.from(html.matchAll(new RegExp(`<${name}\\b([^>]*)>([\\s\\S]*?)<\\/${name}\\s*>`, 'gi')));
}

async function request(path, { body = true, limit = 3_000_000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout);
  try {
    const response = await fetch(requestUrl(path), {
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'user-agent': 'LevonBlogSEOAudit/1.0', accept: 'text/html,application/xml,text/plain,*/*;q=0.1' },
    });
    let text = '';
    if (body && response.body) {
      const reader = response.body.getReader();
      const chunks = [];
      let bytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > limit) {
          await reader.cancel();
          throw new Error(`Response exceeds the ${limit}-byte audit limit.`);
        }
        chunks.push(Buffer.from(value));
      }
      text = Buffer.concat(chunks).toString('utf8');
    } else {
      await response.body?.cancel();
    }
    return { status: response.status, headers: response.headers, text };
  } finally {
    clearTimeout(timer);
  }
}

function requestFailure(error) {
  return error?.name === 'AbortError' ? `Request exceeded ${options.timeout} ms.`
    : error?.message?.startsWith('Response exceeds') ? error.message : 'Request failed.';
}

async function parallelMap(items, callback) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(options.concurrency, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await callback(item);
    }
  }));
}

function robotsGroups(text) {
  const groups = [];
  let current;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === 'user-agent') {
      if (!current || current.rules.length) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (current && ['allow', 'disallow'].includes(key) && value) {
      current.rules.push({ allow: key === 'allow', pattern: value });
    }
  }
  return groups;
}

function crawlAllowed(groups, path) {
  const specificity = (group) => Math.max(-1, ...group.agents.map((agent) =>
    agent === '*' ? 0 : 'googlebot'.includes(agent) ? agent.length : -1));
  const best = Math.max(-1, ...groups.map(specificity));
  if (best < 0) return true;
  const matches = groups.filter((group) => specificity(group) === best)
    .flatMap((group) => group.rules).filter(({ pattern }) => {
      const terminal = pattern.endsWith('$');
      const value = terminal ? pattern.slice(0, -1) : pattern;
      const expression = value.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
      return new RegExp(`^${expression}${terminal ? '$' : ''}`).test(path);
    }).sort((left, right) =>
      right.pattern.replace(/[*$]/g, '').length - left.pattern.replace(/[*$]/g, '').length ||
      Number(right.allow) - Number(left.allow));
  return matches[0]?.allow ?? true;
}

function schemaNodes(value) {
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  if (!value || typeof value !== 'object') return [];
  return [value, ...schemaNodes(value['@graph'])];
}

function hasType(node, types) {
  return [node['@type']].flat().some((type) => types.includes(type));
}

function authorHasName(author, nodes) {
  return [author].flat().some((entry) => {
    if (typeof entry === 'string') return entry.trim().length > 0;
    if (!entry || typeof entry !== 'object') return false;
    return (typeof entry.name === 'string' && Boolean(entry.name.trim())) || (entry['@id'] && nodes.some((node) =>
      node['@id'] === entry['@id'] && typeof node.name === 'string' && node.name.trim()));
  });
}

function isZonedDateTime(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/i);
  if (!match || !Number.isFinite(Date.parse(value))) return false;
  // Date.parse accepts impossible calendar days by rolling into the next month.
  const calendarDay = new Date(`${match[1]}T00:00:00Z`);
  return Number.isFinite(calendarDay.getTime()) && calendarDay.toISOString().slice(0, 10) === match[1];
}

function auditHtml(path, response, groups) {
  const url = expectedUrl(path);
  if (response.status !== 200) {
    fail(url, `Expected a direct 200 response; received ${response.status}.`);
    return;
  }
  if (!response.headers.get('content-type')?.includes('text/html')) {
    fail(url, 'Sitemap page did not return HTML.');
    return;
  }
  const document = response.text.replace(/<!--[\s\S]*?-->/g, '');
  const schema = [];
  for (const script of elements(document, 'script')) {
    if (attributes(script[1]).type?.toLowerCase() !== 'application/ld+json') continue;
    try { schema.push(...schemaNodes(JSON.parse(script[2]))); }
    catch { fail(url, 'A JSON-LD script contains invalid JSON.'); }
  }
  const html = document.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const titles = elements(html, 'title').map((match) => textContent(match[2]));
  const metas = Array.from(html.matchAll(/<meta\b[^>]*>/gi), (match) => attributes(match[0]));
  const descriptions = metas.filter((meta) => meta.name?.toLowerCase() === 'description').map((meta) => meta.content?.trim() ?? '');
  const canonicals = Array.from(html.matchAll(/<link\b[^>]*>/gi), (match) => attributes(match[0]))
    .filter((link) => link.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  const headings = elements(html, 'h1').map((match) => textContent(match[2])).filter(Boolean);
  if (titles.length !== 1 || !titles[0]) fail(url, 'Expected one nonempty page title.');
  if (descriptions.length !== 1 || !descriptions[0]) fail(url, 'Expected one nonempty meta description.');
  if (!headings.length) fail(url, 'No nonempty H1 was present in server-rendered HTML.');
  if (headings.length > 1) warn(url, `${headings.length} H1 headings found; review the heading hierarchy.`);
  if (canonicals.length !== 1 || !canonicals[0]?.href) {
    fail(url, 'Expected exactly one canonical link with an href.');
  } else {
    try {
      if (new URL(canonicals[0].href, url).href !== url) fail(url, 'Canonical does not match this sitemap URL.');
      if (!/^https?:\/\//i.test(canonicals[0].href)) warn(url, 'Canonical is relative; an absolute URL is clearer.');
    } catch { fail(url, 'Canonical is not a valid URL.'); }
  }
  const directives = [response.headers.get('x-robots-tag') ?? '', ...metas
    .filter((meta) => ['robots', 'googlebot'].includes(meta.name?.toLowerCase()))
    .map((meta) => meta.content ?? '')].join(',').toLowerCase();
  const noindex = /\b(noindex|none)\b/.test(directives);
  if (options.preview && !noindex) fail(url, 'Preview page is missing noindex.');
  if (!options.preview && noindex) fail(url, 'Production page contains a noindex directive.');
  if (groups && crawlAllowed(groups, path) === options.preview) {
    fail(url, options.preview ? 'Preview path is crawlable according to robots.txt.' : 'Googlebot is blocked by robots.txt.');
  }
  if (path === '/' || path === '/blog') {
    if (!/\blevon\b/i.test(titles[0] ?? '') || !/\bblog\b/i.test(titles[0] ?? '')) {
      fail(url, 'The page title does not identify both Levon and Blog.');
    }
  }
  if (path === '/' && !schema.some((node) => hasType(node, ['WebSite']))) {
    warn(url, 'Homepage has no WebSite structured data for site-name identification.');
  }
  if (/^\/blog\/[^/]+$/.test(path)) {
    const articles = schema.filter((node) => hasType(node, ['Article', 'BlogPosting', 'TechArticle', 'ScholarlyArticle']));
    if (!articles.length) fail(url, 'Blog article is missing Article or BlogPosting structured data.');
    for (const article of articles) {
      if (!authorHasName(article.author, schema)) fail(url, 'Article structured data is missing a named author.');
      if (typeof article.headline !== 'string' || !article.headline.trim()) fail(url, 'Article structured data is missing a headline.');
      if (!isZonedDateTime(article.datePublished)) {
        fail(url, 'Article datePublished must be a valid ISO date-time with an explicit timezone.');
      }
      if ('dateModified' in article && !isZonedDateTime(article.dateModified)) {
        fail(url, 'Article dateModified must be a valid ISO date-time with an explicit timezone.');
      }
    }
    for (const meta of metas.filter((item) => ['article:published_time', 'article:modified_time'].includes(item.property?.toLowerCase()))) {
      if (!isZonedDateTime(meta.content)) {
        fail(url, `${meta.property} must be a valid ISO date-time with an explicit timezone.`);
      }
    }
    const articleText = elements(html, 'article').map((match) => textContent(match[2])).join(' ');
    if (!/\bLevon Zhao\b/i.test(articleText)) fail(url, 'Article content has no visible Levon Zhao author attribution.');
  }
  report.pages.push({ url, status: response.status, title: titles[0] ?? '', description: descriptions[0] ?? '',
    h1Count: headings.length, noindex, schemaTypes: [...new Set(schema.flatMap((node) => [node['@type']].flat()).filter(Boolean))] });
}

async function readSitemap() {
  const sitemapUrl = expectedUrl('/sitemap.xml');
  const response = await request('/sitemap.xml', { limit: 2_000_000 });
  if (response.status !== 200) throw new Error(`Sitemap returned ${response.status}; expected a direct 200.`);
  if (!/<urlset\b/i.test(response.text) || /<sitemapindex\b/i.test(response.text)) {
    throw new Error('Expected this site\'s urlset sitemap; sitemap indexes are not supported by this audit.');
  }
  const locations = Array.from(response.text.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi), (match) => decodeEntities(match[1].trim()));
  if (!locations.length && !options.preview) fail(sitemapUrl, 'Production sitemap contains no URLs.');
  if (locations.length > options.maxPages) throw new Error(`Sitemap exceeds --max-pages (${options.maxPages}); increase the limit explicitly.`);
  const seen = new Set();
  const paths = [];
  for (const location of locations) {
    let url;
    try { url = new URL(location); }
    catch { fail(sitemapUrl, 'Sitemap contains an invalid absolute URL.'); continue; }
    if (url.origin !== options.expectedOrigin || url.username || url.password || url.search || url.hash) {
      fail(sitemapUrl, 'Sitemap contains an off-origin URL, credentials, a query, or a fragment; it was not fetched.');
      continue;
    }
    if (seen.has(url.href)) { fail(url.href, 'Duplicate URL in sitemap.'); continue; }
    seen.add(url.href);
    paths.push(url.pathname);
  }
  if (!options.preview) {
    for (const required of ['/', '/blog']) {
      if (!paths.includes(required)) fail(sitemapUrl, `Missing required sitemap route ${required}.`);
    }
  }
  return paths;
}

const LEGACY_REDIRECTS = [
  ['/chat', '/ai-companion'],
  ['/pathfinding', '/legacy/pathfinding'],
  ['/cg/Morphing', '/legacy/cg/morphing'],
  ['/cg/RayTracing', '/legacy/cg/ray-tracing'],
  ['/yolo-kan', '/legacy/yolo-kan'],
  ['/legacy/ai-chatbot', '/legacy/chatbot'],
  ['/legacy/computer-graphics', '/legacy/cg'],
  ['/Research/Levon_Poster.pdf', '/media/research/levon-yolo-kan-poster.pdf'],
];

async function auditLegacy([path, destination]) {
  const url = expectedUrl(path);
  try {
    const response = await request(path, { body: false });
    if (![301, 308].includes(response.status)) {
      fail(url, `Legacy URL must permanently redirect; received ${response.status}.`);
      return;
    }
    const location = response.headers.get('location');
    let target;
    try { target = new URL(location, requestUrl(path)); }
    catch { fail(url, 'Legacy redirect has no valid Location.'); return; }
    if (!location || ![options.baseOrigin, options.expectedOrigin].includes(target.origin) ||
        target.pathname !== destination || target.search || target.hash) {
      fail(url, `Legacy redirect does not preserve its expected destination ${destination}.`);
      return;
    }
    const final = await request(destination, { body: false });
    if (final.status !== 200) fail(url, `Legacy destination returned ${final.status}; expected a direct 200.`);
  } catch (error) { fail(url, requestFailure(error)); }
}

function findDuplicateMetadata() {
  for (const property of ['title', 'description']) {
    const values = new Map();
    for (const page of report.pages) {
      if (!page[property]) continue;
      const normalized = page[property].toLowerCase();
      const other = values.get(normalized);
      if (other) warn(page.url, `Duplicate ${property} also used by ${other}.`);
      else values.set(normalized, page.url);
    }
  }
}

async function main() {
  parseArguments();
  Object.assign(report, { baseOrigin: options.baseOrigin, expectedOrigin: options.expectedOrigin,
    mode: options.preview ? 'preview' : 'production' });
  let groups;
  try {
    const robots = await request('/robots.txt', { limit: 100_000 });
    if (robots.status !== 200) fail(expectedUrl('/robots.txt'), `Expected 200; received ${robots.status}.`);
    else {
      groups = robotsGroups(robots.text);
      const sitemapDeclarations = Array.from(robots.text.matchAll(/^\s*sitemap\s*:\s*(\S+)\s*$/gim), (match) => match[1]);
      if (!sitemapDeclarations.includes(expectedUrl('/sitemap.xml'))) {
        fail(expectedUrl('/robots.txt'), 'Missing sitemap declaration for the expected origin.');
      }
    }
  } catch (error) { fail(expectedUrl('/robots.txt'), requestFailure(error)); }
  let paths = [];
  try { paths = await readSitemap(); }
  catch (error) { fail(expectedUrl('/sitemap.xml'), error.message.startsWith('Sitemap') || error.message.startsWith('Expected') ? error.message : requestFailure(error)); }
  // Probe the core pages even if the sitemap itself failed or a preview omits URLs.
  await parallelMap([...new Set([...paths, '/', '/blog'])], async (path) => {
    try { auditHtml(path, await request(path), groups); }
    catch (error) { fail(expectedUrl(path), requestFailure(error)); }
  });
  if (!options.skipLegacy) await parallelMap(LEGACY_REDIRECTS, auditLegacy);
  const missingPath = `/seo-audit-not-found-${crypto.randomUUID()}`;
  try {
    const missing = await request(missingPath, { body: false });
    if (missing.status !== 404) fail(expectedUrl('/[unknown-route]'), `Unknown page returned ${missing.status}; expected a real 404.`);
  } catch (error) { fail(expectedUrl('/[unknown-route]'), requestFailure(error)); }
  report.pages.sort((left, right) => left.url.localeCompare(right.url));
  findDuplicateMetadata();
  report.summary = { sitemapPages: paths.length, auditedPages: report.pages.length,
    failures: report.failures.length, warnings: report.warnings.length, passed: report.failures.length === 0 };
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`SEO audit: ${options.baseOrigin} (${report.mode})`);
    if (options.expectedOrigin !== options.baseOrigin) console.log(`Expected canonical origin: ${options.expectedOrigin}`);
    console.log(`${report.summary.auditedPages} HTML pages checked; ${report.summary.failures} failures; ${report.summary.warnings} warnings.`);
    for (const issue of report.failures) console.log(`FAIL ${issue.url} — ${issue.message}`);
    for (const issue of report.warnings) console.log(`WARN ${issue.url} — ${issue.message}`);
    if (report.summary.passed) console.log('PASS: all required checks passed. Rankings and index inclusion still require Search Console evidence.');
  }
  process.exitCode = report.summary.passed ? 0 : 1;
}

main().catch((error) => {
  console.error(`SEO audit could not run: ${error.message}`);
  process.exitCode = 2;
});
