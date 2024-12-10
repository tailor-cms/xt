<template>
  <div class="embedded-container align-center">
    <div class="d-flex flex-column ga-4">
      <div
        v-for="element in embeds"
        :key="element.id"
        class="element-wrapper text-center position-relative pa-12"
      >
        <VAvatar class="mb-4" color="primary-darken-4" size="x-large">
          <VIcon color="white" icon="mdi-cube" size="x-large" />
        </VAvatar>
        <div class="text-grey-darken-4 text-h5">Example Content Element</div>
        <VChip class="mt-2" color="grey-darken-1" rounded="pill">
          ID: {{ element.id }}
        </VChip>
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
    </div>
    <VBtn v-bind="addBtnProps" class="flex-grow-0 my-4" @click="addItem" />
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
          <VBtn
            color="blue-grey-darken-2"
            variant="text"
            @click="isDialogVisible = false"
          >
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep.js';
import sortBy from 'lodash/sortBy.js';
import { v4 } from 'uuid';
import type { VBtn } from 'vuetify/components';

interface AddElementOptions {
  large: boolean;
  label: string;
  icon: string;
  color: string;
  variant: VBtn['variant'];
}

interface Props {
  container: { embeds: Record<string, any> };
  addElementOptions?: AddElementOptions;
  isDisabled?: boolean;
  enableAdd?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  addElementOptions: () => ({
    large: false,
    label: 'Add content',
    icon: 'mdi-plus',
    color: 'primary-darken-4',
    variant: 'tonal',
  }),
  isDisabled: false,
  enableAdd: true,
});
const emit = defineEmits(['delete', 'save']);

const eventBus = inject('$eventBus') as any;
const appChannel = eventBus.channel('app');

const isDialogVisible = ref(false);

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
  } = props.addElementOptions;
  if (!large) return { icon, color, variant, size: 'small' };
  return { text: label, prependIcon: icon, color, variant };
});

const createEmbedElement = () => ({
  id: v4(),
  data: {},
  embedded: true,
  position: embeds.value.length,
  type: 'EXAMPLE',
});

const addItem = () => {
  isDialogVisible.value = true;
  const item = createEmbedElement();
  const container = cloneDeep(props.container);
  Object.assign(container.embeds, { [item.id]: item });
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
