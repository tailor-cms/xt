<template>
  <ElementFrame
    :is-readonly="isReadonly"
    :name="name"
    :show-delete="!parent"
    icon="mdi-cube-outline"
    @delete="requestDeleteConfirmation(element)"
  >
    <VTextarea
      :model-value="element.data.content"
      :readonly="isReadonly"
      bg-color="transparent"
      class="text-center"
      placeholder="Enter your text..."
      rows="3"
      variant="solo"
      auto-grow
      flat
      hide-details
      @change="$emit('save', { content: $event.target.value })"
    />
  </ElementFrame>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

import ElementFrame from './ElementFrame.vue';

interface Props {
  element: Record<string, any>;
  parent?: Record<string, any> | null;
  isReadonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isReadonly: false,
  parent: null,
});
const emit = defineEmits(['delete', 'save']);

const eventBus = inject('$eventBus') as any;
const appChannel = eventBus.channel('app');

const name = computed(() =>
  String(props.element.type ?? 'Element').replace(/_/g, ' '),
);

const requestDeleteConfirmation = (element) => {
  return appChannel.emit('showConfirmationModal', {
    title: 'Delete element?',
    message: 'Are you sure you want to delete element?',
    action: () => emit('delete', element),
  });
};
</script>

<style lang="scss" scoped>
:deep(.card-body) {
  padding: 0 0.5rem;
}
</style>
