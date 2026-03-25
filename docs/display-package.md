# Display package

Display package is the subpackage located under `packages/display` exposing
`Vue 3` component needed for the Content Element `end-user` rendering. The
component receives authored values as props. Here is an example of a Display
component for the Simple Counter Content Element from the Edit package section:

\
`Display.vue`

```vue
<template>
  <div>
    <div>
      Clicked
      <span>{{ element.data.count }}</span>
      times!
    </div>
    <div>Last seen at: {{ userState.seenAt }}</div>
  </div>
</template>

<script setup lang="ts">
import { Element } from 'tce-manifest';

defineProps<{ element: Element, userState: any }>();
</script>
```

In this example, we render the number of times the author has clicked on
the button. If needed, the `end-user` state can be passed via the
`userState` prop. This is handled by the `end-user` system (`userState`
is a reserved property).

## User events

In the example above, we use the `userState` prop to display the last time the
user has seen the element. In order to achieve that, we need a way to report
user activity from the `Display` component.

### Non-question elements

Non-question Display components emit the `interaction` event to report user
activity to the end-user system. Emitting `interaction` triggers the
`onUserInteraction` server hook, where you can implement user state handling
and other interaction-specific logic. For more details, visit the section
on [user-state hooks](./server-package#user-state-hooks).

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
import { Element } from 'tce-manifest';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits(['interaction']);

const submit = () => emit('interaction', { myInteractionData: 'example' });
</script>
```

### Question elements

Question Display components emit `user-input` instead of `interaction`. The
framework auto-wraps question Display components inside a `QuestionForm`
which provides the standard question layout (prompt, hint, submit/retry
controls, feedback). The element only provides the answer-specific UI.

The `QuestionForm` captures `user-input` events from the inner component,
validates the form on submit, and emits `interaction` to the runtime — which
triggers the `onUserInteraction` server hook.

\
`Display.vue`
```vue
<template>
  <div>
    <VRadioGroup v-model="selectedAnswer">
      <VRadio
        v-for="(answer, i) in element.data.answers"
        :key="i"
        :label="answer"
        :value="i"
        :disabled="userState?.isSubmitted"
      />
    </VRadioGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Element } from 'tce-manifest';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits(['user-input']);

const selectedAnswer = ref(props.userState?.response ?? null);

watch(selectedAnswer, (val) => {
  if (val !== null) emit('user-input', { response: val });
});
</script>
```

Note: The element does **not** include a submit button — the `QuestionForm`
provides submit/retry controls and manages the submission lifecycle.

### Event flow summary

| Element Type | Component Emits | Container | Runtime Receives |
|-------------|----------------|-----------|-----------------|
| Non-question | `interaction` | — | `interaction` → `onUserInteraction` hook |
| Question | `user-input` | QuestionForm → `interaction` | `interaction` → `onUserInteraction` hook |

:::tip State persistence and user event handling
It is up to the `end-user`/`target system` to define mechanisms for end-user
state persistence or any other additional behaviour.
:::

## Composite Elements

Composite content elements can be configured using the `isComposite` flag in the
manifest. To render a list of composite elements, use the `TailorEmbeddedContainer`
global component. Each learning platform that integrates composite content
elements should have a globally registered `TailorEmbeddedContainer` component to
handle the rendering and listing of embedded elements. The CEK runtime provides
a global component that mocks example elements when running inside the CEK environment.

The `TailorEmbeddedContainer` component accepts the following props:
- `:elements`: Array; An array of embedded content elements.
