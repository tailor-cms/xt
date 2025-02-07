<template>
  <div>
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <div
        v-bind="hoverProps"
        class="element-wrapper text-center position-relative px-3"
      >
        <VTextarea
          :model-value="element.data.content"
          :readonly="isDisabled"
          bg-color="transparent"
          placeholder="Enter your text..."
          rows="3"
          variant="solo"
          auto-grow
          flat
          hide-details
          @change="$emit('save', { content: $event.target.value })"
        />
        <div
          v-if="!isDisabled && !parent"
          :class="{ 'is-visible': isHovering }"
          class="element-actions"
        >
          <VBtn
            color="secondary"
            density="comfortable"
            icon="mdi-delete-outline"
            size="small"
            variant="tonal"
            @click="requestDeleteConfirmation(element)"
          />
        </div>
      </div>
    </VHover>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

interface Props {
  element: Record<string, any>;
  parent: Record<string, any>;
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
.element-wrapper {
  border: 1px solid #e1e1e1;
}

.element-actions {
  position: absolute;
  height: 100%;
  top: 0.125rem;
  right: -2.25rem;
  opacity: 0;
  transition: opacity 0.3s linear;

  &.is-visible {
    opacity: 1;
  }
}
</style>
