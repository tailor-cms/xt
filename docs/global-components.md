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

File picker with a dialog for uploading (drag & drop), choosing from the
asset library, and optionally importing from a URL. Auto-detects the asset
type from the accepted extensions to resolve the icon, label, and dropzone
title. Handles the upload via `$storageService`.

It has two modes:

- **`field`** (default): a form control. Empty, it is a click-to-add text
  field; filled, it is a compact file card with preview, download, replace,
  and remove. Use it in side toolbars and forms.
- **`dropzone`**: a media composer for the element body. Empty, it renders a
  placeholder-style zone with Upload, Library and, when enabled, From URL,
  plus drag & drop with inline progress. Filled, it renders your media from
  the default slot and, while `show-actions` is true, a sticky row beneath it
  with the file name, Replace and Remove.

```vue
<template>
  <TailorFileInput
    :allowed-extensions="['.png', '.jpg', '.jpeg']"
    :file-key="element.data.assets?.url || element.data.url"
    :public-url="element.data.url"
    :readonly="isReadonly"
    :show-actions="isFocused"
    mode="dropzone"
    allow-url-source
    @delete="onDelete"
    @input="save"
    @upload="save"
  >
    <VImg :alt="element.data.alt" :src="element.data.url ?? ''" />
  </TailorFileInput>
</template>

<script setup lang="ts">
import type { Element, ElementData } from 'tce-manifest';

const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits<{ save: [data: ElementData] }>();

// `@input` also fires with `null` on remove; `@delete` covers that case
const save = (payload: Record<string, any> | null) => {
  if (!payload) return;
  const { url, publicUrl } = payload;
  emit('save', { ...props.element.data, url: publicUrl ?? url, assets: { url } });
};

const onDelete = () => {
  emit('save', { ...props.element.data, url: null, assets: {} });
};
</script>
```

Keep the editor honest: render what learners will see in the default slot,
and leave editing chrome (replace, remove, file facts) to the row the
component adds.

::: tip Info
The kit has no asset library, so its runtime offers Upload and From URL
only; the Library source appears in Tailor.
:::

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'field' \| 'dropzone'` | `'field'` | Form control, or in-card media composer (see above) |
| `file-key` | `string` | `''` | Storage key, `storage://` URI, or external `http(s)` URL of the current file |
| `file-name` | `string` | `''` | Display name; falls back to parsing from `fileKey` |
| `show-actions` | `boolean` | `true` | Dropzone mode: show the file row below the media; bind to the element's focus state |
| `allow-url-source` | `boolean` | `false` | Show the URL tab in the picker dialog and the From URL button in the dropzone |
| `allowed-extensions` | `string[]` | `[]` | Accepted extensions with dot prefix (e.g. `['.jpg', '.png']`); drives type detection, the formats hint, and library filtering |
| `show-preview` | `boolean` | `false` | Image thumbnail + overlay on the file card; auto-enabled for image extensions |
| `public-url` | `string \| null` | `null` | Pre-resolved public URL; skips the async fetch when present |
| `readonly` | `boolean` | `false` | Disables all interactions |
| `label` | `string` | `''` | Override the auto-inferred label (derived from extensions) |
| `placeholder` | `string` | `''` | Field mode: text field placeholder; also the base of the dialog heading |
| `icon` | `string` | `''` | Override the auto-inferred icon (derived from extensions) |
| `variant` | `VTextField['variant']` | `'outlined'` | Vuetify variant for the text field (field mode) |
| `density` | `VTextField['density']` | `'default'` | Vuetify density for the text field (field mode) |
| `dark` | `boolean` | `false` | Dark theme variant for the file card (field mode) |

#### Slots (dropzone mode)

| Slot | Props | Description |
|---|---|---|
| default | `{ url, fileName, isLoading }` | The media to render once a file is set |
| `actions` | `{ replace, remove }` | Replaces the Replace / Remove buttons in the file row |

#### Events

