<template>
  <div class="tce-container">
    <div>Times clicked: {{ element.data.count }}</div>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { Element } from 'tce-manifest';

const props = defineProps<{ element: Element; isFocused: boolean }>();
const emit = defineEmits(['save']);

const increment = () => {
  const { data } = props.element;
  const count = data.count + 1;
  emit('save', { ...data, count });
};
</script>

<style scoped>
.tce-container {
  background-color: transparent;
  margin-top: 1rem;
  padding: 1rem;
  border: 2px dashed #888;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #444;
  background-color: #fff;
}
</style>
