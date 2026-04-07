# Changelog

### v2.0.0 2025-03-12

#### Breaking Changes
- Migrated to Vuetify 4 (MD3 typography classes, updated component API,
  theme configuration). All content element packages using Vuetify components
  need to be updated.
- Question auto-wrap — `QuestionCard` and `QuestionContainer` are now applied
  automatically by the runtime. Elements must remove manual wrapping.
- Build toolchain migrated from tsup to tsdown.
- `isolatedDeclarations` enabled — all exported symbols require explicit type
  annotations.
- TypeScript 6, Vite 8.

#### Features
- Typed hook signatures (`ElementHook`, `BeforeDisplayHook`,
  `OnUserInteractionHook`, `ProcedureHandler`).
- `ServerModule` and `HookMap` types for typed server package default exports.
- `AiConfig` type (replaces inline `OpenAISchema` casting pattern).
- RPC procedures — custom server-side methods callable from Edit components
  via the injected `$rpc` function.
- `isEmpty` manifest function for required element validation.
- `showFeedback` manifest field to control question feedback section visibility.
- Question autosave support.
- `callElementAction` support.
- `TailorAssetInput` global component (consolidated from separate upload
  components).
- `TailorElementPlaceholder` global component.
- `TailorFileInput` global component for file uploads in the edit runtime.
- Expanded E2E testing utilities (`@tailor-cms/cek-e2e`) with API helpers and
  additional page object models.
- Accessibility improvements.

#### Other
- `moduleResolution: "bundler"` across all tsconfigs.
- Bumped all dependencies to the latest versions.

### v1.0.0 2024-02-07

#### Changes
- Vue 2 based authoring runtime package has been removed and
  `/packages/runtime/tce-edit` is now Vue 3 based. As result boot process
  has been also cleaned up to spin up faster.

### v0.5.0 2024-04-05

#### Changes
- Added Vue 3 based authoring runtime package `/packages/runtime/tce-edit-vue3`
  to support the Tailor v7 release. The runtime functionality is the same as the
  Vue 2 based one. Vue 3 runtime is a [Vite](https://vitejs.dev/) based dev
  server, which:
  - autoimports targeted Tailor components
  - emulates Tailor API in terms of binding content element properties,
    supporting events observed by the Tailor CMS and other runtime aspects like
    exposing authoring UI components (`Vuetify 3`)
  - enables preview of the authoring package during development
- Updated `tce-boot` package to handle whether Vue 2 or Vue 3 based
  authoring runtime should be booted. To use Vue 3 based runtime set
  `TAILOR_NEXT` env variable to `true`.
- Updated the docs to reflect the changes.
