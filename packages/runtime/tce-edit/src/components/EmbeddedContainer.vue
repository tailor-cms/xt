<template>
  <div class="embedded-container align-center pa-4">
    <Draggable
      v-if="!!embeds.length"
      :disabled="isReadonly"
      :list="embeds"
      class="d-flex flex-column ga-4"
      handle=".drag-handle"
      item-key="id"
      @update="reorderItem"
    >
      <template #item="{ element }">
        <ContentElement
          v-bind="{ element, isReadonly }"
          :expanded="defaultExpanded || !initialIds.includes(element.id)"
          :is-draggable="!isReadonly"
          :variant="elementVariant"
          @delete="emit('delete', element)"
          @save="save(element, 'data', $event)"
        />
      </template>
    </Draggable>
    <VBtn
      v-if="!isReadonly && enableAdd"
      v-bind="addBtnProps"
      class="flex-grow-0 mt-4 mb-2"
      @click="addItem"
    />
    <VDialog v-model="isDialogVisible" width="500" attach persistent>
      <VCard
        class="text-left"
        prepend-icon="mdi-information-variant-circle"
        title="Add content element"
      >
        <template #text>
          In Tailor, this action will open a dialog to select a content element
          type to add. Allowed element types are defined through the schema
          configuration.
        </template>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn text="Close" variant="text" @click="isDialogVisible = false" />
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, sortBy } from 'lodash-es';
import { computed, ref } from 'vue';
import Draggable from 'vuedraggable/src/vuedraggable';
import { v4 as uuid } from '@lukeed/uuid/secure';

import ContentElement from './ContentElement.vue';

interface AddElementOptions {
  large?: boolean;
  label?: string;
  icon?: string;
  color?: string;
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain';
}

interface Props {
  container: { embeds: Record<string, any> };
  addElementOptions?: AddElementOptions;
  isReadonly?: boolean;
  enableAdd?: boolean;
  // Baseline expansion state of each embed (`card` variant only).
  // Embeds added during the session always start expanded.
  defaultExpanded?: boolean;
  // Presentation for each embedded element (see ElementFrame `variant`).
  elementVariant?: 'card' | 'field' | 'quiet';
}

const props = withDefaults(defineProps<Props>(), {
  addElementOptions: () => ({
    large: false,
    label: 'Add content',
    icon: 'mdi-plus',
    color: 'primary-darken-4',
    variant: 'tonal',
  }),
  isReadonly: false,
  enableAdd: true,
  defaultExpanded: true,
  elementVariant: 'quiet',
});
const emit = defineEmits(['delete', 'save']);

const isDialogVisible = ref(false);

const initialIds = Object.values(props.container.embeds ?? {}).map(
  (it: any) => it.id,
);

const embeds = computed(() => {
  const items = Object.values(props.container.embeds ?? {});
  return sortBy(items, 'position');
});

const addBtnProps = computed(() => {
  const {
    large = false,
    label = 'Add content',
    icon = 'mdi-plus',
    color = 'primary-darken-4',
    variant = 'tonal',
  } = props.addElementOptions ?? {};
  if (!large) return { icon, color, variant, size: 'small', ariaLabel: label };
  return { text: label, prependIcon: icon, color, variant };
});

const createEmbedElement = () => ({
  id: uuid(),
  data: {
    content: '',
    width: 12,
  },
  embedded: true,
  position: (embeds.value.at(-1)?.position ?? 0) + 1,
  type: 'EXAMPLE',
});

// Position the moved embed between its new neighbors (their `position`
// values are still pre-drag), matching Tailor's `calculatePosition`.
const reorderItem = ({ newIndex }: { newIndex: number }) => {
  const items = embeds.value;
  const { id } = items[newIndex];
  const rest = items.filter((it: any) => it.id !== id);
  const lower = rest[newIndex - 1]?.position ?? 0;
  const upper = rest[newIndex]?.position;
  const container = cloneDeep(props.container);
  container.embeds[id].position =
    upper === undefined ? lower + 1 : (lower + upper) / 2;
  emit('save', container);
};

const save = (item, key, value) => {
  const container = cloneDeep(props.container);
  Object.assign(container.embeds[item.id], { [key]: value });
  emit('save', container);
};

const addItem = () => {
  isDialogVisible.value = true;
  const item = createEmbedElement();
  const container = cloneDeep(props.container);
  Object.assign(container.embeds, { [item.id]: item });
  emit('save', container);
};
</script>

<style lang="scss" scoped>
:deep(.sortable-ghost) {
  .drag-handle {
    display: none;
  }

  .content-element {
    max-height: 9.375rem;
    background: rgb(var(--v-theme-surface-container-low));

    & > * {
      visibility: hidden;
    }
  }
}

:deep(.sortable-drag .content-element) {
  max-height: none;
  background: rgb(var(--v-theme-surface-container-low));
}
</style>
