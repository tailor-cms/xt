<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Split from "split.js";

import { useDarkGlobal } from "../utils";
const isDark = useDarkGlobal();
const iframe = ref<HTMLIFrameElement>();

watch(isDark, (value) => {
  iframe.value?.contentWindow?.postMessage(
    `theme-${value ? "dark" : "light"}`,
    "*"
  );
});

onMounted(() => Split(["#splitA", "#splitB"]));
</script>

<template>
  <main>
    <div class="d-flex flex-row h-100">
      <iframe
        id="splitA"
        ref="iframe"
        class="w-full p-4"
        frameBorder="0"
        sandbox="allow-scripts"
        src="http://localhost:8010"
        title="Edit component container"
      ></iframe>
      <iframe
        id="splitB"
        ref="iframe"
        class="w-full p-4"
        frameBorder="0"
        sandbox="allow-scripts"
        src="http://localhost:8020"
        title="Display component container"
      ></iframe>
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
  background-color: #333;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
  cursor: col-resize;
}
</style>
