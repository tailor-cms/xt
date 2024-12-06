<template>
  <VSheet class="text-center pa-12" color="grey-lighten-5" border rounded>
    <VAvatar class="mb-4" color="grey-darken-4" size="x-large">
      <VIcon icon="mdi-cube" size="x-large" />
    </VAvatar>
    <div class="text-h5 mb-2">{{ element.type }} Example</div>
    <div class="text-grey-darken-2 text-subtitle-1">
      {{ element.data.title }}
    </div>
  </VSheet>
</template>

<script setup lang="ts">
defineProps<{ element: any }>();
</script>

<style scoped>
.text-subtitle-1 {
  line-height: 1;
}
</style>
