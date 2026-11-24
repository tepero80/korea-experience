import fs from 'node:fs';
import path from 'node:path';
import { parse, type DefaultTreeAdapterTypes as Tree } from 'parse5';

const root = path.resolve('out');
const report = path.resolve('.private/reports/article-map-links-latest.json');
const nearbyTags = new Set(['p', 'li', 'td', 'tr', 'dd']);
type Provider = 'naver' | 'kakao' | 'google';
type MapLink = { provider: Provider; href: string; query: string | null };

function* descendants(node: Tree.Node): Generator<Tree.Node> {
  yield node;
  if ('childNodes' in node) {
    for (const child of node.childNodes) yield* descendants(child);
  }
}

function attribute(node: Tree.Element, name: string) {
  return node.attrs.find((item) => item.name === name)?.value;
}

function isElement(node: Tree.Node): node is Tree.Element {
  return 'tagName' in node;
}

function readMapLink(href?: string): MapLink | undefined {
  if (!href?.startsWith('https://')) return;
  try {
    const url = new URL(href);
    const { hostname, pathname } = url;
    if (hostname === 'map.naver.com' || hostname === 'naver.me') {
      if (hostname === 'map.naver.com' && pathname === '/') return;
      const match = pathname.match(/^\/(?:p|v5)\/search\/([^/]+)/);
      return { provider: 'naver', href, query: match ? decodeURIComponent(match[1]) : null };
    }
    if (hostname === 'map.kakao.com' || hostname === 'kko.to') {
      if (hostname === 'map.kakao.com' && pathname === '/') return;
      const place = pathname.match(/^\/link\/search\/([^/]+)/);
      const coordinates = pathname.match(/^\/link\/map\/.*?,(-?\d+\.?\d*,-?\d+\.?\d*)$/);
      return { provider: 'kakao', href, query: place ? decodeURIComponent(place[1]) : coordinates?.[1] ?? null };
    }
    if (
      (hostname === 'www.google.com' && pathname.startsWith('/maps')) ||
      hostname === 'maps.google.com' || hostname === 'maps.app.goo.gl'
    ) return { provider: 'google', href, query: url.searchParams.get('query') ?? url.searchParams.get('q') };
  } catch {
    // Invalid and non-HTTPS markup is handled by the export link audit.
  }
}

function nearestDirectionsBlock(anchor: Tree.Element, body: Tree.Element) {
  let block = anchor.parentNode;
  while (block && isElement(block) && block !== body && !nearbyTags.has(block.tagName)) block = block.parentNode;
  return block && isElement(block) && block.tagName === 'td' ? block.parentNode : block;
}

function normalize(query: string) {
  return query.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'content-catalog.json'), 'utf8')) as { slug: string }[];
const findings: { slug: string; text: string; status: 'missing-nearby-google' | 'check-equivalence'; links: MapLink[] }[] = [];
let articlesWithDirections = 0;
let directionBlocks = 0;

for (const { slug } of catalog) {
  const document = parse(fs.readFileSync(path.join(root, 'blog', `${slug}.html`), 'utf8'));
  const article = [...descendants(document)].find((node) =>
    isElement(node) && node.tagName === 'article' && attribute(node, 'class')?.split(/\s+/).includes('article-body'),
  );
  if (!article || !isElement(article)) continue;
  const groups = new Map<Tree.ParentNode, MapLink[]>();
  for (const anchor of descendants(article)) {
    if (!isElement(anchor) || anchor.tagName !== 'a') continue;
    const link = readMapLink(attribute(anchor, 'href'));
    const block = nearestDirectionsBlock(anchor, article);
    if (link && block) groups.set(block, [...(groups.get(block) ?? []), link]);
  }
  if (groups.size) articlesWithDirections++;
  for (const [block, links] of groups) {
    directionBlocks++;
    const count = (provider: Provider) => links.filter((link) => link.provider === provider).length;
    const google = new Set(links.flatMap((link) => link.provider === 'google' && link.query ? [normalize(link.query)] : []));
    const local = links.filter((link) => link.provider !== 'google');
    const missing = Math.max(count('naver'), count('kakao')) > count('google');
    if (!missing && local.every((link) => link.query && google.has(normalize(link.query)))) continue;
    const text = [...descendants(block)].map((node) => 'value' in node ? node.value : '').join('').replace(/\s+/g, ' ').trim().slice(0, 280);
    findings.push({ slug, text, status: missing ? 'missing-nearby-google' : 'check-equivalence', links });
  }
}

fs.mkdirSync(path.dirname(report), { recursive: true });
const summary = {
  at: new Date().toISOString(), guides: catalog.length, articlesWithDirections, directionBlocks,
  missingNearbyGoogle: findings.filter((item) => item.status === 'missing-nearby-google').length,
  checkEquivalence: findings.filter((item) => item.status === 'check-equivalence').length,
};
fs.writeFileSync(report, JSON.stringify({ ...summary, scope: 'Rendered article-body blocks. Generic map homepages and template map panels are outside this check. Results are review leads; exact input matching does not verify a provider’s resolved place.', findings }, null, 2) + '\n');
console.log(JSON.stringify(summary));
