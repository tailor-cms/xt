<template>
  <VApp>
    <VMain class="pa-4">
      <VContainer>
        <VRow>
          <VCol>
            <VSheet class="d-flex align-end" color="transparent" height="40">
              <VChip
                class="elevation-2 body-2 font-weight-bold"
                color="primary-darken-1"
                label
              >
                Authoring component
              </VChip>
              <VSpacer />
              <VBtn
                v-if="isAiEnabled"
                :disabled="isReadonly || isGeneratingContent"
                class="mr-2"
                color="indigo-darken-2"
                prepend-icon="mdi-creation"
                size="small"
                text="Do the magic"
                variant="tonal"
                @click="doTheMagic"
              />
              <VMenu :close-on-content-click="false" width="300" offset-y>
                <template #activator="{ props: menuProps }">
                  <VBtn
                    v-bind="menuProps"
                    color="primary-darken-2"
                    prepend-icon="mdi-cog"
                    size="small"
                    text="Settings"
                    variant="tonal"
                  />
                </template>
                <VCard class="pa-4">
                  <div class="settings-header text-overline">
                    <VIcon icon="mdi-cog" size="small" start />
                    Element Props
                  </div>
                  <VCheckbox
                    v-model="isReadonly"
                    color="primary"
                    density="comfortable"
                    label="Readonly"
                    hide-details
                  />
                  <VCheckbox
                    v-model="persistFocus"
                    :disabled="isReadonly"
                    color="primary"
                    density="comfortable"
                    label="Focused"
                    hide-details
                  />
                  <VCheckbox
                    v-model="isDragged"
                    :disabled="isReadonly"
                    color="primary"
                    density="comfortable"
                    label="Dragged"
                    hide-details
                  />
                  <div class="settings-header text-overline mt-4">
                    <VIcon icon="mdi-cube" size="small" start />
                    Element Data
                  </div>
                  <VCheckbox
                    :disabled="forceFullWidth"
                    :false-value="12"
                    :model-value="element.data.width"
                    :true-value="6"
                    color="primary"
                    density="comfortable"
                    label="Half width"
                    hide-details
                    @click.prevent="confirm(toggleHalfWidth)"
                  />
                  <VCheckbox
                    v-if="isQuestion"
                    :disabled="isToggleGradableDisabled"
                    :model-value="isGradable"
                    color="primary"
                    density="comfortable"
                    label="Gradable"
                    hide-details
                    @click.prevent="confirm(toggleGradable)"
                  />
                  <template v-if="isAiEnabled">
                    <div class="settings-header text-overline mt-4">
                      <VIcon icon="mdi-creation" size="small" start />
                      AI Context
                    </div>
                    <VTextarea
                      v-if="isAiEnabled"
                      v-model="aiContext"
                      placeholder="Enter context for AI generation..."
                      rows="3"
                      variant="outlined"
                      hide-details
                    />
                  </template>
                </VCard>
              </VMenu>
            </VSheet>
            <VSheet class="mt-6 pa-8" color="white" elevation="3" rounded="lg">
              <div
                v-if="isGeneratingContent"
                class="d-flex flex-wrap justify-center py-16"
              >
                <VProgressCircular
                  class="w-100"
                  color="primary-darken-2"
                  size="68"
                  indeterminate
                >
                  <img
                    alt="Tailor logo"
                    src="https://avatars.githubusercontent.com/u/142484057"
                    width="32"
                  />
                </VProgressCircular>
                <div class="mt-8 text-primary-darken-4 font-weight-bold">
                  <span>Content generation in progress...</span>
                </div>
              </div>
              <VRow v-else>
                <VCol v-if="element?.data" :cols="element.data.width ?? 12">
                  <VSheet
                    v-click-outside="{
                      handler: () => !persistFocus && unfocusElement(),
                      include,
                    }"
                    :class="{ focused: isFocused }"
                    class="edit-frame"
                    @click="!persistFocus && focusElement()"
                  >
                    <QuestionCard
                      v-if="isQuestion"
                      v-bind="{
                        type,
                        icon,
                        element,
                        isDragged,
                        isReadonly,
                        isFocused,
                      }"
                      @delete="onDelete"
                      @link="onLink"
                      @save="onSave"
                    />
                    <Edit
                      v-else
                      v-bind="{
                        element,
                        isDragged,
                        isReadonly,
                        isFocused,
                      }"
                      @delete="onDelete"
                      @link="onLink"
                      @save="onSave"
                    />
                  </VSheet>
                </VCol>
              </VRow>
            </VSheet>
          </VCol>
        </VRow>
        <VRow v-if="TopToolbar">
          <VCol>
            <div class="d-flex align-center">
              <VChip
                class="elevation-2 my-3 body-2 font-weight-bold"
                color="grey-darken-3"
                label
              >
                Top toolbar
              </VChip>
            </div>
            <VSlideYTransition>
              <VSheet
                v-if="element?.data && isFocused"
                class="top-toolbar"
                color="white"
                elevation="1"
              >
                <component
                  :is="TopToolbar"
                  :key="isGradable"
                  :element="element"
                  @delete="onDelete"
                  @save="onSave"
                />
              </VSheet>
            </VSlideYTransition>
          </VCol>
        </VRow>
        <VRow v-if="SideToolbar">
          <VCol>
            <div class="d-flex align-center">
              <VChip
                class="elevation-2 my-3 body-2 font-weight-bold"
                color="grey-darken-3"
                label
              >
                Side toolbar
              </VChip>
            </div>
            <VSlideXTransition>
              <VSheet
                v-if="element?.data && isFocused"
                class="side-toolbar"
                color="primary-darken-2"
                elevation="5"
              >
                <component
                  :is="SideToolbar"
                  :key="isGradable"
                  :element="element"
                  @delete="onDelete"
                  @save="onSave"
                />
              </VSheet>
            </VSlideXTransition>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
    <VDialog v-model="isLinkDialogVisible" width="500" attach persistent>
      <VCard>
        <VCardTitle class="text-h5">Link element dialog</VCardTitle>
        <VCardText>
          In Tailor, this action will open a dialog to select a content element
          to link to. The `refs` property is updated with mock data to reflect
          the mocked selection.
        </VCardText>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn
            color="blue-grey-darken-2"
            variant="text"
            @click="isLinkDialogVisible = false"
          >
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <ConfirmationDialog />
  </VApp>
