import { useEffect } from 'react';
import { SEO_DEFAULTS, SITE_URL } from '@/config/site';

interface SeoOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSeo(opts: SeoOptions = {}): void {
  useEffect(() => {
    const title = opts.title ?? SEO_DEFAULTS.title;
    const description = opts.description ?? SEO_DEFAULTS.description;
    const path = opts.path ?? window.location.pathname;
    const canonical = new URL(path, SITE_URL).toString();
    const ogImage = new URL(opts.ogImage ?? SEO_DEFAULTS.ogImage, SITE_URL).toString();

    document.title = title;
    setMeta('description', description);
    setMeta('robots', opts.noindex ? 'noindex,nofollow' : 'index,follow');
    setCanonical(canonical);

    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:site_name', 'FRAN GC', 'property');
    setMeta('og:locale', 'es_CL', 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);
  }, [opts.title, opts.description, opts.path, opts.ogImage, opts.noindex]);
}
