<template>
  <ElementFrame
    v-bind="{ variant, expanded, preview, isDraggable, isReadonly }"
    :is-empty="!preview"
    :show-delete="!parent"
    icon="mdi-text"
    name="Textarea"
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
  // Proxied expansion state (see ElementFrame `expanded`).
  expanded?: boolean | null;
  isDraggable?: boolean;
  variant?: 'card' | 'field' | 'quiet';
}

const props = withDefaults(defineProps<Props>(), {
  isReadonly: false,
  parent: null,
  expanded: null,
  isDraggable: false,
  variant: 'card',
});
const emit = defineEmits(['delete', 'save']);

const eventBus = inject('$eventBus') as any;
const appChannel = eventBus.channel('app');

const preview = computed(() => {
  const content = props.element.data?.content;
  return typeof content === 'string' ? content.trim() : '';
});

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
