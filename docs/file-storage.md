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

const upload = (e: InputFileEvent) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  return storageService.upload(files).then(({ key, url }) => {
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
getFile(key: string): Promise<Buffer>
```

```ts
getFileUrl(key: string): Promise<string>
```

```ts
saveFile(key: string, data: string | Buffer | DataView): Promise<void>
```
