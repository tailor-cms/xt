<template>
  <main :class="{ 'dark-theme': isDark }">
    <SplashLoader :is-visible="!isInitialized" />
    <template v-if="isInitialized">
      <PreviewPanel
        id="panelTop"
        :element-id="element?.uid"
        :is-loaded="true"
      />
      <BottomPanel
        id="panelBottom"
        :element="props.element"
        :is-loaded="true"
        :user-state="props.userState"
        class="preview-panel-bottom"
        @reset-element="$emit('resetElement')"
        @reset-state="$emit('resetState')"
      />
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Split from 'split.js';

import BottomPanel from './BottomPanel.vue';
import PreviewPanel from './PreviewPanel.vue';
import SplashLoader from './SplashLoader.vue';
import { useGlobalState } from '../state';

defineEmits(['resetElement', 'resetState']);
const props = defineProps<{ element: any; userState: any }>();

const { isDark } = useGlobalState();

const isLoaded = ref(false);
const isMounted = ref(false);
const isInitialized = computed(() => isMounted.value && props.element?.uid);

watch(isInitialized, (val) => {
  if (val) setupPreview();
});

onMounted(() => {
  isMounted.value = true;
});

const setupPreview = () => {
  setTimeout(() => {
    Split([`#panelTop`, `#panelBottom`], {
      direction: 'vertical',
      sizes: [70, 30],
    });
  }, 50);
  setTimeout(() => {
    isLoaded.value = true;
  }, 2000);
};
</script>

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
