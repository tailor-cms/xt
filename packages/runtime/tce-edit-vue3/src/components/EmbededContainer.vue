<template>
  <VSheet
    v-for="item in embeds"
    :key="item.id"
    class="mb-2 pa-12 position-relative"
    rounded="lg"
  >
    <VAvatar class="mb-4" color="primary-darken-4" size="x-large">
      <VIcon color="white" icon="mdi-cube" size="x-large" />
    </VAvatar>
    <div class="text-grey-darken-4 text-h5">{{ item.data.content }}</div>
    <div class="text-grey-darken-2 text-subtitle-1">ID: {{ item.id }}</div>
    <VBtn
      v-if="!isDisabled"
      class="position-absolute ma-4 top-0 right-0"
      color="secondary"
      density="comfortable"
      icon="mdi-delete-outline"
      size="small"
      variant="tonal"
      @click="requestDeleteConfirmation(item)"
    />
  </VSheet>
  <VBtn
    v-if="!isDisabled"
    class="mt-2"
    color="primary-darken-2"
    icon="mdi-plus"
    size="small"
    variant="tonal"
    @click="addItem"
  />
</template>

<script setup lang="ts">
import { computed, defineProps, inject } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import { v4 } from 'uuid';

const eventBus = inject('$eventBus') as any;

const props = defineProps<{ container: any; isDisabled: boolean }>();
const emit = defineEmits(['delete', 'save']);

const embeds = computed(() => {
  const items = props.container.embeds ?? {};
  return sortBy(Object.values(items), 'position');
});

const addItem = () => {
  const item = {
    id: v4(),
    data: { content: 'Example Item', width: 12 },
    embedded: true,
    position: embeds.value.length,
    type: 'EXAMPLE',
  };
  const container = cloneDeep(props.container);
  Object.assign(container.embeds, { [item.id]: item });
  emit('save', container);
};

// const deleteElement = (element) => emit('delete', element);

const requestDeleteConfirmation = (element) => {
  return eventBus.emit('showConfirmationModal', {
    title: 'Delete element?',
    message: 'Are you sure you want to delete element?',
    action: () => emit('delete', element),
  });
};
</script>
