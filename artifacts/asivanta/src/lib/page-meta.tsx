import { useEffect } from "react";
import routeMeta from "../../route-meta.json";

export const PAGE_META = routeMeta;

export type PageMetaKey = keyof typeof PAGE_META;

function setMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    const [name, key] = attribute.split("=");
    element.setAttribute(name, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

export function PageMeta({ page }: { page: PageMetaKey }) {
  useEffect(() => {
    const meta = PAGE_META[page];
    const url = `https://asivanta.com${meta.path}`;
    document.title = meta.title;
    setMeta('meta[name="robots"]', "name=robots", "index,follow,max-image-preview:large");
    setMeta('meta[name="description"]', "name=description", meta.description);
    setMeta('meta[property="og:title"]', "property=og:title", meta.title);
    setMeta('meta[property="og:description"]', "property=og:description", meta.description);
    setMeta('meta[property="og:url"]', "property=og:url", url);
    setMeta('meta[property="og:type"]', "property=og:type", "website");
    setMeta('meta[name="twitter:card"]', "name=twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name=twitter:title", meta.title);
    setMeta('meta[name="twitter:description"]', "name=twitter:description", meta.description);
    setCanonical(url);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  return null;
}
