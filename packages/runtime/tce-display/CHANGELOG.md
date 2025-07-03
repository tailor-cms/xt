# @tailor-cms/tce-display-runtime

## 1.2.7

### Patch Changes

- Fixed content generation flow. Added error log and reset state.
- Updated dependencies
  - @tailor-cms/cek-common@1.2.7

## 1.2.6

### Patch Changes

- Bump dependencies to the latest versions.
- Updated dependencies
  - @tailor-cms/cek-common@1.2.6

## 1.2.5

### Patch Changes

- Update content generation handling.
- Updated dependencies
  - @tailor-cms/cek-common@1.2.5

## 1.2.4

### Patch Changes

- Remove request timeout, fix focus on content generate.
- Updated dependencies
  - @tailor-cms/cek-common@1.2.4

## 1.2.3

### Patch Changes

- Fixed runtime dependencies.
- Updated dependencies
  - @tailor-cms/cek-common@1.2.3

## 1.2.2

### Patch Changes

- Bump and cleanup dependencies.
- Updated dependencies
  - @tailor-cms/cek-common@1.2.2

## 1.2.1

### Patch Changes

- Bump dependencies.
- Updated dependencies
  - @tailor-cms/cek-common@1.2.1

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
  - @tailor-cms/cek-common@1.2.0
  - @tailor-cms/eslint-config@1.0.0

## 0.6.13

### Patch Changes

- Fix lint errors.

## 0.6.12

### Patch Changes

- Replaced lodash with lodash-es, updated optimizeDeps, update author.

## 0.6.11

### Patch Changes

- Cleanup vite.config.

## 0.6.10

### Patch Changes

- Remove first boot delay, cleanup.

## 0.6.9

### Patch Changes

- Updated dependencies.

## 0.6.8

### Patch Changes

- Tweaked embedded container, extracted ContentElement component and wrapped questions in Question Card.

## 0.6.7

### Patch Changes

- Updated EmbeddedContainer to contain text inputs.

## 0.6.6

### Patch Changes

- Updated EmbeddedContainer display to get red of unecessary dialog.

## 0.6.5

### Patch Changes

- Added key to the edit components to force re-render.

## 0.6.4

### Patch Changes

- Add attach to overlays to prevent losing element focus.

## 0.6.3

### Patch Changes

- Tweaked EmbeddedContainer styling.

## 0.6.2

### Patch Changes

- Prefixed EmbeddedContainer with Tailor.

## 0.6.1

### Patch Changes

- Updated Embedded Container styling and btn props.

## 0.6.0

### Minor Changes

- Introduced composite element support, added option to preview disabled and
  graded state, updated toolbar styles to match Tailor.
