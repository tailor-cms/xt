<template>
  <VBtn prepend-icon="mdi-minus" variant="text" @click="decrement">
    Decrement
  </VBtn>
</template>

<script setup lang="ts">
import type { Element, ElementData } from 'tce-counter-manifest';
import { inject } from 'vue';

const elementBus = inject('$elementBus') as any;

const props = defineProps<{ element: Element }>();
const emit = defineEmits<{ save: [data: ElementData] }>();

const decrement = () => {
  const data = props.element.data;
  const count = data.count - 1;
  emit('save', { ...data, count });
  elementBus.emit('decrement', { count });
};
</script>
