# @tailor-cms/cek-common

## 3.0.5

### Patch Changes

- 4bed9f7: Rename the HTML image helpers so they cover any library asset: `collectImageAssets` → `collectHtmlAssets`, `resolveImages` → `resolveHtmlAssets`, `createImageAssetId` → `createAssetId`, `getImageDataPath` → `getAssetDataPath`, and `data.imageUrls` → `data.assetUrls`. They now handle every element with a `data-asset-id`, reading `href` on links and `src` elsewhere.
- Rename the HTML image helpers so they cover any library asset

## 3.0.4

### Patch Changes

- Tweak Asset Picker component.

## 3.0.3

### Patch Changes

- Add helpers for library images inside element HTML: `collectImageAssets`, `resolveImages`, `createImageHtml`, `createImageAssetId` and `getImageDataPath`.

## 3.0.2

### Patch Changes

- Extract AssetPicker as separate component.

## 3.0.1

### Patch Changes

- │ Updated dropzone to pass title, drop formats.

## 3.0.0

### Major Changes

- Align with `@tailor-cms/eslint-config` 3.0.0 (ESLint 10). Dependencies bumped.

## 2.3.2

### Patch Changes

- Align `StorageService` types with the storage providers: type the optional `options` argument of `saveFile` (`SaveFileOptions` with `ContentType`), which hosts already forward to the provider, and type `getFile` as resolving to `null` when there's no file under the key.

## 2.3.1

### Patch Changes

- df127cb: Fix file uploads in the edit runtime; the CEK no longer reports upload progress (shows an indeterminate bar).

## 2.3.0

### Minor Changes

- Align `TailorFileInput` with Tailor: upload progress, replace in field mode, and URL imports emit `name` instead of `title`.

## 2.2.1

### Patch Changes

- Swapped legacy colors and updated changed tailor components.

## 2.2.0

### Minor Changes

- Expand file input component with dropzone mode, move toolbar to element expose
  Tailor Dialog global component.

## 2.1.1

### Patch Changes

- Tweak styling on question frames.

## 2.1.0

### Minor Changes

- Introduce general feedback.

## 2.0.3

### Patch Changes

- Replicate Tailor X element frame.

## 2.0.2

### Patch Changes

- Bump dependencies and cleanup runtimes to match Tailor X.

## 2.0.1

### Patch Changes

- Fix resetState to include prompt for isQuestion condition.

## 2.0.0

### Major Changes

- Typed hook signatures: `ElementHook`, `BeforeDisplayHook`, `OnUserInteractionHook`, `ProcedureHandler`.
- `ServerModule` and `HookMap` types for typed server package default exports.
- `AiConfig` type for AI generation configuration.
- `RpcCaller` type for client-side RPC injection.
- `ElementReferences` type for element linking (`Record<string, Partial<Element>[]>`).
- `InitConfig` type and `DataInitializer<TData>` signature change — `initState` now receives a config object (`isGradable`, plus open extension keys).
- `ElementMocks` interface extracted as the canonical type for the `mocks` manifest field; `displayContexts` now optional.
- `DisplayContext` relocated to `element-interfaces` so it can type the `data` field of display-context presets without circular imports.
- `mocks.referencesData` field for custom mock linked element data.
- `isEmpty` manifest function for required element validation.
- `showFeedback` manifest field to toggle per-answer feedback authoring in the edit runtime.
- Storage API: `upload` accepts a single `File` instead of `FormData`; removed `createUploadForm` and `UploadFormData`.
- Build toolchain migrated from tsup to tsdown.

## 1.3.2

### Patch Changes

- Bump dependencies.

## 1.3.1

### Patch Changes

- Updated workspace packages versions.

## 1.3.0

### Minor Changes

- Bump dependencies to the latest versions.

## 1.2.8

### Patch Changes

- Updated spacing on edit and display runtime"

## 1.2.7

### Patch Changes

- Fixed content generation flow. Added error log and reset state.

## 1.2.6

### Patch Changes

- Bump dependencies to the latest versions.

## 1.2.5

### Patch Changes

- Update content generation handling.

## 1.2.4

### Patch Changes

- Remove request timeout, fix focus on content generate.

## 1.2.3

### Patch Changes

- Fixed runtime dependencies.

## 1.2.2

### Patch Changes

- Bump and cleanup dependencies.

## 1.2.1

### Patch Changes

- Bump dependencies.

## 1.2.0

### Minor Changes

- Added AI generation support.
- The `isDisabled` prop has been renamed to `isReadonly`.
- The display component now receives the entire element as a prop instead of
  just the data.
- Added a settings menu:
  - Replaced 'Persist' toolbar switches with the `isFocused` prop in settings,
    which persists focus.
  - Added checkboxes for `isDragged` and half-width layouts (for elements that
    support this option).
- Updated documentation.
- Bumped all dependencies to the latest versions.
- Migrated eslint to version 9 flat config.
- Added several scripts throughout the monorepo.
- Added generic element interfaces to `cek-common` which are then instantiated
  in the manifests of each package.

### Patch Changes

- Updated dependencies
  - @tailor-cms/eslint-config@1.0.0

## 0.0.6

### Patch Changes

- Export element interfaces.

## 0.0.5

### Patch Changes

- Update author.

## 0.0.4

### Patch Changes

- Updated dependencies.
