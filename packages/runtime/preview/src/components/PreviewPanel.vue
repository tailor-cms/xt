<template>
  <div v-show="isLoaded" class="d-flex flex-grow-1 preview-panel">
    <div :id="PANELS.EDIT" class="d-flex flex-1-1-50">
      <iframe
        :key="`author-${isLoaded ? new Date().getTime() : 0}`"
        class="flex-1-1-100"
        frameBorder="0"
        sandbox="allow-scripts"
        src="http://localhost:8010"
        title="Edit component container"
      >
      </iframe>
    </div>
    <div :id="PANELS.DISPLAY" class="d-flex flex-1-1-50">
      <iframe
        :key="`display-${isLoaded ? new Date().getTime() : 0}`"
        class="flex-1-1-100"
        frameBorder="0"
        sandbox="allow-scripts"
        src="http://localhost:8020"
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

const { previewPanelSplit } = useGlobalState();

defineProps<{ isLoaded: Boolean }>();

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
