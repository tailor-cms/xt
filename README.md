# Content Element Kit

Development framework for building [Tailor CMS](https://github.com/tailor-cms/author) content elements in isolation.

Provides a 4-runtime architecture for authoring, displaying, and testing
content elements:

- **Edit** — Authoring runtime emulating the Tailor CMS environment
- **Display** — End-user runtime emulating the delivery (LMS) environment
- **Server** — Server runtime for hooks, procedures, and storage
- **Preview** — Inspector UI combining all runtimes

## Packages

| Package | Description |
|---|---|
| `@tailor-cms/cek-common` | Shared types, API client, WebSocket utils |
| `@tailor-cms/tce-edit-runtime` | Edit runtime |
| `@tailor-cms/tce-display-runtime` | Display runtime |
| `@tailor-cms/tce-server-runtime` | Server runtime |
| `@tailor-cms/tce-preview-runtime` | Preview inspector UI |
| `@tailor-cms/tce-boot` | Dev orchestrator |
| `@tailor-cms/cek-e2e` | E2E testing utilities |
| `@tailor-cms/eslint-config` | Shared ESLint config |

## Documentation

See the [documentation site](https://tailor-cms.github.io/xt/) for
installation, usage, and API reference.

## Quick start

```bash
pnpm install
pnpm start:example
```

This boots the example element across all four runtimes — Edit, Display,
Server, and Preview — accessible from the Preview inspector at `localhost:8080`.

## License

MIT
