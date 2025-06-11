<template>
  <VApp>
    <VMain class="pa-4">
      <VContainer>
        <VRow>
          <VCol>
            <div class="d-flex align-center">
              <VChip
                class="elevation-2 mt-1 mb-2 body-2 font-weight-bold"
                color="primary-darken-1"
                label
              >
                Authoring component
              </VChip>
              <VSpacer />
              <VBtn
                v-if="isAiEnabled"
                :disabled="isDisabled || isLoading"
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
                  <div
                    class="d-flex align-center text-overline font-weight-bold"
                  >
                    <VIcon icon="mdi-format-list-bulleted" start />
                    Element Props
                  </div>
                  <VCheckbox
                    v-model="isDisabled"
                    color="primary"
                    density="comfortable"
                    label="Disabled"
                    hide-details
                  />
                  <VCheckbox
                    v-if="isQuestion"
                    :disabled="isGradable !== undefined"
                    :model-value="isGradable"
                    color="primary"
                    density="comfortable"
                    label="Gradable"
                    hide-details
                    @click.prevent="confirmGradableToggle"
                  />
                  <div
                    class="d-flex align-center text-overline mt-4 font-weight-bold"
                  >
                    <VIcon icon="mdi-cog-outline" start />
                    CEK Configuration
                  </div>
                  <VCheckbox
                    v-model="persistFocus"
                    :disabled="isDisabled"
                    color="primary"
                    density="comfortable"
                    label="Persist focus"
                    hide-details
                  />
                  <VTextarea
                    v-if="isAiEnabled"
                    v-model="aiContext"
                    class="mt-4"
                    label="AI Context"
                    rows="3"
                    variant="outlined"
                    hide-details
                  />
                </VCard>
              </VMenu>
            </div>
            <VSheet class="pa-8" color="white" elevation="3" rounded="lg">
              <div
                v-if="isLoading"
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
              <VSheet
                v-else
                v-click-outside="{
                  handler: () => !persistFocus && unfocusElement(),
                  include,
                }"
                :class="{ focused: isFocused }"
                class="edit-frame"
                @click="!persistFocus && focusElement()"
              >
                <template v-if="element?.data">
                  <QuestionCard
                    v-if="isQuestion"
                    v-bind="{
                      type,
                      icon,
                      element,
                      isDisabled,
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
                      isDisabled,
                      isFocused,
                    }"
                    @delete="onDelete"
                    @link="onLink"
                    @save="onSave"
                  />
                </template>
              </VSheet>
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
  getCurrentInstance,
  inject,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import ky from 'ky';

import assetApi from './api/asset';
import ConfirmationDialog from './components/ConfirmationDialog.vue';
import QuestionCard from './components/QuestionCard.vue';

const { TopToolbar, SideToolbar } = getCurrentInstance().appContext.components;

const appUrl = new URL(window.location.href);
const apiPrefix = '/tce-server';
const api = ky.create({ prefixUrl: apiPrefix });
const wsProtocol = appUrl.protocol === 'http:' ? 'ws:' : 'wss:';
const ws = new WebSocket(`${wsProtocol}//${appUrl.host}${apiPrefix}`);

type ContentElement = Record<string, any>;

interface Props {
  isQuestion?: boolean;
  isGradable?: boolean;
  isAiEnabled?: boolean;
  type?: string;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isQuestion: false,
  isGradable: undefined,
  type: 'Content Element',
  icon: 'mdi-cube',
});

const emit = defineEmits(['save', 'delete']);

const eventBus = inject<any>('$eventBus');
const appChannel = eventBus.channel('app');

const element = ref<ContentElement>({});
const persistFocus = ref(false);
const isFocused = ref(false);
const isDisabled = ref(false);
const isGradable = ref(props.isGradable ?? true);
const isLinkDialogVisible = ref(false);
const isLoading = ref(false);
const aiContext = ref(`Generate ${props.type} content element.`);

provide('$storageService', assetApi);

const include = () => [
  document.querySelector('.top-toolbar'),
  document.querySelector('.side-toolbar'),
];

onMounted(async () => {
  await getElement();
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type !== 'element:update') return;
    if (element.value?.uid && element.value?.uid !== data.entityId) return;
    element.value = data.payload;
  });
});

const focusElement = () => {
  if (!isDisabled.value) isFocused.value = true;
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
  isLoading.value = true;
  const context = aiContext.value.trim();
  const res = (await api
    .post('ai/generate', { json: { context } })
    .json()) as any;
  console.log(res.data);
  await updateElementData(res.data);
  isLoading.value = false;
};

const onLink = async () => {
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
  await api
    .patch(`content-element/${element.value.id}`, { json: { refs } })
    .json();
};

const getElement = async () => {
  try {
    const response: { element: ContentElement } = await api('content-element', {
      searchParams: { runtime: 'authoring' },
    }).json();
    if (response === null) return;
    element.value = response?.element;
    isGradable.value = element.value.data.isGradable;
  } catch (error) {
    console.log('Error on element get', error);
    setTimeout(() => getElement(), 2000);
  }
};

const toggleGradable = async () => {
  const { initState } = await import(
    /* @vite-ignore */ import.meta.env.MANIFEST_DIR
  );
  const newGradableValue = !isGradable.value;
  const data = initState();
  data.isGradable = newGradableValue;
  if (!newGradableValue) delete data.correct;
  await updateElementData(data);
  isGradable.value = data.isGradable;
  return resetState();
};

const resetState = async () =>
  api
    .post(`content-element/${element.value.id}/reset-state`)
    .catch((error) => console.log('Error on state reset', error));

const updateElementData = async (data) => {
  try {
    const response = await api
      .patch(`content-element/${element.value.id}`, { json: { data } })
      .json();

    element.value = response;
  } catch (error) {
    console.log('Error on element update', error);
  }
};

const confirmGradableToggle = () => {
  return appChannel.emit('showConfirmationModal', {
    title: 'Are you sure?',
    message: 'This action will reset element data and state',
    action: toggleGradable,
  });
};

watch(persistFocus, (val) => {
  if (val) isFocused.value = true;
});

watch(isDisabled, (val) => {
  if (!val) return;
  persistFocus.value = false;
  isFocused.value = false;
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
</style>
