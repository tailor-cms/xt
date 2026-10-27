# File storage

::: tip Info
Available in version >=0.1.0
:::

## TailorFileInput component

Use the globally available `TailorFileInput` component for file upload and
URL import. It provides a button-mode picker with drag & drop upload dialog,
optional URL import tab, and auto-detection of asset type from extensions.

See the [Global Components](/global-components#tailorfileinput) page for full
props, events, and usage examples.

The legacy `TailorAssetInput` is still available for backward compatibility.

## Direct file upload

For custom upload UI, inject `$storageService` and pass an array of
[File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects to the
`upload` method:

```vue
<template>
  <VFileInput
    accept="image/png, image/jpeg"
    label="Set background"
    @change="upload"
  />
</template>

<script setup lang="ts">
import type { InputFileEvent, StorageApi } from '@tailor-cms/cek-common';
import { inject } from 'vue';
import { Element, ElementData } from 'tce-manifest';

const storageService = inject('$storageService') as StorageApi;

const props = defineProps<{ element: Element }>();
const emit = defineEmits<{ save: [data: ElementData] }>();

const upload = (file: File) => {
  return storageService.upload(file).then(({ key, url }) => {
    emit('save', {
      ...props.element.data,
      assets: { backgroundUrl: url },
    });
  });
};
</script>
```

After we upload the assets, we receive:

- `key`; image storage key
- `url`; internal url, used to identify Tailor managed static assets
- `publicUrl`; used to access asset from the outside world (when using Tailor
  AWS S3 provider, this maps to asset url signed with a temporary access token).

Since `publicUrl` is going to expire at some point (with the production provider),
there needs to be a mechanism in place which will make sure to process all
static assets upon need. As mentioned in the
[State section](/state#data-assets-property)
there is a special `data.assets` property, where all static assets handled
by the `Content Element` need to be declared. In the example above, we assign
internal url value to `assets.backgroundUrl`. Once fetched for delivery,
default asset processing will make sure to assign resolved public
`backgroundUrl` to the `element.data` property. The same mechanism needs to be
implemented by the consumer of the `Display package`.

The `key` of the asset declared within the `assets` object should be set to the
target location within the `element.data` property. As an example,
declaring `x.y` key will result with the resolved url assigned to the
`data.x.y` (it is possible to target nested values).

## Images inside HTML

Elements that store HTML, such as a rich text editor, can hold any number of
library images. Each one keeps its permanent `storage://` URL in the HTML
and gets an id, so the element can declare it in `data.assets` like any
other asset:

```js
{
  content: '<p>Revenue grew 12%.</p><img data-asset-id="4f8e2c1a-…" src="storage://repository/5/assets/6b90c9e1__chart.png" alt="chart.png">',
  assets: {
    'images.4f8e2c1a-…': 'storage://repository/5/assets/6b90c9e1__chart.png'
  }
}
```

On read, the runtime signs each entry and writes it to the path in its key,
so the element receives `data.images['4f8e2c1a-…']` with a signed URL. The
HTML itself never contains a signed URL, so nothing that expires is saved.

`@tailor-cms/cek-common` provides the helpers. Those that read or write HTML
use the DOM and run in the browser only.

| Helper | Use |
|---|---|
| `createImageAssetId()` | A new id for a library image |
| `createImageHtml({ url, name, assetId })` | `<img>` markup for a picked image, with `data-asset-id` when an id is given |
| `collectImageAssets(html)` | `data.assets` for the HTML: `images.<id>` to `storage://` URL |
| `resolveImages(html, images)` | The HTML with each library image pointing at its signed URL, for display only |
| `isStorageUrl(url)`, `getImageAssetPath(id)` | The `storage://` check and the `images.<id>` key |
| `STORAGE_PROTOCOL`, `ASSET_ID_ATTRIBUTE` | `'storage://'` and `'data-asset-id'` |

Insert images with [`TailorAssetPicker`](/global-components#tailorassetpicker),
and rebuild `assets` from the HTML on every save:

```vue
<template>
  <VBtn text="Insert image" @click="isPickerOpen = true" />
  <TailorAssetPicker
    v-model="isPickerOpen"
    :allowed-extensions="['.png', '.jpg', '.jpeg']"
    heading="Insert image"
    allow-url-source
    @select="insert"
    @upload="insert"
  />
</template>

<script setup lang="ts">
import {
  collectImageAssets,
  createImageAssetId,
  createImageHtml,
  isStorageUrl,
} from '@tailor-cms/cek-common';
import { omit } from 'lodash-es';
import { ref } from 'vue';
import type { Element, ElementData } from 'tce-manifest';

const props = defineProps<{ element: Element }>();
const emit = defineEmits<{ save: [data: ElementData] }>();

const isPickerOpen = ref(false);

// Appends for brevity; an editor would insert at the cursor
const insert = (asset: { url: string; name?: string }) => {
  const assetId = isStorageUrl(asset.url) ? createImageAssetId() : null;
  const img = createImageHtml({ ...asset, assetId });
  const content = props.element.data.content + img;
  // `images` only holds signed URLs from the last read; never save it
  const data = omit(props.element.data, 'images');
  emit('save', { ...data, content, assets: collectImageAssets(content) });
};
</script>
```

Rebuilding `assets` on every save keeps it in step with the HTML: a deleted
image drops out, and a pasted one is picked up. Leave `images` out of the
saved data. The runtime only strips paths that are still listed in
`assets`, so the signed URL of a deleted image would otherwise be stored.

In the Display package, and in any editor preview, swap the signed URLs in
before rendering:

```vue
<template>
  <div v-html="html" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { resolveImages } from '@tailor-cms/cek-common';
import type { Element } from 'tce-manifest';

const props = defineProps<{ element: Element }>();

const html = computed(() =>
  resolveImages(props.element.data.content, props.element.data.images),
);
</script>
```

A `storage://` image without a `data-asset-id`, for example in hand-written
HTML, is not listed in `assets` and is never signed. Insert library images
through the helpers so they always get an id.

## Server hooks

Server hooks have the `storage` service injected, exposing the ability to access
storage provider methods. Here is an example of retrieving a public url for a
specific element key within a server hook:

```ts
import type { ElementHook } from '@tailor-cms/cek-common';
import type { Element } from 'tce-manifest';

export const afterSave: ElementHook<Element> = async (element, services) => {
  const { storage } = services;
  const publicUrl = await storage.getFileUrl(element.assets.myKey);
  return element;
};
```

Available storage methods:

```ts
getFile(key: string): Promise<Buffer | null>
```

Resolves to `null` if there's no file under the key.

```ts
getFileUrl(key: string): Promise<string>
```

```ts
saveFile(
  key: string,
  data: string | Buffer | DataView,
  options?: { ContentType?: string },
): Promise<void>
```

Pass `ContentType` when overwriting a file that is served to the browser
(e.g. `text/html`). S3-backed hosts store it as the object's content type and
don't infer it from the key; the filesystem provider ignores it.
