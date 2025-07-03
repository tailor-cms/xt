# @tailor-cms/tce-edit-runtime

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

## 1.0.5

### Patch Changes

- Updated dependencies.

## 1.0.4

### Patch Changes

- Fix lint errors.

## 1.0.3

### Patch Changes

- Replaced lodash with lodash-es, updated optimizeDeps, update author.
- Updated dependencies
  - @tailor-cms/cek-common@0.0.5

## 1.0.2

### Patch Changes

- Updated ContentElement global component.

## 1.0.1

### Patch Changes

- Updated dependencies.

## 1.0.0

### Major Changes

- Package is now Vue 3 based, replacing tce-edit-next.
