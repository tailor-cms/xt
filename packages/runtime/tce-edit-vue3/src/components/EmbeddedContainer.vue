<template>
  <div class="embedded-container pa-4">
    <div v-for="element in embeds" :key="element.id" class="position-relative">
      <ContentElementExample
        :id="element.id"
        :data="element.data"
        :is-disabled="isDisabled"
        class="mb-2"
        @save="save(element, 'data', $event)"
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
    <VBtn
      v-if="!isDisabled"
      class="mt-2"
      color="primary-darken-2"
      icon="mdi-plus"
      size="small"
      variant="tonal"
      @click="addItem"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, inject } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import { v4 } from 'uuid';

import ContentElementExample from './ContentElementExample.vue';

const eventBus = inject('$eventBus') as any;

interface Props {
  types: string[];
  container: { embeds: Record<string, any> };
  addElementOptions?: Record<string, any>;
  isDisabled?: boolean;
  enableAdd?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  addElementOptions: () => ({}),
  isDisabled: false,
  enableAdd: true,
});
const emit = defineEmits(['delete', 'save']);

const embeds = computed(() => {
  const items = Object.values(props.container.embeds ?? {});
  return sortBy(items, 'position');
});

const createEmbedElement = () => ({
  id: v4(),
  data: { title: 'Example Element' },
  embedded: true,
  position: embeds.value.length,
  type: 'EXAMPLE',
});

const addItem = () => {
  const item = createEmbedElement();
  const container = cloneDeep(props.container);
  Object.assign(container.embeds, { [item.id]: item });
  emit('save', container);
};

const save = (item, key, value) => {
  const container = cloneDeep(props.container);
  Object.assign(container.embeds[item.id], { [key]: value });
  emit('save', container);
};

const requestDeleteConfirmation = (element) => {
  return eventBus.emit('showConfirmationModal', {
    title: 'Delete element?',
    message: 'Are you sure you want to delete element?',
    action: () => emit('delete', element),
  });
};
</script>
