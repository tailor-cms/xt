# Manifest

The manifest is a special package located under `packages/manifest`, which
defines the key information about the `Content Element`. Its interface and data
is imported, implemented and exposed by other packages (edit, display and
server). Below is an overview of the generic interface imported from the
`cek-common` package, which is instantiated in the manifest:

```ts
export interface ElementManifest<TData = ElementData> {
  // Unique, reserved string, denoting 'Content Element' type.
  // Each Content Element defines unique type id which is
  // used to resolve which component needs to be used to handle specific
  // Content Element instance. The external types should follow 'ORG_TYPE'
  // convention.
  type: string;
  // Version of the content element (e.g. '1.0').
  version: string;
  // Human readable name of the content element.
  name: string;
  // Declare content element as a composite type. Should be true if
  // TailorEmbeddedContainer will be used.
  isComposite: boolean;
  // Declare content element as question type.
  isQuestion?: boolean;
  // Accompanies the 'isQuestion' field, indicating whether the question
  // type is gradable or ungradable. If both are supported, this field
  // should be omitted.
  isGradable?: boolean;
  // Controls whether the edit runtime exposes per-answer feedback
  // authoring fields. Display renders whatever feedback data exists.
  // Only relevant when 'isQuestion' is true. Defaults to true.
  showFeedback?: boolean;
  // Initializes the 'data' field upon Content Element creation.
  // Receives an optional config object with runtime-level settings
  // (e.g. { isGradable }) that may influence the initial data shape.
  initState: DataInitializer;
  // Optional function to determine if element data is considered empty.
  // Used by the authoring system to evaluate required content elements.
  // Receives current element data and returns true if empty.
  isEmpty?: (data: TData) => boolean;
  // Edit component of the Content Element (Used for authoring purposes).
  Edit?: object;
  // TopToolbar component of the Content Element Edit component
  // (Used for authoring purposes).
  TopToolbar?: object;
  // SideToolbar component of the Content Element Edit component
  // (Used for authoring purposes).
  SideToolbar?: object;
  // Display component of the Content Element
  // (end-user facing; presentation component).
  Display?: object;
  // UI configuration for the authoring tool.
  ui: {
    // mdi icon name to represent the element within the authoring system.
    icon: string;
    // Does the element support layouts (e.g. 50/50) or it needs to be
    // full width.
    forceFullWidth: boolean;
  },
  // AI tools configuration.
  // See [AI page](/ai.html) and AiConfig interface for details.
  ai?: AiConfig;
  // CEK development mocks (display context presets, link dialog mock data).
  // See `ElementMocks` interface for details.
  mocks?: ElementMocks;
}
```
