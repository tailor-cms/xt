<template>
  <VApp>
    <VMain class="pa-4">
      <VContainer fluid>
        <VRow>
          <VCol>
            <VSheet class="d-flex align-end" color="transparent" height="40">
              <VChip
                class="text-body-medium font-weight-bold"
                color="primary-lighten-4"
                variant="elevated"
                label
              >
                Authoring component
              </VChip>
              <VSpacer />
              <VBtn
                :disabled="isEmpty"
                class="mr-2"
                color="teal-darken-2"
                prepend-icon="mdi-restore"
                text="Reset"
                variant="tonal"
                @click="reset"
              />
              <VBtn
                v-if="config.isAiEnabled"
                :disabled="settings.isReadonly || isGeneratingContent"
                class="mr-2"
                color="indigo-darken-2"
                prepend-icon="mdi-creation"
                text="Generate"
                variant="tonal"
                @click="doTheMagic"
              />
              <ElementSettings
                v-if="element?.data"
                v-model:settings="settings"
                :config="config"
                :element="element"
                @toggle-gradable="confirm(toggleGradable)"
                @toggle-half-width="confirm(toggleHalfWidth)"
              />
              <ThemeDialog class="ml-1" />
            </VSheet>
            <VSheet class="mt-6 pa-8" color="white" elevation="2" rounded="lg">
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
                      handler: () => !settings.persistFocus && unfocusElement(),
                      include,
                    }"
                    :class="{ focused: isFocused }"
                    class="edit-frame"
                    @click="!settings.persistFocus && focusElement()"
                  >
                    <QuestionForm
                      v-if="isQuestion"
                      v-bind="{
                        type,
                        icon,
                        element,
                        references,
                        autosave: settings.autosave,
                        isDragged: settings.isDragged,
                        isReadonly: settings.isReadonly,
                        isFocused,
                        showFeedback,
                      }"
                      @delete="onDelete"
                      @link="onLink"
                      @save="onSave"
                    />
                    <Edit
                      v-else
                      v-bind="{
                        element,
                        references,
                        isDragged: settings.isDragged,
                        isReadonly: settings.isReadonly,
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
        <VRow v-if="TopToolbar && element?.data">
          <VCol>
            <div class="d-flex align-center">
              <VChip
                class="elevation-2 my-3 text-body-medium font-weight-bold"
                color="grey-darken-3"
                label
              >
                Top toolbar
              </VChip>
            </div>
            <VSlideYTransition>
              <VSheet
                v-if="isFocused"
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
        <VRow v-if="SideToolbar && element?.data">
          <VCol>
            <div class="d-flex align-center">
              <VChip
                class="elevation-2 my-3 text-body-medium font-weight-bold"
                color="grey-darken-3"
                label
              >
                Side toolbar
              </VChip>
            </div>
            <VSlideXTransition>
              <VSheet
                v-if="isFocused"
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
        <VToolbar title="Link element dialog">
          <VBtn icon="mdi-close" @click="isLinkDialogVisible = false" />
        </VToolbar>
        <VCardText>
          In Tailor, this action will open a dialog to select a content element
          to link to. The <code>refs</code> property is updated with mock data
          and a mock element is passed via the <code>references</code> prop.
        </VCardText>
      </VCard>
    </VDialog>
    <ConfirmationDialog />
  </VApp>
</template>

<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  watch,
} from 'vue';
import type {
  DataInitializer,
  Element,
  ElementReferences,
} from '@tailor-cms/cek-common';
import {
  getApiClient,
  initWebSocket,
  resolveElementId,
} from '@tailor-cms/cek-common';

import assetApi from './api/asset';
import ConfirmationDialog from './components/ConfirmationDialog.vue';
import ElementSettings from './components/ElementSettings.vue';
import QuestionForm from './components/QuestionForm/index.vue';
import ThemeDialog from './components/ThemeDialog.vue';

const { TopToolbar, SideToolbar } = getCurrentInstance().appContext.components;

const { VITE_SERVER_RUNTIME_URL } = import.meta.env;
const serverRuntimeUrl = new URL(VITE_SERVER_RUNTIME_URL);
const api = getApiClient(VITE_SERVER_RUNTIME_URL);

provide('$storageService', assetApi);
provide('$rpc', (procedure: string, payload?: any) => {
  return api.rpc(procedure, payload).then((res: any) => res.data);
});

const eventBus = inject<any>('$eventBus');
const appChannel = eventBus.channel('app');

interface Props {
  initState: DataInitializer;
  isEmpty: (data: Element['data']) => boolean;
  isQuestion?: boolean;
  isGradable?: boolean;
  isAiEnabled?: boolean;
  showFeedback?: boolean;
  type?: string;
  icon?: string;
  forceFullWidth?: boolean;
  mockReferences?: ElementReferences;
}

