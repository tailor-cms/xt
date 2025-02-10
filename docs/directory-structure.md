# Directory structure

The framework structure provides a great starting point for crafting
the Content Element. It is a monorepo consisting of three
main subpackages (targeting different systems):

```
├─ package.json
├─ packages
│  ├─ /display
│  ├─ /edit
│  └─ /server
```

- `edit` (authoring) front-end package; implemented using Vue 3 UI library.
- `display` (end-user) front-end package; implemented using Vue 3 UI library.
- `server` package; for implementing server side functionality.

Framework runtime is implemented with 'Convention over configuration' principles
in mind. The `/dist` folder of each subpackage is monitored for changes and
auto-imported upon change by the runtime. Each subpackage has a configured
bundler in place started in `watch` mode, which emits the new build once the
change is made.

::: tip
To learn more about individual subpackages and runtimes visit one of the
dedicated sections.
:::
