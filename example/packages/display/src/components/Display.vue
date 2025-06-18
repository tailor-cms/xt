<template>
  <div class="tce-root">
    <div class="d-flex align-center text-h5">
      {{ elementData.description || 'Author click count' }}
      <VSpacer />
      <div class="counter">{{ elementData.count }}</div>
    </div>
    <VBtn class="my-8" variant="tonal" @click="submit">Submit interaction</VBtn>
    <div>
      <div class="text-overline font-weight-bold">User state:</div>
      <VSheet class="py-2 px-4" color="grey-lighten-3" rounded="lg">
        <pre class="my-1 text-body-2">{{
          stringifyObject(userState, { indent: '  ' })
        }}</pre>
      </VSheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Element } from 'tce-manifest';
import stringifyObject from 'stringify-object';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits(['interaction']);

const elementData = computed(() => props.element.data);
const submit = () => emit('interaction', { count: elementData.value.count });
</script>

<style scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}

.counter {
  margin-left: 1rem;
  padding: 1rem;
  color: #23f48b;
  font-size: 2rem;
  font-weight: bold;
  background-color: #323338;
  border-radius: 0.5rem;
}
</style>
