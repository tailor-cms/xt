<template>
  <div class="tce-root">
    <div class="d-flex align-center text-h5">
      Author clicked
      <span class="counter">{{ data.count }}</span>
      times!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElementData } from 'tce-manifest';

defineProps<{ data: ElementData }>();
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
