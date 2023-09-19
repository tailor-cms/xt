# Edit

Edit is the package located under `packages/edit` exposing `Vue 2`
components needed for the Content Element authors to create Content Element. It
consists of three main components:

- Edit component; main authoring component, required
- Top Toolbar component; exposing Content Element controls within
  the Tailor CMS top toolbar slot; optional
- Side Toolbar component; exposing Content Element controls within
  the Tailor CMS side toolbar slot; optional

In the example image below, you can see a WYSIWYG editor Edit component
(displaying 'Edit component' text) and its Top Toolbar; exposing
various editor controls (mounted below the main application heading). Side
Toolbar is not exposed for this Content Element; in case if it was, it would be
visible upon element selection instead of Browse sidebar (note that element
tab in the bottom left corner is greyed out).

\
![Editor overview](./assets/editor_1.png)

\
These are regular `Vue 2.7.x` components which are being passed element related
props:

- `:element`: object; Element entity containing all element related data
- `:isFocused`: boolean; Is element selected
- `:isDragged`: boolean: Is element being dragged; e.g. upon reordering
- `:isDisabled`: boolean: Should element be disabled; e.g. upon copy element seleciton

and observed for element related events:

- `@save` - Emit `data` object to be saved on the `element.data` property.
- `@delete` - Delete element (default control already exists)

\
As noted above, to store element state, simply emit `save` event passing an
object to store (which will be saved on the `element.data` property). To set
the initial state of the `element.data` property, you need to define
the `initState` function. The `initState` function generates the initial
`element.data` value. For more details on how to do that, please visit the
manifest section.

Here is an example of a simple counter `Edit` component from the Introduction
section:

\
`Edit.vue`

```vue
<template>
  <div>
    <div>Times clicked: {{ element.data.count }}</div>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { Element } from 'tce-manifest';

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const increment = () => {
  const { data } = props.element;
  const count = data.count + 1;
  emit('save', { ...data, count });
};
</script>
```

\
In the example above, component triggers save state event on each Increment
button click. Note how `data` object is recreated, rather than count value being
modified. Since data flow should be top-down it is important not to modify
the recieved value, but rather emit a new state, which will be updated, and
after that, change is recieved via prop (updated element state). Similar goes
for the TopToolbar:

\
`TopToolbar.vue`
```vue
<template>
  <button @click="decrement">Decrement</button>
</template>

<script setup lang="ts">
import { Element } from 'tce-manifest';

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const decrement = () => {
  const { data } = props.element;
  const count = data.count - 1;
  emit('save', { ...data, count });
};
</script>
```
