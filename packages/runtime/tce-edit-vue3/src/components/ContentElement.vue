<template>
  <div class="element-wrapper text-center position-relative pa-12">
    <VAvatar class="mb-4" color="primary-darken-4" size="x-large">
      <VIcon color="white" icon="mdi-cube" size="x-large" />
    </VAvatar>
    <div class="text-grey-darken-4 text-h5">Example Content Element</div>
    <VChip class="mt-2" color="grey-darken-1" rounded="pill">
      ID: {{ element.id }}
    </VChip>
    <VTextarea
      :model-value="element.data.content"
      :readonly="isDisabled"
      class="mt-4 mx-auto"
      max-width="500"
      placeholder="Content"
      rows="2"
      variant="outlined"
      auto-grow
      hide-details
      @change="$emit('save', { content: $event.target.value })"
    />
    <VBtn
      v-if="!isDisabled"
      class="position-absolute ma-4 top-0 right-0"
      color="secondary"
      density="comfortable"
      icon="mdi-delete-outline"
      size="small"
      variant="tonal"
      @click="requestDeleteConfirmation(element)"
    />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { VBtn } from 'vuetify/components';

interface Props {
  element: Record<string, any>;
  isDisabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  isDisabled: false,
});
const emit = defineEmits(['delete', 'save']);

const eventBus = inject('$eventBus') as any;
const appChannel = eventBus.channel('app');

const requestDeleteConfirmation = (element) => {
  return appChannel.emit('showConfirmationModal', {
    title: 'Delete element?',
    message: 'Are you sure you want to delete element?',
    action: () => emit('delete', element),
  });
};
</script>

<style lang="scss" scoped>
.embedded-container {
  padding: 0.625rem 1.5rem;
}

.element-wrapper {
  border: 1px solid #e1e1e1;
  padding: 0.625rem 1.25rem;
  width: 100%;
}
</style>
