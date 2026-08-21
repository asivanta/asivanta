import { useEffect } from "react";

const DESCRIPTION_SELECTOR = 'meta[name="description"]';

function setMetaByName(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Sets the per-route document title and description so every page no longer
 * shares the single title shipped in index.html. Also keeps the Open Graph and
 * Twitter card text in sync for link previews.
 */
export function useSeo(
  title: string,
  description: string,
  options: { index?: boolean } = {},
) {
  useEffect(() => {
    document.title = title;

    const existing =
      document.head.querySelector<HTMLMetaElement>(DESCRIPTION_SELECTOR);
    const previousDescription = existing?.getAttribute("content") ?? null;
    const previousRobots =
      document.head
        .querySelector<HTMLMetaElement>('meta[name="robots"]')
        ?.getAttribute("content") ?? null;

    setMetaByName("description", description);
    setMetaByProperty("og:title", title);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", window.location.href);
    setMetaByName("twitter:title", title);
    setMetaByName("twitter:description", description);
    setMetaByName(
      "robots",
      options.index === false ? "noindex, nofollow" : "index, follow",
    );
    setCanonical(`${window.location.origin}${window.location.pathname}`);

    return () => {
      if (previousDescription !== null) {
        setMetaByName("description", previousDescription);
      }
      if (previousRobots !== null) {
        setMetaByName("robots", previousRobots);
      }
    };
  }, [title, description, options.index]);
}

export default useSeo;
