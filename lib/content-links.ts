export function internalGuideLinks(markdown: string) {
  const links: string[] = [];
  for (const m of markdown.matchAll(/(?:\]\(|href=["'])([^\s)"'<>]+)/g)) {
    try {
      const url = new URL(m[1], 'https://koreaexperience.com');
      if (url.origin !== 'https://koreaexperience.com') continue;
      const match = url.pathname.match(/^\/blog\/([a-z0-9-]+)\/?$/);
      if (match && !['category', 'page'].includes(match[1])) links.push(match[1]);
    } catch {
      /* An invalid URL is handled separately by the content review. */
    }
  }
  return [...new Set(links)];
}
