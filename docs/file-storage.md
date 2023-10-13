# File storage

## File upload from authoring package

The authoring components (Edit package) have the `$storageService` provided via
Vue [provide/inject](https://v2.vuejs.org/v2/api/#provide-inject) prop-drilling
feature. To upload a file simpliy inject `$storageService` into your component
and pass `FormData` with the `file` property containing the upload data
([File type](https://developer.mozilla.org/en-US/docs/Web/API/File]))
to the
`$storageService.upload` method:

```ts
<template>
  <div class="tce-container">
    <div class="background-input">
      <label for="backgroundInput">
        Set background:
        <input
          id="backgroundInput"
          accept="image/png, image/jpeg"
          class="background-input"
          type="file"
          @change="(e) => upload(e)"
        />
      </label>
    </div>
    <!-- If image has been uploaded -->
    <img
      v-if="element.data.backgroundUrl"
      :src="element.data.backgroundUrl"
      alt="Background image"
    />
  </div>
</template>

<script setup lang="ts">
import type { InputFileEvent, StorageApi } from '@tailor-cms/cek-common';
import { createUploadForm } from '@tailor-cms/cek-common';
import { Element } from 'tce-manifest';
import { inject } from 'vue';

const storageService = inject('$storageService') as StorageApi;

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const upload = (e: InputFileEvent) => {
  const form = createUploadForm(e);
  return storageService.upload(form).then(({ key, url, publicUrl }) => {
    emit('save', {
      ...props.element.data,
      assets: { backgroundUrl: url },
    });
  });
};
</script>
```

There are a few things to note for the example above. We used `createUploadForm`
helper which constructs `FormData` payload (based on the file input change
event), to be submitted for the upload. After we upload the asset, we recieve:

- key; image storage key
- url; internal url, used to identify Tailor managed static assets
- publicUrl; used to access asset from the outside world (when using Tailor
  AWS S3 provider, this maps to asset url signed with a temporary access token).

Since publicUrl is going to expire at some point (with the production provider),
there needs to be a mechanism in place which will make sure to process all
static assets upon need. As mentioned in the
[State section](http://localhost:5173/xt/state.html#data-assets-property)
there is a special `data.assets` property where all static assets handled
by the `Content Element` need to be declared. In the example above, we assign
internal url value to `assets.backgroundUrl`. Once fetched for delivery,
default asset processing will make sure to assign resolved public
`backgroundUrl` to the `element.data` property. The same mechanim needs to be
implemented by the consumer of the `Display package`.

The `key` of the assets declared within the `assets` object needs to be set to
their desired location within the `element.data` property. As an example,
declaring `x.y` key will result with the resolved url assigned to the
`data.x.y` (it is possible to target nested values).

## Server hooks

Server hooks have storageService injected, exposing the ability to access
storage provider methods. At the moment it is possible to:

- `getFile`
- `getFileUrl`
- `saveFile`

the server hooks are defined as:

```ts
function hook(element: SequelizeModel, services: Object) => element
```

with services object containing `storage` property with the injected storage
service. Here is an example of retrieving a public url for a specific
element key within the server hook:

```ts
async function afterSave(element: SequelizeModel, services: Object) => {
  const { storage } = services;
  const publicUrl = await storage.getFileUrl(element.assets.myKey);
}
```
