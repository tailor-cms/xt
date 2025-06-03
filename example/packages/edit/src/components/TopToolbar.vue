<template>
  <button @click="decrement">Decrement</button>
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

<style scoped>
button {
  padding: 0.5rem 1rem;
  background-color: #eee;
  border: 1px solid #444;
  border-radius: 0.125rem;
}
</style>
