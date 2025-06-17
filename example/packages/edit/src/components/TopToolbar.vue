<template>
  <VToolbarItems>
    <VBtn color="grey-darken-4" prepend-icon="mdi-minus" @click="decrement">
      Decrement
    </VBtn>
  </VToolbarItems>
</template>

<script setup lang="ts">
import { Element } from 'tce-manifest';
import { inject } from 'vue';

const elementBus = inject('$elementBus') as any;

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const decrement = () => {
  const data = props.element.data;
  const count = data.count - 1;
  emit('save', { ...data, count });
  elementBus.emit('decrement', { count });
};
</script>
