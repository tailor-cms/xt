# @tailor-cms/cek-common

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
