# @tailor-cms/tce-server-runtime

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

## 0.5.7

### Patch Changes

- Update author.

## 0.5.6

### Patch Changes

- Updated dependencies.

## 0.5.5

### Patch Changes

- Passed manifest data to server runtime.

## 0.5.4

### Patch Changes

- Updated gradable state to be handled on server

## 0.5.3

### Patch Changes

- Refactor the way toggling gradeable flag is handled.

## 0.5.2

### Patch Changes

- Added reset element upon switching 'Gradeable' flag.
