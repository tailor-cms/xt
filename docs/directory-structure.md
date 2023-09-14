# 🗂️ Directory structure

## Overview

The project structure provides a great starting point for crafting
the Content Element. Framework is organized as a monorepo consisting of three
main subpackages (targeting different systems):

```
├─ package.json
├─ packages
│  ├─ /display
│  ├─ /edit
│  └─ /server
```

- Edit (authoring) front-end package; implemented using Vue 2 UI library.
- Display (presentation) front-end package; implemented using Vue 3 UI library.
- Server package; for implementing server side functionality.

Framework runtime is implemented with 'Convention over configuration' principles
in mind. The `/dist` folder of each sub-package is monitored for changes and
auto-imported upon change by the runtime. Each sub-package has a configured
bundler in place started in `watch` mode which emits new build once the change
is made.

::: tip
To learn more about individual sub-packages and runtimes visit one of the
dedicated sections.
:::