const props = withDefaults(defineProps<Props>(), {
  isQuestion: false,
  isGradable: undefined,
  isAiEnabled: false,
  showFeedback: true,
  type: 'Content Element',
  icon: 'mdi-cube',
  forceFullWidth: false,
  mockReferences: () => ({}),
});

const emit = defineEmits(['save', 'delete']);

const element = ref<Element>();
const references = ref<ElementReferences>({});
const isFocused = ref(false);
const isLinkDialogVisible = ref(false);
const isGeneratingContent = ref(false);

const settings = reactive({
  isReadonly: false,
  persistFocus: false,
  isDragged: false,
  autosave: !props.isQuestion,
  isGradable: props.isGradable ?? true,
  aiContext: '',
});

const config = ref({
  isQuestion: props.isQuestion,
  isToggleGradableDisabled: props.isQuestion && props.isGradable !== undefined,
  forceFullWidth: props.forceFullWidth,
  isAiEnabled: props.isAiEnabled,
});

const include = () => [
  document.querySelector('.top-toolbar'),
  document.querySelector('.side-toolbar'),
];

const isEmpty = computed(() => {
  if (!element.value?.data) return false;
  return props.isEmpty?.(element.value.data) ?? false;
});

onMounted(async () => {
  const elementId = resolveElementId();
  if (!elementId) return;
  await load(elementId);
  const wsBus = initWebSocket(serverRuntimeUrl, elementId);
  wsBus.on('element:update', (v: Element) => (element.value = v));
});

const focusElement = () => {
  if (!settings.isReadonly) isFocused.value = true;
};

const unfocusElement = () => {
  isFocused.value = false;
};

const onSave = (data: any) => {
  updateElementData(data);
  emit('save', data);
};

const onDelete = () => {
  emit('delete');
};

const doTheMagic = async () => {
  isGeneratingContent.value = true;
  settings.persistFocus = false;
  settings.isDragged = false;
  try {
    const res = await api.generateContent(settings.aiContext.trim());
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

const onLink = (key = 'linked') => {
  isLinkDialogVisible.value = true;
  const dataItems = props.mockReferences?.[key] ?? [initState()];
  const mockElements = dataItems.map((data, i) => ({
    id: 1000 + i,
    uid: `mock-ref-${i}`,
    type: element.value?.type ?? 'UNKNOWN',
    data,
  }));
  references.value = { ...references.value, [key]: mockElements };
  const refs = mockElements.map((el) => ({
    id: el.id,
    outlineId: 1,
    containerId: 2,
  }));
  api.updateElement(element.value.uid, { refs: { [key]: refs } });
};

const load = async (elementId: string) => {
  try {
    const response = await api.getElement(elementId);
    if (response === null) return;
    element.value = response?.element;
    settings.isGradable = element.value.data.isGradable as boolean;
  } catch (error) {
    console.log('Error on element get', error);
    setTimeout(() => load(elementId), 2000);
  }
};

const resetState = () =>
  api
    .resetState(element.value.uid)
    .catch((error) => console.log('Error on state reset', error));

const updateElementData = async (data: any) => {
  try {
    element.value = await api.updateElement(element.value.uid, { data });
  } catch (error) {
    console.log('Error on element update', error);
  }
};

const initState = () => props.initState({ isGradable: settings.isGradable });

const reset = async () => {
  const data = initState();
  await updateElementData(data);
  return resetState();
};

const toggleGradable = async () => {
  const data = initState();
  const newGradableValue = !settings.isGradable;
  data.isGradable = newGradableValue;
  if (!newGradableValue) delete data.correct;
  await updateElementData({
    ...data,
    width: element.value.data.width,
  });
  settings.isGradable = data.isGradable;
  return resetState();
};

const toggleHalfWidth = async () => {
  const data = initState();
  const { width, isGradable } = element.value.data;
  const newWidth = width === 12 ? 6 : 12;
  await updateElementData({ ...data, width: newWidth, isGradable });
  return resetState();
};

const confirm = (action: any) => {
  return appChannel.emit('showConfirmationModal', {
    title: 'Are you sure?',
    message: 'This action will reset element data and state',
    action,
  });
};

watch(
  () => settings.persistFocus,
  (val) => {
    if (val) isFocused.value = true;
  },
);

watch(
  () => settings.isReadonly,
  (val) => {
    if (!val) return;
    settings.persistFocus = false;
    isFocused.value = false;
    settings.isDragged = false;
  },
);
</script>

<style lang="scss" scoped>
.v-application {
  background: transparent;
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
</style>
