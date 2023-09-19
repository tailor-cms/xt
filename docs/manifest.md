# Manifest

The manifest is a special package located under `packages/manifest`, which
defines the key information about the `Content Element`. Its interface and data
is imported, implemented and exposed by other packages (edit, display and
server). Here is an interface overview:

```ts
export interface ElementManifest {
  // Unique, reserved string, denoting 'Content Element' type.
  // Each Content Element defines unique type id which is
  // used to resolve which component needs to be used to handle specific
  // Content Element instance. The external types should follow 'ORG/TYPE'
  // convention.
  type: string;
  // Version of the content element (e.g. '1.0')
  version: string;
  // Human readable name of the content element
  name: string;
  // The goal of the initState function is to properly initialize the 'data'
  // field upon the Content Element creation. The 'data' field is the Content
  // Element property storing authors input.
  initState: DataInitializer;
  // Edit component of the Content Element (Used for authoring purposes)
  Edit?: object;
  // TopToolbar component of the Content Element Edit component
  // (Used for authoring purposes)
  TopToolbar?: object;
  // SideToolbar component of the Content Element Edit component
  // (Used for authoring purposes)
  SideToolbar?: object;
  // Display component of the Content Element
  // (End-user facing; presentation component)
  Display?: object;
  // UI configuration for the authoring tool
  ui: {
    // mdi icon name to represent the element within the authoring system
    icon: string;
    // Does the element support layouts (e.g. 50/50) or it needs to be
    // full width
    forceFullWidth: boolean;
  };
}
```
