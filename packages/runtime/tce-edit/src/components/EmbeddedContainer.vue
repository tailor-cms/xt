<template>
  <div class="embedded-container align-center px-12 py-4">
    <div class="d-flex flex-column ga-6 my-2">
      <ContentElement
        v-for="element in embeds"
        :key="element.id"
        v-bind="{ element, isReadonly }"
        @delete="emit('delete', element)"
        @save="save(element, 'data', $event)"
      />
    </div>
    <VBtn
      v-if="!isReadonly && enableAdd"
      v-bind="addBtnProps"
      class="flex-grow-0 my-4"
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
import { cloneDeep, sortBy } from 'lodash-es';
import { computed, ref } from 'vue';
import { v4 } from 'uuid';
import type { VBtn } from 'vuetify/components';

import ContentElement from './ContentElement.vue';

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
  isReadonly?: boolean;
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
  isReadonly: false,
  enableAdd: true,
});
const emit = defineEmits(['delete', 'save']);

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
  data: {
    content: '',
    width: 12,
  },
  embedded: true,
  position: embeds.value.length,
  type: 'EXAMPLE',
});

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
