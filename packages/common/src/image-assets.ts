import { v4 as uuid } from '@lukeed/uuid/secure';

// Library images in element HTML keep a storage:// src and an id; the
// element lists them in data.assets as `imageUrls.<id>`, and runtimes
// resolve each entry to a signed URL at data.imageUrls[<id>]. The helpers that read or
// write HTML use the DOM, so they run in the browser only.

export const STORAGE_PROTOCOL = 'storage://';
export const ASSET_ID_ATTRIBUTE = 'data-asset-id';

const IMAGE_SELECTOR = `img[${ASSET_ID_ATTRIBUTE}]`;

export interface ImageAsset {
  // storage:// URI for library images, or an external URL
  url: string;
  name?: string;
  // Set for library images; see createImageAssetId
  assetId?: string | null;
}

export const isStorageUrl = (url?: string | null): boolean =>
  !!url?.startsWith(STORAGE_PROTOCOL);

// Id for a new library image; dashes keep it from being read as an
// array index in the `imageUrls.<id>` path
export const createImageAssetId = (): string => uuid();

export const getImageDataPath = (id: string): string => `imageUrls.${id}`;

const parse = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html');

/**
 * Lists the library images in the HTML as `images.<id>` -> storage:// URI,
 * the shape data.assets expects.
 */
export const collectImageAssets = (html: string): Record<string, string> => {
  const assets: Record<string, string> = {};
  if (!html.includes(ASSET_ID_ATTRIBUTE)) return assets;
  parse(html)
    .querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR)
    .forEach((img) => {
      const src = img.getAttribute('src');
      if (!isStorageUrl(src)) return;
      assets[getImageDataPath(img.getAttribute(ASSET_ID_ATTRIBUTE))] = src;
    });
  return assets;
};

/**
 * Returns the HTML with each library image pointing at its signed URL,
 * for display only; the result must never be saved.
 */
export const resolveImages = (
  html: string,
  imageUrls: Record<string, string> = {},
): string => {
  if (!html.includes(ASSET_ID_ATTRIBUTE)) return html;
  const doc = parse(html);
  doc.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR).forEach((img) => {
    const url = imageUrls[img.getAttribute(ASSET_ID_ATTRIBUTE)];
    if (url) img.src = url;
  });
  return doc.body.innerHTML;
};

/**
 * Markup for a picked image. Attribute values are escaped by the DOM.
 */
export const createImageHtml = ({
  url,
  name = '',
  assetId,
}: ImageAsset): string => {
  const img = document.createElement('img');
  if (assetId) img.setAttribute(ASSET_ID_ATTRIBUTE, assetId);
  img.setAttribute('src', url);
  img.setAttribute('alt', name);
  return img.outerHTML;
};