</template>

<script lang="ts" setup>
import {
  getApiClient,
  initWebSocket,
  resolveElementId,
} from '@tailor-cms/cek-common';
import {
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import type { Element } from '@tailor-cms/cek-common';

import assetApi from './api/asset';
import ConfirmationDialog from './components/ConfirmationDialog.vue';
import QuestionCard from './components/QuestionCard.vue';

const { TopToolbar, SideToolbar } = getCurrentInstance().appContext.components;

const { VITE_SERVER_RUNTIME_URL } = import.meta.env;
const serverRuntimeUrl = new URL(VITE_SERVER_RUNTIME_URL);
const api = getApiClient(VITE_SERVER_RUNTIME_URL);

provide('$storageService', assetApi);

const eventBus = inject<any>('$eventBus');
const appChannel = eventBus.channel('app');

interface Props {
  isQuestion?: boolean;
  isGradable?: boolean;
  isAiEnabled?: boolean;
  type?: string;
  icon?: string;
  forceFullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isQuestion: false,
  isGradable: undefined,
  isAiEnabled: false,
  type: 'Content Element',
  icon: 'mdi-cube',
  forceFullWidth: false,
});

const emit = defineEmits(['save', 'delete']);

const element = ref<Element>();
const isFocused = ref(false);
const isReadonly = ref(false);
const isDragged = ref(false);
const persistFocus = ref(false);

const isLinkDialogVisible = ref(false);
const isGradable = ref(props.isGradable ?? true);
const isGeneratingContent = ref(false);

const aiContext = ref('');

const isToggleGradableDisabled = ref(
  props.isQuestion && props.isGradable !== undefined,
);

const include = () => [
  document.querySelector('.top-toolbar'),
  document.querySelector('.side-toolbar'),
];

