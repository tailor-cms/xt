<script setup lang="ts">
import { onMounted } from 'vue';
import JsonEditor from 'vue3-ts-jsoneditor';
import Split from 'split.js';

import { PANELS, useGlobalState } from '../state';

// TODO: Enforce order
// const SERVER_PROP_ORDER = [
//   'id',
//   'uid',
//   'type',
//   'position',
//   'data',
//   'meta',
//   'refs',
//   'contentId',
//   'contentSignature',
//   'linked',
//   'detached',
//   'createdAt',
//   'updatedAt',
//   'deletedAt',
// ];

const props = defineProps<{ element: any }>();
const { isDark, splitJs } = useGlobalState();

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
    <div id="panelTop" class="d-flex panel">
      <div class="d-flex flex-grow-1">
        <iframe
          :id="PANELS.EDIT"
          frameBorder="0"
          sandbox="allow-scripts"
          src="http://localhost:8010"
          title="Edit component container"
        >
        </iframe>
        <iframe
          :id="PANELS.DISPLAY"
          frameBorder="0"
          sandbox="allow-scripts"
          src="http://localhost:8020"
          title="Display component container"
        >
        </iframe>
      </div>
    </div>
    <div id="panelBottom" class="panel">
      <v-tabs density="compact" hide-slider>
        <v-tab>Server state</v-tab>
      </v-tabs>
      <div class="pa-5">
        <JsonEditor
          :main-menu-bar="false"
          :status-bar="false"
          :value="props.element"
          mode="text"
        />
      </div>
    </div>
  </main>
</template>

<style>
main {
  height: calc(100vh - var(--nav-height));

  .panel {
    background-color: #eceff1;
  }
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

  .jse-theme-dark .cm-content,
  .jse-theme-dark .cm-gutters {
    background-color: #29292f !important;
  }
}
</style>
