# Global Components

The following Vue components are globally registered and available without
importing them.

Each runtime (edit and display) registers its own set of global components.
In the CEK, these are mock implementations for local development (e.g.
`TailorEmbeddedContainer` renders example elements, `TailorAssetInput` uploads
to the local dev server). In production, the host application (Tailor CMS for
authoring, the LMS for display) registers its own implementations that connect
to the real storage, element registry, and other platform services. The API
(props and events) is the same across environments.

## Edit Runtime

Registered by the CEK edit runtime and Tailor CMS. Available in Edit,
TopToolbar, and SideToolbar components.

### TailorAssetInput

Asset input component for file upload and URL input. Handles file upload
via `$storageService`, URL validation, and edit/save/cancel state internally.

```vue
<template>
  <TailorAssetInput
    :extensions="['.png', '.jpg', '.jpeg']"
    :public-url="element.data.backgroundUrl"
    :url="element.data.assets?.backgroundUrl"
    upload-label="Upload image"
    @input="save"
  />
</template>

<script setup lang="ts">
import type { Element } from 'tce-manifest';

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const save = ({ url, publicUrl }: { url: string; publicUrl: string }) => {
  const assets = { backgroundUrl: url };
  emit('save', { ...props.element.data, backgroundUrl: publicUrl, assets });
};
</script>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `extensions` | `string[]` | required | Allowed file extensions (e.g. `['.png', '.jpg']`) |
| `url` | `string \| null` | `null` | Internal asset URL (from `data.assets`) |
| `public-url` | `string \| null` | `null` | Public/resolved URL |
| `allow-file-upload` | `boolean` | `true` | Show file upload button |
| `upload-label` | `string` | `'Select file'` | Upload button label |

### Events

| Event | Payload | Description |
|---|---|---|
| `@input` | `{ url, publicUrl }` | Emitted on save with internal and public URLs |

Assign the `url` (internal) to `data.assets` and the `publicUrl` to `data`
for display. See the [File storage](/file-storage) section for details on asset
URL handling.

### TailorEmbeddedContainer

Interactive container for embedded child elements within composite elements.
Supports adding, editing, deleting, and reordering embedded elements.

```vue
<template>
  <TailorEmbeddedContainer
    :container="element.data"
    :is-readonly="isReadonly"
    @save="emit('save', $event)"
  />
</template>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `container` | `object` | required | Data field containing `embeds` in key-value format |
| `allowed-elements-config` | `array` | `[]` | Element configs allowed to be embedded |
| `is-readonly` | `boolean` | `false` | Disable editing |
| `enable-add` | `boolean` | `true` | Show add element button |
| `add-element-options` | `object` | see below | Options for the add element button |

Default `addElementOptions`:
```ts
{
  large: false,
  label: 'Add content',
  icon: 'mdi-plus',
  color: 'primary-darken-4',
  variant: 'tonal',
}
```

#### Events

| Event | Payload | Description |
|---|---|---|
| `@save` | `object` | Updated container object with modified embeds |
| `@delete` | `object` | Element to be deleted |

See [Composite Elements](/edit-package#composite-elements) for usage details.

### TailorContentElement

::: warning Internal
Used internally by `TailorEmbeddedContainer` to render individual embedded
elements. Not intended for direct use by element authors.
:::

Renders a single embedded element with edit controls (text input, delete
button on hover).

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `element` | `object` | required | Element entity |
| `parent` | `object \| null` | `null` | Parent element (hides delete when set) |
| `is-readonly` | `boolean` | `false` | Disable editing |

#### Events

| Event | Payload | Description |
|---|---|---|
| `@save` | `object` | Updated element data |
| `@delete` | `object` | Element to be deleted |

## Display Runtime

Registered by the CEK display runtime. In production, the LMS that consumes
the Display package is responsible for registering these components.

### TailorEmbeddedContainer

Read-only container that renders embedded child elements for display.

```vue
<template>
  <TailorEmbeddedContainer :elements="elements" />
</template>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `elements` | `array` | required | Array of embedded element objects to render |