onMounted(async () => {
  const elementId = resolveElementId();
  if (!elementId) return;
  await load(elementId);
  const wsBus = initWebSocket(serverRuntimeUrl, elementId);
  wsBus.on('element:update', (v: Element) => (element.value = v));
});

const focusElement = () => {
  if (!isReadonly.value) isFocused.value = true;
};

const unfocusElement = () => {
  isFocused.value = false;
};

const onSave = (data) => {
  updateElementData(data);
  emit('save', data);
};

const onDelete = () => {
  emit('delete');
};

const doTheMagic = async () => {
  isGeneratingContent.value = true;
  persistFocus.value = false;
  isDragged.value = false;
  try {
    const res = await api.generateContent(aiContext.value.trim());
    const { width, isGradable } = element.value.data;
    await updateElementData({ ...res.data, width, isGradable });
  } catch (error) {
    console.log('Error on element content generate:', error);
  } finally {
    isGeneratingContent.value = false;
    await resetState();
    await nextTick();
    isFocused.value = true;
  }
};

const onLink = () => {
  isLinkDialogVisible.value = true;
  const refs = {
    linked: [
      {
        outlineId: 1,
        containerId: 2,
        id: 3,
      },
    ],
  };
  return api.updateElement(element.value.uid, { refs });
};

const load = async (elementId: string) => {
  try {
    const response = await api.getElement(elementId);
    if (response === null) return;
    element.value = response?.element;
    isGradable.value = element.value.data.isGradable as boolean;
  } catch (error) {
    console.log('Error on element get', error);
    setTimeout(() => load(elementId), 2000);
  }
};

const resetState = () =>
  api
    .resetState(element.value.uid)
    .catch((error) => console.log('Error on state reset', error));

const updateElementData = async (data) => {
  try {
    element.value = await api.updateElement(element.value.uid, { data });
  } catch (error) {
    console.log('Error on element update', error);
  }
};

const initState = async () => {
  const { initState } = await import(
    /* @vite-ignore */ import.meta.env.MANIFEST_DIR
  );
  return initState();
};

const toggleGradable = async () => {
  const data = await initState();
  const newGradableValue = !isGradable.value;
  data.isGradable = newGradableValue;
  if (!newGradableValue) delete data.correct;
  await updateElementData({
    ...data,
    width: element.value.data.width,
  });
  isGradable.value = data.isGradable;
  return resetState();
};

const toggleHalfWidth = async () => {
  const data = await initState();
  const { width, isGradable } = element.value.data;
  const newWidth = width === 12 ? 6 : 12;
  await updateElementData({ ...data, width: newWidth, isGradable });
  return resetState();
};

const confirm = (action) => {
  return appChannel.emit('showConfirmationModal', {
    title: 'Are you sure?',
    message: 'This action will reset element data and state',
    action,
  });
};

watch(persistFocus, (val) => {
  if (val) isFocused.value = true;
});

watch(isReadonly, (val) => {
  if (!val) return;
  persistFocus.value = false;
  isFocused.value = false;
  isDragged.value = false;
});
</script>

<style lang="scss" scoped>
.v-application {
  background-color: transparent !important;
}

.side-toolbar {
  padding: 1.75rem 0.875rem 1.5rem;
  max-width: 30rem;
}

.top-toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 5.5rem;
  padding: 0.5rem 2rem;
  border-bottom: 4px solid #cfd8dc;

  :deep(.v-input) {
    position: relative;

    .v-input__details {
      position: absolute;
      padding: 0 !important;

      .v-messages {
        margin-top: 0.5rem;
        border-radius: 4px;
        padding: 0.5rem 0.75rem;
        background-color: #424242;
        color: #fff !important;
      }
    }
  }
}

.edit-frame {
  border: 1px solid #e1e1e1;
  padding: 0.625rem 1.25rem;

  &.focused {
    border: 1px dashed #1de9b6;
    border-right-width: 2px;
    border-right-style: solid;
  }
}

:deep(.v-input.required) {
  .v-field-label {
    padding-inline-end: 0.5rem;

    &::after {
      position: absolute;
      content: '*';
      top: 0;
      // support also RTL direction
      inset-inline-end: 0;
    }
  }
}

.settings-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}
</style>
