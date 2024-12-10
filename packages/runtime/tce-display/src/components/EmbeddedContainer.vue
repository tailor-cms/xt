<template>
  <div class="embedded-container d-flex flex-column ga-2">
    <VSheet
      v-for="element in elements"
      :key="element.id"
      class="text-center pa-12"
      color="grey-lighten-5"
      border
      rounded
    >
      <VAvatar class="mb-4" color="grey-darken-4" size="x-large">
        <VIcon icon="mdi-cube" size="x-large" />
      </VAvatar>
      <div class="text-h5">Example Content Element</div>
      <VChip class="mt-2" color="grey-darken-1" rounded="pill">
        ID: {{ element.id }}
      </VChip>
    </VSheet>
  </div>
</template>

<script setup lang="ts">
defineProps<{ elements: any[] }>();
</script>

<style scoped>
.text-subtitle-1 {
  line-height: 1;
}
</style>
