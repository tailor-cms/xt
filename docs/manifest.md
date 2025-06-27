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
  // The goal of the initState function is to properly initialize the
  // 'data' field upon the Content Element creation. The 'data' field is
  // the Content Element property storing authors input.
  initState: DataInitializer;
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
  ai?: {
    // Prompt used to describe the response structure.
    getPrompt: (context: any) => string;
    // JSON schema for the OpenAI response formatting.
    Schema?: OpenAISchema;
    // Function for additional response processing & validation.
    processResponse?: (val: any) => any;
    // Indicates whether the AI generation tool should be used when
    // generating.
    useImageGenerationTool?: boolean;
  };
  mocks?: {
    // Provide end-user system context mock (used for user state hooks)
    // See https://tailor-cms.github.io/xt/server-package.html#user-state-hooks.
    displayContexts: Array<{ name: string; data: any }>;
  };
}
```
