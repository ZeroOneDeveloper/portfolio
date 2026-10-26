import type { BeforeSendEvent } from '@vercel/analytics';

/** Only published URLs on the production host; never retain query/hash or custom events. */
export function filterBlogEvent(event: BeforeSendEvent, paths: string[]): BeforeSendEvent | null {
 if (event.type !== 'pageview') return null;
 try {
  const url = new URL(event.url);
  if (url.protocol !== 'https:' || !['www.zero0ne.dev', 'zero0ne.dev'].includes(url.hostname) || url.port || url.username || url.password) return null;
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  if (pathname !== '/blog' && !paths.includes(pathname)) return null;
  return { type: 'pageview', url: url.origin + pathname };
 } catch { return null; }
}
