<template>
  <div class="embedded-container d-flex flex-column ga-2">
    <ContentElement
      v-for="element in elements"
      :key="element.id"
      :element="element"
    />
  </div>
</template>

<script setup lang="ts">
import ContentElement from './ContentElementExample.vue';

defineProps<{ elements: any[] }>();
</script>
