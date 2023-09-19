# Display package

Display is the subpackage located under `packages/display` exposing `Vue 3`
component needed for the Content Element end-user rendering. The component
recieves authored values as props. Here is an example of a Display component
for the Simple Counter Content Element from the Edit package section:

\
`Display.vue`

```vue
<template>
  <div>
    Clicked
    <span>{{ data.count }}</span>
    times!
  </div>
</template>

<script setup lang="ts">
import { ElementData } from 'tce-manifest';

defineProps<{ data: ElementData }>();
</script>
```

In the example above, passed data state is used to render number of times author
clicked on the button.

It is up to the target system to define mechanisms for end-user state
persistance or any other additional behaviour.
