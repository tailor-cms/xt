<template>
  <div class="tce-root">
    <div class="d-flex align-center text-headline-small">
      <span class="description">
        {{ elementData.description || 'Author click count' }}
      </span>
      <VSpacer />
      <VSheet class="pa-4 ml-1" color="grey-darken-3" rounded="lg">
        <span class="text-headline-large font-weight-bold text-green-accent-3">
          {{ elementData.count }}
        </span>
      </VSheet>
    </div>
    <VBtn class="my-8" variant="tonal" @click="submit">Submit interaction</VBtn>
    <div>
      <div class="text-label-medium text-uppercase font-weight-bold mb-2">
        User state:
      </div>
      <VSheet class="py-2 px-4" color="surface-light" rounded="lg">
        <pre class="my-1 text-body-medium">{{
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
</style>
