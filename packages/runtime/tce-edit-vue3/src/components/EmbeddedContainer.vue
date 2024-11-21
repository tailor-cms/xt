<template>
  <div class="embedded-container pa-4">
    <div v-for="element in embeds" :key="element.id" class="position-relative">
      <ContentElementExample
        :id="element.id"
        :data="element.data"
        :is-disabled="isDisabled"
        :type="element.type"
        class="mb-2"
        @save="save(element, 'data', $event)"
      />
      <VBtn
        v-if="!isDisabled && enableAdd"
        class="position-absolute ma-4 top-0 right-0"
        color="secondary"
        density="comfortable"
        icon="mdi-delete-outline"
        size="small"
        variant="tonal"
        @click="requestDeleteConfirmation(element)"
      />
    </div>
    <VBottomSheet v-if="!isDisabled" class="mx-5" close-on-content-click>
      <template #activator="{ props: bottomSheetProps }">
        <VBtn
          v-bind="bottomSheetProps"
          class="mt-2"
          color="primary-darken-2"
          icon="mdi-plus"
          size="small"
          variant="tonal"
        />
      </template>
      <VSheet class="pa-6">
        <div class="text-subtitle-2 mb-4">Example Elements</div>
        <div class="d-flex flex-wrap ga-5 w-100">
          <VBtn
            v-for="type in types"
            :key="type"
            class="pa-4"
            color="primary-darken-3"
            height="auto"
            prepend-icon="mdi-cube"
            rounded="lg"
            variant="tonal"
            width="120"
            stacked
            @click="addItem(type)"
          >
            Example {{ type }}
          </VBtn>
        </div>
      </VSheet>
    </VBottomSheet>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, inject } from 'vue';
import cloneDeep from 'lodash/cloneDeep.js';
import sortBy from 'lodash/sortBy.js';
import { v4 } from 'uuid';

import ContentElementExample from './ContentElementExample.vue';

const eventBus = inject('$eventBus') as any;
const appChannel = eventBus.channel('app');

interface Props {
  types?: string[];
  container: { embeds: Record<string, any> };
  addElementOptions?: Record<string, any>;
  isDisabled?: boolean;
  enableAdd?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  types: () => ['HTML', 'IMAGE', 'VIDEO'],
  addElementOptions: () => ({}),
  isDisabled: false,
  enableAdd: true,
});
const emit = defineEmits(['delete', 'save']);

const embeds = computed(() => {
  const items = Object.values(props.container.embeds ?? {});
  return sortBy(items, 'position');
});

const createEmbedElement = (type) => ({
  id: v4(),
  data: { title: `Example Element` },
  embedded: true,
  position: embeds.value.length,
  type,
});

const addItem = (type: string) => {
  const item = createEmbedElement(type);
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
  return appChannel.emit('showConfirmationModal', {
    title: 'Delete element?',
    message: 'Are you sure you want to delete element?',
    action: () => emit('delete', element),
  });
};
</script>
