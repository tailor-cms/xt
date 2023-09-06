<script setup lang="ts">
import 'vue-json-pretty/lib/styles.css';

import { onMounted, ref, watch } from 'vue';
import Split from 'split.js';
import VueJsonPretty from 'vue-json-pretty';

import { PANELS, useGlobalState } from '../state';

const LIGHT_BACKGROUND = '#ECEFF1';
const DARK_BACKGROUND = '#CFD8DC';

const props = defineProps<{ element: any }>();
const { isDark, splitJs } = useGlobalState();
const backgroundColor = ref('');

watch(
  isDark,
  (value) => {
    backgroundColor.value = value ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  },
  { immediate: true },
);

onMounted(() => {
  // Component preview split
  splitJs.value = Split([`#${PANELS.EDIT}`, `#${PANELS.DISPLAY}`], {
    minSize: [0, 0],
  });
  // Client/server vertical split
  Split([`#panelTop`, `#panelBottom`], {
    direction: 'vertical',
    sizes: [70, 30],
  });
});
</script>

<template>
  <main :class="{ 'dark-theme': isDark }">
    <div id="panelTop" class="d-flex">
      <div class="d-flex flex-grow-1">
        <iframe
          :id="PANELS.EDIT"
          :style="{ backgroundColor }"
          frameBorder="0"
          sandbox="allow-scripts"
          src="http://localhost:8010"
          title="Edit component container"
        >
        </iframe>
        <iframe
          :id="PANELS.DISPLAY"
          :style="{ backgroundColor }"
          frameBorder="0"
          sandbox="allow-scripts"
          src="http://localhost:8020"
          title="Display component container"
        >
        </iframe>
      </div>
    </div>
    <div id="panelBottom" :style="{ backgroundColor }">
      <v-tabs density="compact" hide-slider>
        <v-tab>Server state</v-tab>
      </v-tabs>
      <div class="pa-5">
        <VueJsonPretty :data="props.element" />
      </div>
    </div>
  </main>
</template>

<style>
main {
  height: calc(100vh - var(--nav-height));
}

.gutter {
  background-position: 50%;
}

.gutter.gutter-horizontal {
  cursor: col-resize;
  background-color: #fff;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}

.gutter.gutter-vertical {
  cursor: row-resize !important;
  background-color: #fff;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}

.dark-theme {
  .gutter.gutter-horizontal,
  .gutter.gutter-vertical {
    background-color: #333;
  }
}
</style>
