import fs from 'node:fs';
import path from 'node:path';
import { parse, type DefaultTreeAdapterTypes as Tree } from 'parse5';
const root = path.resolve('out');
const base = 'https://koreaexperience.com';
const baseline = process.argv.includes('--baseline');
const files: string[] = [];
function scan(dir: string) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) scan(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
}
scan(root);
type Page = {
  file: string;
  url: string;
  ids: Set<string>;
  links: string[];
  images: string[];
  rawMarkdown: string[];
  duplicateIds: string[];
  unrenderedComponents: string[];
  titleHeadings: number;
};
const pages = new Map<string, Page>();
for (const file of files) {
  const url =
    file === path.join(root, 'index.html')
      ? '/'
      : '/' +
        path
          .relative(root, file)
          .replaceAll(path.sep, '/')
          .replace(/\.html$/, '');
  const page: Page = {
    file,
    url,
    ids: new Set(),
    links: [],
    images: [],
    rawMarkdown: [],
    duplicateIds: [],
    unrenderedComponents: [],
    titleHeadings: 0,
  };
  const walk = (node: Tree.Node, skipText = false) => {
    if ('tagName' in node) {
      if (node.tagName === 'h1') page.titleHeadings++;
      if (['experttip', 'statcard', 'locationcard', 'pricetable'].includes(node.tagName))
        page.unrenderedComponents.push(node.tagName);
      const attrs = Object.fromEntries(node.attrs.map((a) => [a.name, a.value]));
      if (attrs.id) {
        if (page.ids.has(attrs.id)) page.duplicateIds.push(attrs.id);
        page.ids.add(attrs.id);
      }
      if (node.tagName === 'a' && attrs.href) page.links.push(attrs.href);
      if (node.tagName === 'img' && attrs.src) {
        page.images.push(attrs.src);
        for (const src of attrs.srcset?.split(',').map((s) => s.trim().split(/\s+/)[0]) || [])
          page.images.push(src);
      }
      skipText ||= ['script', 'style', 'pre', 'code', 'textarea'].includes(node.tagName);
    }
    if (node.nodeName === '#text' && 'value' in node && !skipText)
      page.rawMarkdown.push(
        ...(node.value.match(/\[[^\]\n]{1,180}\]\((?:https?:\/\/|\/blog\/)[^)]+\)/g) || []),
      );
    if ('childNodes' in node) for (const c of node.childNodes) walk(c, skipText);
  };
  walk(parse(fs.readFileSync(file, 'utf8')));
  pages.set(url, page);
}
const redirects = new Map(
  fs
    .readFileSync('out/_redirects', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [from, to] = line.split(/\s+/);
      return [from, to];
    }),
);
const errors: { page: string; type: string; target: string }[] = [];
const external = new Set<string>(),
  dynamic = new Set<string>();
const resolve = (pathname: string) => {
  let target = pathname.replace(/\/$/, '') || '/';
  for (let i = 0; i < 5 && redirects.has(target); i++) target = redirects.get(target)!;
  return target;
};
for (const p of pages.values()) {
  if (/^\/blog\/[^/]+$/.test(p.url) && p.titleHeadings !== 1)
    errors.push({
      page: p.url,
      type: 'article-title-heading-count',
      target: String(p.titleHeadings),
    });
  for (const [kind, targets] of [
    ['link', p.links],
    ['image', p.images],
  ] as const)
    for (const target of targets) {
      let u: URL;
      try {
        u = new URL(target, base + p.url);
      } catch {
        errors.push({ page: p.url, type: 'invalid-' + kind, target });
        continue;
      }
      if (!['http:', 'https:'].includes(u.protocol)) continue;
      if (u.origin !== base) {
        external.add(u.href);
        continue;
      }
      if (/^\/(api|community)(\/|$)/.test(u.pathname)) {
        dynamic.add(u.pathname);
        continue;
      }
      let pathname: string;
      try {
        pathname = decodeURIComponent(u.pathname);
      } catch {
        errors.push({ page: p.url, type: 'invalid-encoding', target });
        continue;
      }
      const resolved = resolve(pathname),
        article = pages.get(resolved);
      const asset = path.resolve(root, '.' + resolved);
      if (
        !article &&
        (!asset.startsWith(root + path.sep) ||
          !fs.existsSync(asset) ||
          !fs.statSync(asset).isFile())
      ) {
        errors.push({ page: p.url, type: 'missing-' + kind, target });
        continue;
      }
      if (kind === 'link' && article && u.hash) {
        let anchor;
        try {
          anchor = decodeURIComponent(u.hash.slice(1));
        } catch {
          anchor = u.hash.slice(1);
        }
        if (!article.ids.has(anchor)) errors.push({ page: p.url, type: 'missing-anchor', target });
      }
    }
  for (const text of p.rawMarkdown)
    errors.push({ page: p.url, type: 'unrendered-markdown-link', target: text });
  for (const tag of p.unrenderedComponents)
    errors.push({ page: p.url, type: 'unrendered-evidence-component', target: tag });
}
const blockers = errors;
const report = {
  at: new Date().toISOString(),
  baseline,
  pages: pages.size,
  renderedLinks: [...pages.values()].reduce((n, p) => n + p.links.length, 0),
  externalLinks: [...external],
  dynamicRoutesNeedingWorkerChecks: [...dynamic],
  errors,
  blockingErrors: blockers,
  duplicateIds: [...pages.values()]
    .filter((p) => p.duplicateIds.length)
    .map((p) => ({ page: p.url, ids: p.duplicateIds })),
};
fs.mkdirSync('.private/reports', { recursive: true });
fs.writeFileSync(
  `.private/reports/export-links-${baseline ? 'baseline' : 'latest'}.json`,
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    {
      pages: report.pages,
      links: report.renderedLinks,
      errors: errors.length,
      blockers: blockers.length,
      examples: errors.slice(0, 12),
    },
    null,
    2,
  ),
);
if (!baseline && blockers.length) process.exit(1);
