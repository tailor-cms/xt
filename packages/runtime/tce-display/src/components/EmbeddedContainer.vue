<template>
  <div class="embedded-container">
    <ContentElement
      v-for="element in elements"
      :key="element.id"
      :element="element"
      class="mb-2"
    />
  </div>
</template>

<script setup lang="ts">
import ContentElement from './ContentElementExample.vue';

defineProps<{ elements: any[] }>();
</script>
