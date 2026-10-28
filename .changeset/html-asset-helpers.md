---
'@tailor-cms/cek-common': patch
---

Rename the HTML image helpers so they cover any library asset: `collectImageAssets` → `collectHtmlAssets`, `resolveImages` → `resolveHtmlAssets`, `createImageAssetId` → `createAssetId`, `getImageDataPath` → `getAssetDataPath`, and `data.imageUrls` → `data.assetUrls`. They now handle every element with a `data-asset-id`, reading `href` on links and `src` elsewhere.
