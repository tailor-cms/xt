<template>
  <VSheet class="d-flex flex-column align-center pa-12" rounded="lg">
    <VAvatar class="mb-4" color="primary-darken-4" size="x-large">
      <VIcon color="white" icon="mdi-cube" size="x-large" />
    </VAvatar>
    <div class="text-grey-darken-4 text-h5">Example Item</div>
    <div class="text-grey-darken-2 text-subtitle-1 mb-4">ID: {{ id }}</div>
    <VTextField
      :model-value="data.content"
      label="Content"
      variant="outlined"
      width="500"
      hide-details
      @update:model-value="$emit('save', { content: $event })"
    />
  </VSheet>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  id: string;
  data: { content: string };
}>();
defineEmits(['save']);
</script>
