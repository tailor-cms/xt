# Changelog

### v0.5.0 2024-04-05

#### Changes
- Added Vue 3 based authoring runtime package `/packages/runtime/tce-edit-vue3`
  to support the Tailor v7 release. The runtime functionality is the same as the
  Vue 2 based one.
- Updated `tce-boot` package to handle whether Vue 2 or Vue 3 based
  authoring runtime should be booted. To use Vue 3 based runtime set
  `TAILOR_NEXT` env variable to `true`.
- Updated the docs to reflect the changes
