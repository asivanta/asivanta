import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = join(root, "artifacts", "asivanta");
const outputRoot = join(appRoot, "dist", "public");

function replace(html, pattern, replacement, label) {
  const found = pattern instanceof RegExp ? pattern.test(html) : html.includes(pattern);
  if (!found) throw new Error(`Could not find ${label} in built index.html`);
  return html.replace(pattern, replacement);
}

export function renderRouteHtml(template, meta) {
  const url = `https://asivanta.com${meta.path}`;
  let html = template;
  html = replace(html, /<title>[^<]*<\/title>/, `<title>${meta.title}</title>`, "title");
  html = replace(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${meta.description}" />`, "description");
  html = replace(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${meta.title}" />`, "Open Graph title");
  html = replace(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${meta.description}" />`, "Open Graph description");
  html = replace(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, "Open Graph URL");
  html = replace(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${meta.title}" />`, "Twitter title");
  html = replace(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${meta.description}" />`, "Twitter description");
  html = replace(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, "canonical URL");
  return html;
}

export async function generateStaticPages() {
  const [template, manifestText] = await Promise.all([
    readFile(join(outputRoot, "index.html"), "utf8"),
    readFile(join(appRoot, "route-meta.json"), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);

  await Promise.all(Object.values(manifest).map((meta) => {
    const output = meta.path === "/" ? "index.html" : `${meta.path.slice(1)}.html`;
    return writeFile(join(outputRoot, output), renderRouteHtml(template, meta));
  }));

  const notFoundMeta = {
    title: "Page Not Found | Asivanta",
    description: "The requested page is not part of the public Asivanta site.",
    path: "/404",
  };
  let notFoundHtml = renderRouteHtml(template, notFoundMeta);
  notFoundHtml = replace(
    notFoundHtml,
    /<meta name="robots" content="[^"]*"\s*\/?>/,
    '<meta name="robots" content="noindex,follow" />',
    "robots directive",
  );
  notFoundHtml = replace(
    notFoundHtml,
    '<div id="root"></div>',
    '<div id="root"><main><h1>Page not found</h1><p>The page you requested is not part of the public Asivanta site.</p><a href="/">Return home</a></main></div>',
    "application root",
  );
  await writeFile(join(outputRoot, "404.html"), notFoundHtml);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await generateStaticPages();
}
