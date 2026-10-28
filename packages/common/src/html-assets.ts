import { v4 as uuid } from '@lukeed/uuid/secure';

// Library assets in element HTML (images, media, file links) keep a
// storage:// URL and an id; the element lists them in data.assets as
// `assetUrls.<id>`, and runtimes resolve each entry to a signed URL at
// data.assetUrls[<id>]. The helpers that read or write HTML use the DOM, so
// they run in the browser only.

export const STORAGE_PROTOCOL = 'storage://';
const ASSET_ID_ATTRIBUTE = 'data-asset-id';

const ASSET_SELECTOR = `[${ASSET_ID_ATTRIBUTE}]`;

export const isStorageUrl = (url?: string | null): boolean =>
  !!url?.startsWith(STORAGE_PROTOCOL);

// Id for a new library asset; dashes keep it from being read as an
// array index in the `assetUrls.<id>` path
export const createAssetId = (): string => uuid();

export const getAssetDataPath = (id: string): string => `assetUrls.${id}`;

const parse = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html');

// Links point at their file with href; img, video, audio and source with src
const getUrlAttribute = (el: Element) => (el.tagName === 'A' ? 'href' : 'src');

/**
 * Lists the library assets in the HTML as `assetUrls.<id>` -> storage://
 * URI, the shape data.assets expects.
 */
export const collectHtmlAssets = (html: string): Record<string, string> => {
  const assets: Record<string, string> = {};
  if (!html.includes(ASSET_ID_ATTRIBUTE)) return assets;
  parse(html)
    .querySelectorAll(ASSET_SELECTOR)
    .forEach((el) => {
      const url = el.getAttribute(getUrlAttribute(el));
      if (!isStorageUrl(url)) return;
      assets[getAssetDataPath(el.getAttribute(ASSET_ID_ATTRIBUTE))] = url;
    });
  return assets;
};

/**
 * Returns the HTML with each library asset pointing at its signed URL,
 * for display only; the result must never be saved.
 */
export const resolveHtmlAssets = (
  html: string,
  assetUrls: Record<string, string> = {},
): string => {
  if (!html.includes(ASSET_ID_ATTRIBUTE)) return html;
  const doc = parse(html);
  doc.querySelectorAll(ASSET_SELECTOR).forEach((el) => {
    const url = assetUrls[el.getAttribute(ASSET_ID_ATTRIBUTE)];
    if (url) el.setAttribute(getUrlAttribute(el), url);
  });
  return doc.body.innerHTML;
};
