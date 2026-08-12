<!-- eslint-disable
  vuejs-accessibility/click-events-have-key-events,
  vuejs-accessibility/no-static-element-interactions -->
<template>
  <div
    ref="rootEl"
    :class="[
      isField ? 'field rounded' : 'card rounded-lg',
      { quiet: isQuiet, focused: isFocused },
    ]"
    class="content-element"
  >
    <div
      v-if="!isField"
      :class="{ revealed: isHighlighted }"
      class="header-reveal"
    >
      <div
        :class="{ expanded: isExpanded }"
        class="card-header d-flex align-center"
        @click="toggleExpanded"
      >
        <span v-if="!isReadonly && isDraggable" class="drag-handle" @click.stop>
          <span class="mdi mdi-drag-vertical"></span>
        </span>
        <div
          :class="{ 'ml-2': isReadonly || !isDraggable }"
          class="type-label d-flex align-center flex-shrink-0"
        >
          <VIcon :icon="icon" color="secondary" size="x-small" start />
          <span class="text-label-small font-weight-semibold text-uppercase">
            {{ name }}
          </span>
        </div>
        <template v-if="!isExpanded">
          <span
            v-if="preview"
            class="mx-3 text-medium-emphasis text-body-medium text-truncate"
          >
            {{ preview }}
          </span>
          <span
            v-else-if="isEmpty"
            class="mx-3 font-italic text-disabled text-body-medium"
          >
            Empty
          </span>
        </template>
        <VSpacer />
        <div v-if="hasActions" class="element-actions" @click.stop>
          <VBtn
            v-if="showReset"
            aria-label="Reset element"
            color="warning"
            icon="mdi-restore"
            rounded="lg"
            size="x-small"
            variant="text"
            @click="emit('reset')"
          />
          <VBtn
            v-if="showDelete"
            aria-label="Delete element"
            color="error"
            icon="mdi-trash-can-outline"
            rounded="lg"
            size="x-small"
            variant="text"
            @click="emit('delete')"
          />
        </div>
        <VBtn
          v-if="!isQuiet"
          :aria-label="isExpanded ? 'Collapse element' : 'Expand element'"
          :icon="`mdi-chevron-${isExpanded ? 'up' : 'down'}`"
          class="ml-1 flex-shrink-0 chevron"
          density="comfortable"
          size="small"
          variant="text"
          @click.stop="toggleExpanded"
        />
      </div>
    </div>
    <VExpandTransition>
      <div v-show="isExpanded">
        <div class="card-body">
          <slot></slot>
        </div>
      </div>
    </VExpandTransition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useElementHover, useFocusWithin } from '@vueuse/core';

interface Props {
  name: string;
  icon?: string;
  isFocused?: boolean;
  isReadonly?: boolean;
  isDraggable?: boolean;
  showReset?: boolean;
  showDelete?: boolean;
  // Collapsed header hint; preview takes precedence over the `Empty` label.
  preview?: string;
  isEmpty?: boolean;
  // Controlled card expansion; null keeps it locally managed.
  expanded?: boolean | null;
  // 'card': standard editor card. 'field': header-less body for
  // externally-labelled slots. 'quiet': header hidden until hover/focus;
  // always expanded, no chevron.
  variant?: 'card' | 'field' | 'quiet';
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-cube-outline',
  isFocused: false,
  isReadonly: false,
  isDraggable: false,
  showReset: false,
  showDelete: false,
  preview: '',
  isEmpty: false,
  expanded: null,
  variant: 'card',
});

const emit = defineEmits(['delete', 'reset', 'update:expanded']);

const rootEl = ref<HTMLElement | null>(null);
const isHovered = useElementHover(rootEl);
const { focused: isFocusWithin } = useFocusWithin(rootEl);

const isField = computed(() => props.variant === 'field');
const isQuiet = computed(() => props.variant === 'quiet');

const localExpanded = ref(props.expanded ?? true);
const isExpanded = computed(() => {
  if (isField.value || isQuiet.value) return true;
  return localExpanded.value;
});

const isHighlighted = computed(
  () => props.isFocused || isHovered.value || isFocusWithin.value,
);

const hasActions = computed(
  () => !props.isReadonly && (props.showReset || props.showDelete),
);

const toggleExpanded = () => {
  localExpanded.value = !localExpanded.value;
  emit('update:expanded', localExpanded.value);
};

watch(
  () => props.expanded,
  (val) => {
    if (val !== null) localExpanded.value = val;
  },
);
</script>

<style lang="scss" scoped>
.content-element {
  $accent-focused: #1de9b6;

  position: relative;
  border: 1px solid transparent;

  &::after {
    $width: 0.125rem;

    content: '';
    display: none;
    position: absolute;
    inset: 0 (-$width) 0 0;
    border-right: $width solid;
    border-radius: inherit;
    pointer-events: none;
  }

  // Nested frames own the accent while they hold focus, so the outer frame
  // does not double up on it.
  &.focused:not(:has(.content-element:focus-within)),
  &:focus-within:not(:has(.content-element:focus-within)) {
    border: 1px dashed $accent-focused;

    &::after {
      display: block;
      border-color: $accent-focused;
    }
  }
}

.card {
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  background: rgb(var(--v-theme-surface-raised));
}

.field {
  border: 1px solid rgba(var(--v-theme-outline), 0.3);
  padding: 1rem;

  .card-body {
    padding: 0;
  }
}

.quiet .header-reveal {
  height: 0;
  overflow: hidden;
  transition: height 0.2s ease;

  &.revealed {
    height: 2.75rem;
  }
}

.card-header {
  min-height: 2.75rem;
  padding: 0.375rem 0.5rem 0.375rem 0.25rem;
  cursor: pointer;

  &.expanded {
    border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
  }

  .drag-handle {
    flex-shrink: 0;
    width: 1.5rem;
    cursor: grab;

    .mdi {
      color: rgba(var(--v-theme-on-surface), 0.4);
      font-size: 1.25rem;
    }
  }

  .chevron {
    border-radius: 8px;
    color: rgba(var(--v-theme-on-surface), 0.65);
  }

  .type-label {
    color: rgb(var(--v-theme-on-surface));
    letter-spacing: 0.05em;
  }
}

.card-body {
  padding: 0.625rem 1.25rem 1rem;
}

.element-actions {
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s linear;

  .content-element:hover &,
  .content-element.focused &,
  .content-element:focus-within & {
    opacity: 1;
  }

  :deep(.v-btn) {
    --v-hover-opacity: 0.12;
  }

  :deep(.v-btn--icon.v-btn--size-x-small) {
    --v-btn-height: 1rem;
  }

  :deep(.v-btn--size-x-small .v-icon) {
    font-size: 1.125rem;
  }
}
</style>
