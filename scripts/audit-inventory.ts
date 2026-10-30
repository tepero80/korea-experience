import { internalGuideLinks } from '../lib/content-links';
import fs from 'node:fs';
import { getAllPosts, getPostBySlug } from '../lib/posts';
const posts = getAllPosts();
const inventory = posts.map((p) => {
  const body = getPostBySlug(p.slug)!.content;
  const sources = [...body.matchAll(/https?:\/\/[^\s)"'<>]+/g)].map((m) => m[0]);
  const internal = internalGuideLinks(body);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    legacyCategory: p.legacyCategory,
    published: p.date,
    updated: p.updated,
    checkedAt: p.checkedAt,
    reviewed: p.reviewed,
    words: body.split(/\s+/).length,
    sourceLinks: [...new Set(sources)],
    brokenInternal: [...new Set(internal.filter((s) => !posts.some((p) => p.slug === s)))],
    legacyRisk:
      !p.reviewed &&
      /medical|clinic|surgery|treatment|visa|tax|allerg|medication|emergen/i.test(p.title),
    retirement: 'hold — indexing, actual usage, backlinks and season/journey evidence required',
  };
});
const report = {
  at: new Date().toISOString(),
  published: posts.length,
  reviewed: posts.filter((p) => p.reviewed).length,
  archive: posts.filter((p) => !p.reviewed).length,
  legacyRisk: inventory.filter((p) => p.legacyRisk).length,
  brokenLinkArticles: inventory.filter((p) => p.brokenInternal.length).length,
  inventory,
};
fs.mkdirSync('.private/reports', { recursive: true });
fs.writeFileSync('.private/reports/content-inventory.json', JSON.stringify(report, null, 2));
console.log({
  published: report.published,
  reviewed: report.reviewed,
  archive: report.archive,
  legacyRisk: report.legacyRisk,
  brokenLinkArticles: report.brokenLinkArticles,
});
