<template>
  <div class="embedded-container d-flex flex-column ga-2">
    <div v-for="element in elements" :key="element.id" class="content-element">
      {{ element.data.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ elements: any[] }>();
</script>

<style scoped>
.content-element {
  white-space: pre-wrap;
}
</style>
