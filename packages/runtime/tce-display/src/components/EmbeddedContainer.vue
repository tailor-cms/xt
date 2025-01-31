<template>
  <VSheet class="d-flex flex-column px-4 py-2 ga-2" border rounded>
    <div v-for="element in elements" :key="element.id" class="content-element">
      {{ element.data.content }}
    </div>
  </VSheet>
</template>

<script setup lang="ts">
defineProps<{ elements: any[] }>();
</script>

<style scoped>
.content-element {
  white-space: pre-wrap;
}
</style>
