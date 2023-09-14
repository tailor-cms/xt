<template>
  <div v-show="isLoaded" class="d-flex flex-grow-1 preview-panel">
    <iframe
      :id="PANELS.EDIT"
      ref="editPanel"
      frameBorder="0"
      sandbox="allow-scripts"
      src="http://localhost:8010"
      title="Edit component container"
    >
    </iframe>
    <iframe
      :id="PANELS.DISPLAY"
      ref="displayPanel"
      frameBorder="0"
      sandbox="allow-scripts"
      src="http://localhost:8020"
      title="Display component container"
    >
    </iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Split from 'split.js';

import { PANELS, useGlobalState } from '../state';

const props = defineProps<{ isLoaded: Boolean }>();

const editPanel = ref(null);
const displayPanel = ref(null);
const { previewPanelSplit } = useGlobalState();

onMounted(() => {
  previewPanelSplit.value = Split([`#${PANELS.EDIT}`, `#${PANELS.DISPLAY}`], {
    minSize: [0, 0],
  });
});

watch(props.isLoaded, (isLoaded) => {
  if (!isLoaded) return;
  reloadPreview();
});

const reloadPreview = () => {
  /* eslint-disable */
  // @ts-ignore
  editPanel.value.src = editPanel.value.src;
  // @ts-ignore
  displayPanel.value.src = displayPanel.value.src;
  /* eslint-enable */
};
</script>
