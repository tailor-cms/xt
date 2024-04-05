# Runtime

The framework consist of four different runtimes:

- Authoring; autoloading and serving `edit` package. This runtime
  supports Vue 2 and Vue 3 based UI componenets (depending on the targeted
  Tailor CMS version) and implements compatible Tailor CMS APIs to enable
  development without the need to set up Talor CMS. By default it runs on port
  `8010`. To use Vue 3 based version set `TAILOR_NEXT` env varaible to `true`.
- Display; autoloading and serving `display` package. This runtime
  supports Vue 3 and implements general LMS front-end interface. Runs on port
  `8020`.
- Server; enables execution of content element hooks. Node app running
  on port `8030` mimicking Tailor entity storage system and providing remaining
  APIs.
- Preview; Glues it all together and provides common UI for inspecting the
  created components. Runs on port `8080`.

The runtime is booted by executing:

```bash
pnpm dev
```

in the project root. The browser window should automatically pop out and display
the preview.

## Simplified runtime diagram

![Simplified runtime](./assets/template-runtime.jpeg)
