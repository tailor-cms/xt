# State

## Authoring state

Content Element `Edit` component has the ability to emit the `data` object
that needs to be stored by the `Tailor CMS`; which is later on used to render
`Display` component. This is achived by emitting the `save` event.
The emitted `data` is stored on the `ContentElement` entity under the
same key. Here is a simple example of Content Element `Edit` component
implemented using Vue 2, presenting the amount of times user clicked on a
button:

```vue
<template>
  <div>
    {{ element.data.timesClicked }}
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  name: 'tce-times-clicked',
  props: {
    element: { type: Object, required: true },
  },
  methods: {
    increment() {
      const timesClicked = element.data.timesClicked + 1;
      this.$emit('save', { ...element.data, timesClicked });
    }
  },
};
</script>
```

## Initializing the state

By emitting the `save` event, `timesClicked` value is stored alongside other
data in the `element.data` key-value property bag. What about the
first time `Edit` component gets rendered, timesClicked does not exist on the
`data` object and `data.timesClicked` will return undefined. That is where
`initState` function kicks in. Each Content Element package exposes `initState`
function, which is called upon adding a new `Content Element`. As name suggests,
the goal of `initState` function is to properly initialize `data` field of
respective element. To support our data structure, we would define `initState`
as:

```js
const initState = () => ({ timesClicked: 0 })
```

## `data.assets` property

By inspecting the `data` property of some of the Tailor core Content Elements,
you might run into `data.assets` object, containing something like:

```js
{
  assets: {
    'url': 'repository://assets/sample_pdf.jpeg',
    'aux.cover': 'repository://assets/cover.jpeg'
  }
}
```

`data.assets` is a special key-value dictionary which is used to declare all
authored static assets (e.g. uploaded image or attached file). The key
denotes the location within the `data` property bag where the value needs to
be injected. Value should be the `URL` or the uploaded entity.

To securely deliver assets at scale, there is a mechanism in place,
which generates token making assets accessible for a limited amount of time.
The key will be used to denote key within the `data` object if value is a
local url (denoted with `repository://` prefix) file URL will be resolved and
signed with a short lived token. For the example above, after entity has been
fetched, `data` property will have following structure:

```js
{
  url: 'https://s3.amazon.com/my_bucket.......'
  aux: {
    cover: 'https://s3.amazon.com/my_bucket.......'
  }
  assets: {
    'url': 'repository://assets/sample_pdf.jpeg',
    'aux.cover': 'repository://assets/cover.jpeg'
  }
}
```

For more details on developing `Edit` components and `Content Element` manifest
specification, please visit dedicated sections within the documentation.

## Server entity

Content Element Kit fully replicates `Tailor CMS` Content Element model to
ensure consistency and compatibility. The same `ORM` is used to instantiate
entities on the backend (`Sequalize.js`), and compatible mechanism is
implemented to hydrate front-end component in case of changes.

```ts
interface ContentElement {
  // Current primary id
  id: number;
  // Future primary id
  uid: string;
  // Repository is a top level grouping entity within the Tailor CMS, it usually
  // maps to a Course concept, but it can be different thing depending on the
  // learning pedagogy and intended use.
  repositoryId: number;
  // Activities are structural groupings within a repository. As an example,
  // Within a 'Course' repository, 'Activities' can be used to create 'Modules',
  // 'Pages', 'Sections' and other structures to segment the Learning
  // activities. They usually have hierarchical structure.
  activityId: number;
  // Type is a unique, reserved string, denoting 'Content Element' type id.
  // Each Content Element defines unique type id within the Tailor CMS which is
  // used to resolve which components needs to be used to handle specific
  // Content Element instance. The external types should follow 'ORG/TYPE'
  // convention.
  type: string;
  // Elements are placed within a container, which can be a standard container
  // or a custom container. Great example of a standard container is
  // a simple Page. Sometimes there is a need to create a custom one, like
  // Exam, hosting Assessment Content Elements. The position
  // property is used to order elements within a container.
  position: number;
  // Data is a JSON field exposed to the element creator for data storage. Each
  // Element defines its own data structure. For more details see manifest and
  // Edit package documentation.
  data: ElementData;
  // Tailor CMS has concept of configurable metadata. Each Content Element, in
  // addition to its custom developed behaviour can be extended with a field
  // configuration, enabling additional inputs. Let's use image Content Element
  // as an example. One might add configuration to require 'Alt text' metadata
  // input field. Without coding this functionality, Tailor CMS will add input
  // for 'Alt text' in the 'Content Element' sidebar once element is selected.
  // For more details see Tailor documentation.
  meta: { [key: string]: any };
  // In Tailor CMS, it is possible to configure relationships between
  // the Content Elements. These references are stored within refs property.
  refs: { [key: string]: any };
  // Future functionality support
  linked: boolean;
  // Boolean for marking elements for which parent structural item has been
  // deleted
  detached: boolean;
  // Unique element uid, persisted upon creating the element copy
  contentId: string;
  // SHA-1 of 'data' value, uniquely identifying the Content Element data
  contentSignature: string;
  // Date element got created
  createdAt: string;
  // Date element got last updated
  updatedAt: string;
  // Date element got deleted
  deletedAt: string | null;
}
```

Full Content Element entity ORM instance is available within server-side hooks.
For more info on that. Please visit Server package section.
