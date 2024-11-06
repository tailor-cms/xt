<template>
  <VCard
    :subtitle="`ID: ${element.id}`"
    :title="element.data.title || 'Untitled'"
    color="blue-grey-darken-3"
    prepend-icon="mdi-cube"
    variant="tonal"
  />
</template>

<script setup lang="ts">
defineProps<{ element: any }>();
</script>
