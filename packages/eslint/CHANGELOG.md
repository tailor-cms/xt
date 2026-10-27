# @tailor-cms/eslint-config

## 3.0.2

### Patch Changes

- Extract AssetPicker as separate component.

## 3.0.1

### Patch Changes

- │ Updated dropzone to pass title, drop formats.

## 3.0.0

### Major Changes

- Upgrade to ESLint 10. Requires `eslint@^10` as a peer dependency.

  - Replace unmaintained `eslint-plugin-import` with `eslint-plugin-import-x`; rules are now prefixed `import-x/` (update any `eslint-disable` comments referencing `import/*`)
  - Bump `neostandard` to 0.14 and `@eslint/js` to 10
  - Keep neostandard rules applied to `.ts`, `.tsx` and `.vue` files (0.14 scopes them to JS files by default)

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

- Compatible with TypeScript 6.

## 1.1.2

### Patch Changes

- Bump dependencies.

## 1.1.1

### Patch Changes

- Updated workspace packages versions.

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
