<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Split from 'split.js';

import BottomPanel from './BottomPanel.vue';
import PreviewPanel from './PreviewPanel.vue';
import SplashLoader from './SplashLoader.vue';
import { useGlobalState } from '../state';

defineEmits(['resetElement', 'resetState']);
const props = defineProps<{ element: any; userState: any }>();

const { isDark } = useGlobalState();
const isLoaded = ref(false);

const runtimeId = import.meta.env.VITE_RUNTIME_ID;
const bootRegistry = JSON.parse(
  localStorage.getItem('element-kit-boot') || '{}',
);
const isFirstBoot = !bootRegistry[runtimeId];
if (isFirstBoot) {
  localStorage.setItem(
    'element-kit-boot',
    JSON.stringify({
      ...bootRegistry,
      [runtimeId]: true,
    }),
  );
}

onMounted(() => {
  // Client/server vertical split
  Split([`#panelTop`, `#panelBottom`], {
    direction: 'vertical',
    sizes: [70, 30],
  });
  setTimeout(
    () => {
      isLoaded.value = true;
      if (isFirstBoot) document.location.reload();
    },
    isFirstBoot ? 25000 : 5000,
  );
});
</script>

<template>
  <main :class="{ 'dark-theme': isDark }">
    <SplashLoader :is-first-boot="isFirstBoot" :is-visible="!isLoaded" />
    <PreviewPanel id="panelTop" :is-loaded="isLoaded" />
    <BottomPanel
      id="panelBottom"
      :element="props.element"
      :is-loaded="isLoaded"
      :user-state="props.userState"
      class="preview-panel-bottom"
      @reset-element="$emit('resetElement')"
      @reset-state="$emit('resetState')"
    />
  </main>
</template>

<style>
main {
  height: calc(100vh - var(--nav-height));

  .preview-panel-bottom {
    background-color: #eceff1;
    overflow-y: auto;
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
  cursor: row-resize;
  background-color: #fff;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}

.dark-theme {
  .gutter.gutter-horizontal,
  .gutter.gutter-vertical {
    background-color: #333;
  }
}
</style>
