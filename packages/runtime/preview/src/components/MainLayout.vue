<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Split from 'split.js';

import { useDarkGlobal } from '../utils';

const DARK_BACKGROUND = '#CFD8DC';
const LIGHT_BACKGROUND = '#ECEFF1';

const isDark = useDarkGlobal();
const backgroundColor = ref('');

watch(
  isDark,
  (value) => {
    backgroundColor.value = value ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  },
  { immediate: true },
);

onMounted(() => Split(['#splitA', '#splitB']));
</script>

<template>
  <main :class="{ 'dark-theme': isDark }">
    <div class="d-flex h-100">
      <iframe
        id="splitA"
        :style="{ backgroundColor }"
        frameBorder="0"
        sandbox="allow-scripts"
        src="http://localhost:8010"
        title="Edit component container"
      >
      </iframe>
      <iframe
        id="splitB"
        :style="{ backgroundColor }"
        frameBorder="0"
        sandbox="allow-scripts"
        src="http://localhost:8020"
        title="Display component container"
      >
      </iframe>
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

.dark-theme {
  .gutter.gutter-horizontal {
    background-color: #333;
  }
}
</style>
