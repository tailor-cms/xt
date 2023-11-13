# Display package

Display package is the subpackage located under `packages/display` exposing
`Vue 3` component needed for the Content Element `end-user` rendering. The
component recieves authored values as props. Here is an example of a Display
component for the Simple Counter Content Element from the Edit package section:

\
`Display.vue`

```vue
<template>
  <div>
    <div>
      Clicked
      <span>{{ data.count }}</span>
      times!
    </div>
    <div>Last seen at: {{ userState.seenAt }}</div>
  </div>
</template>

<script setup lang="ts">
import { ElementData } from 'tce-manifest';

defineProps<{ data: ElementData, userState: any }>();
</script>
```

In this example, we render the number of times the author has clicked on
the button. If needed, the `end-user` state can be passed via the
`userState` prop. This is handled by the `end-user` system (`userState`
is a reserved property).

## User events

In the example above, we use the `userState` prop to display the last time the
user has seen the element. In order to achieve that, we need a way to report
user activity from the `Display` component. The specification implements
`interaction` event, which can be used to report user activity to the `end-user`
system. Emitting `interaction` event will result in `onUserInteraction` server
hook being called, where one can implement user state handling and other
interaction-specific handling. For more details on this, visit section
on [user-state hooks](./server-package#user-state-hooks).

\
Here is a simple example of element submitting interaction event for backend to
process:

\
`Display.vue`
```vue
<template>
  <div>
    <v-btn @click="submit">Submit interaction</v-btn>
    <div>{{ userState }}</div>
  </div>
</template>

<script setup lang="ts">
import { ElementData } from 'tce-manifest';

const props = defineProps<{ data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const submit = () => emit('interaction', { myInteractionData: 'example' });
</script>
```

:::tip State persistance and user event handling
It is up to the `end-user`/`target system` to define mechanisms for end-user
state persistance or any other additional behaviour.
:::
