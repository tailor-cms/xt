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

### TailorFileInput

File picker component with upload dialog (drag & drop) and optional URL
import tab. Auto-detects asset type from extensions to resolve icon, label,
and button text. Handles file upload via `$storageService`.

```vue
<template>
  <TailorFileInput
    :allowed-extensions="['.png', '.jpg', '.jpeg']"
    :file-key="element.data.assets?.backgroundUrl"
    allow-url-source
    @upload="onUpload"
    @input="onInput"
    @delete="onDelete"
  />
</template>

<script setup lang="ts">
import type { Element, ElementData } from 'tce-manifest';

const props = defineProps<{ element: Element }>();
const emit = defineEmits<{ save: [data: ElementData] }>();

const onUpload = ({ url, publicUrl }: Record<string, any>) => {
  const assets = { backgroundUrl: url };
  emit('save', { ...props.element.data, backgroundUrl: publicUrl, assets });
};

const onInput = (payload: Record<string, any> | null) => {
  if (!payload) return;
  emit('save', { ...props.element.data, backgroundUrl: payload.publicUrl });
};

const onDelete = () => {
  emit('save', {
    ...props.element.data,
    backgroundUrl: undefined,
    assets: undefined,
  });
};
</script>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `file-key` | `string` | `''` | Storage key or `storage://` URI of the current file |
| `file-name` | `string` | `''` | Display name; falls back to parsing from `fileKey` |
| `allow-url-source` | `boolean` | `false` | Show URL import tab in the picker dialog |
| `allowed-extensions` | `string[]` | `[]` | Accepted extensions with dot prefix (e.g. `['.jpg', '.png']`); drives icon/label auto-detection |
| `use-field-input` | `boolean` | `false` | Use field input + card rendering instead of default button mode |
| `show-preview` | `boolean` | `false` | Enable image thumbnail + overlay on the file card; auto-enabled for image extensions |
| `public-url` | `string \| null` | `null` | Pre-resolved public URL; skips async fetch when present |
| `label` | `string` | `''` | Override auto-inferred label (derived from extensions) |
| `placeholder` | `string` | `''` | Override button text (e.g. `'Upload image'`) |
| `icon` | `string` | `''` | Override auto-inferred icon (derived from extensions) |
| `variant` | `VTextField['variant']` | `'outlined'` | Vuetify variant for the text field (field input mode) |
| `density` | `VTextField['density']` | `'default'` | Vuetify density for the text field (field input mode) |
| `dark` | `boolean` | `false` | Dark theme variant for the file preview card |

#### Events

| Event | Payload | Description |
|---|---|---|
| `@upload` | `{ key, name, url, publicUrl }` | File uploaded via drag & drop or file picker |
| `@input` | `{ url, publicUrl, title? } \| null` | URL imported (from URL tab), or `null` on clear |
| `@delete` | — | File cleared by the user |

Auto-inferred values from `allowedExtensions`:
- Image extensions → icon `mdi-image-outline`, label `Image`, button `Choose image`
- Video → `mdi-video-outline` / `Video` / `Choose video`
- Audio → `mdi-volume-medium` / `Audio` / `Choose audio`
- Document → `mdi-file-document-outline` / `Document` / `Choose document`
- Fallback → `mdi-file` / `File` / `Choose file`

### TailorAssetInput (legacy)

The previous asset input component with inline edit/save/cancel state.
Still registered globally for backward compatibility. New elements should
use `TailorFileInput` instead.

See the [File storage](/file-storage) section for details on asset URL handling.

### TailorElementPlaceholder

Placeholder component shown when no content has been provided yet (e.g. no
image uploaded, no URL set). Displays a centered icon, name, and contextual
instructions that change based on focus state.

```vue
<template>
  <TailorElementPlaceholder
    v-if="!element.data.url"
    :icon="manifest.ui.icon"
    :is-disabled="isReadonly"
    :is-focused="isFocused"
    :name="`${manifest.name} component`"
    active-icon="mdi-arrow-up"
    active-placeholder="Use toolbar to enter the url"
  />
</template>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `string` | required | MDI icon name |
| `name` | `string` | required | Element display name |
| `placeholder` | `string` | `'Select to edit'` | Text shown when unfocused |
| `active-placeholder` | `string` | `'Use toolbar to edit'` | Text shown when focused |
| `active-icon` | `string \| null` | `null` | Icon shown next to active placeholder |
| `active-color` | `string` | `'#fff'` | Icon color when focused |
| `dense` | `boolean` | `false` | Compact variant (smaller icon/text) |
| `is-focused` | `boolean` | `false` | Focus state |
| `is-disabled` | `boolean` | `false` | Disabled state (greys out icon and text) |

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