<template>
  <div class="tce-root">
    <div class="d-flex align-center text-h5">
      Author clicked
      <span class="counter">{{ data.count }}</span>
      times!
    </div>
    <v-btn class="my-8" @click="submit">Submit interaction</v-btn>
    <div>User state value: {{ userState }}</div>
  </div>
</template>

<script setup lang="ts">
import { ElementData } from 'tce-manifest';

const props = defineProps<{ data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const submit = () => emit('interaction', { count: props.data.count });
</script>

<style scoped>
.tce-root {
  background-color: transparent;
  margin-top: 1rem;
  padding: 1rem;
  border: 2px dashed #888;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}

.counter {
  margin: 0 1rem;
  padding: 1rem;
  color: #23f48b;
  font-size: 2rem;
  font-weight: bold;
  background-color: #323338;
  border-radius: 0.5rem;
}
</style>