| Event | Payload | Description |
|---|---|---|
| `@upload` | `{ key, name, url, publicUrl }` | File uploaded via drag & drop or the file picker |
| `@input` | `{ key, name, url, publicUrl }` \| `{ url, title? }` \| `null` | Asset picked from the library, URL imported, or `null` on remove |
| `@delete` | — | File removed by the user |

#### Values inferred from `allowed-extensions`

| Type | Icon | Label | Dropzone title |
|---|---|---|---|
| Image | `mdi-image-outline` | Image | Add an image |
| Video | `mdi-video-outline` | Video | Add a video |
| Audio | `mdi-volume-medium` | Audio | Add audio |
| Document | `mdi-file-document-outline` | Document | Add a document |
| Fallback | `mdi-file-outline` | File | Add a file |

The type is inferred only when every accepted extension belongs to one
group; mixed or empty lists fall back to File. `label` and `icon` override
the inferred values.

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
    :is-focused="isFocused"
    :is-readonly="isReadonly"
    :name="`${manifest.name} component`"
    active-icon="mdi-arrow-up"
    active-placeholder="Use the toolbar above to enter the url"
  />
</template>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `string` | required | MDI icon name |
| `name` | `string` | required | Element display name |
| `color` | `string` | `undefined` | Avatar color (tonal); inherits text color when unset |
| `placeholder` | `string` | `'Select to edit'` | Text shown when unfocused |
| `active-placeholder` | `string` | `'Use the toolbar above to edit'` | Text shown when focused |
| `active-icon` | `string \| null` | `null` | Icon shown next to active placeholder |
| `is-focused` | `boolean` | `false` | Focus state (enlarges the icon, shows active placeholder) |
| `is-readonly` | `boolean` | `false` | Hides the placeholder instructions |

### TailorDialog

Themed dialog with the Tailor card chrome: an icon and title header,
optional subheader, body and actions slots, and an optional close button.
Use it for element-level dialogs, for example changing a source URL while
the current embed stays in view. It follows the app theme even when opened
from inside the always-light element sheet.

```vue
<template>
  <TailorDialog
    v-model="isOpen"
    header-icon="mdi-application-brackets"
    title="Change the embed"
    width="500"
  >
    <template #body>
      <VTextField v-model="url" label="URL" variant="outlined" />
    </template>
    <template #actions>
      <VBtn text="Cancel" variant="text" @click="isOpen = false" />
      <VBtn color="primary" text="Save" variant="flat" @click="save" />
    </template>
  </TailorDialog>
</template>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `model-value` | `boolean` | — | Open state (`v-model`) |
| `title` | `string` | `''` | Header title |
| `header-icon` | `string` | `'mdi-alert'` | Header icon |
| `color` | `string` | `'primary'` | Header icon color |
| `width` | `number \| string` | `500` | Dialog width |
| `closeable` | `boolean` | `false` | Show a close button in the header |
| `theme` | `string` | app theme | Override the theme the dialog renders in |

Any other attribute (e.g. `persistent`) is passed to the underlying `VDialog`.

#### Slots

| Slot | Description |
|---|---|
| `activator` | Trigger element; receives the `VDialog` activator props |
| `subheader` | Content between the header and the body (e.g. tabs) |
| `body` | Dialog content |
| `actions` | Buttons in the card actions row |

#### Events

| Event | Description |
|---|---|
| `@open` / `@close` | Open state changed |
| `@submit` | Listening for it wraps the card in a form; fires on Enter and submit buttons |

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
| `element-variant` | `'card' \| 'field' \| 'quiet'` | `'quiet'` | Presentation of each embedded element. `card`: standard collapsible editor card. `field`: header-less body for externally-labelled slots. `quiet`: header revealed on hover/focus, always expanded |
| `default-expanded` | `boolean` | `true` | Baseline expansion state of each embed (`card` variant only). Embeds added during the session always start expanded |

Default `addElementOptions`:
```ts
{
  large: false,
  label: 'Add content',
  icon: 'mdi-plus',
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
