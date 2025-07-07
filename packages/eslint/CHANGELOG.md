# @tailor-cms/eslint-config

## 1.1.0

### Minor Changes

- Bump dependencies to the latest versions.

## 1.0.3

### Patch Changes

- Bump dependencies to the latest versions.

## 1.0.2

### Patch Changes

- Bump and cleanup dependencies.

## 1.0.1

### Patch Changes

- Bump dependencies.

## 1.0.0

### Major Changes

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
