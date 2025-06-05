<template>
  <div v-show="isLoaded" class="d-flex flex-grow-1 preview-panel">
    <div :id="PANELS.EDIT" class="d-flex flex-1-1-50">
      <iframe
        :key="`author-${isLoaded ? new Date().getTime() : 0}`"
        :src="`${VITE_EDIT_RUNTIME_URL}?id=${elementId}`"
        class="flex-1-1-100"
        frameBorder="0"
        title="Edit component container"
      >
      </iframe>
    </div>
    <div :id="PANELS.DISPLAY" class="d-flex flex-1-1-50">
      <iframe
        :key="`display-${isLoaded ? new Date().getTime() : 0}`"
        :src="`${VITE_DISPLAY_RUNTIME_URL}?id=${elementId}`"
        class="flex-1-1-100"
        frameBorder="0"
        title="Display component container"
      >
      </iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Split from 'split.js';

import { PANELS, useGlobalState } from '../state';

const { VITE_DISPLAY_RUNTIME_URL, VITE_EDIT_RUNTIME_URL } = import.meta.env;
const { previewPanelSplit } = useGlobalState();

defineProps<{ isLoaded: Boolean; elementId: string }>();

const initPanels = () => {
  previewPanelSplit.value = Split([`#${PANELS.EDIT}`, `#${PANELS.DISPLAY}`], {
    minSize: [0, 0],
  });
};

onMounted(() => initPanels());
</script>

<style scoped>
iframe {
  background: #eceff1 !important;
}
</style>
