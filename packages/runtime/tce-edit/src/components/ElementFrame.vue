<template>
  <div :class="{ focused: isFocused }" class="content-element card rounded-lg">
    <div class="card-header d-flex align-center">
      <div class="type-label d-flex align-center flex-shrink-0">
        <VIcon :icon="icon" color="secondary" size="x-small" start />
        <span class="text-label-small font-weight-semibold text-uppercase">
          {{ name }}
        </span>
      </div>
      <VSpacer />
      <div v-if="showDelete && !isReadonly" class="element-actions">
        <VBtn
          aria-label="Delete element"
          color="error"
          icon="mdi-trash-can-outline"
          rounded="lg"
          size="x-small"
          variant="text"
          @click="emit('delete')"
        />
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  name: string;
  icon?: string;
  isFocused?: boolean;
  isReadonly?: boolean;
  showDelete?: boolean;
}

withDefaults(defineProps<Props>(), {
  icon: 'mdi-cube-outline',
  isFocused: false,
  isReadonly: false,
  showDelete: false,
});

const emit = defineEmits(['delete']);
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

.card-header {
  min-height: 2.75rem;
  padding: 0.375rem 0.5rem 0.375rem 0.75rem;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);

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
