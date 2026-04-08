<template>
  <VToolbarItems>
    <VBtn prepend-icon="mdi-minus" size="large" @click="decrement">
      Decrement
    </VBtn>
  </VToolbarItems>
</template>

<script setup lang="ts">
import type { Element, ElementData } from 'tce-manifest';
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
