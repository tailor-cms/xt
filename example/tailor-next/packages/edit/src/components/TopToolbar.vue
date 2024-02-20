<template>
  <button @click="decrement">Decrement</button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, inject } from 'vue';
import { Element } from 'tce-manifest';

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
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #444;
  background-color: #fff;
}
</style>
