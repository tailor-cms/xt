<template>
  <VApp>
    <VMain class="pa-4">
      <VContainer max-width="68.75rem" fluid>
        <VRow>
          <VCol>
            <VSheet class="d-flex align-end" color="transparent" height="40">
              <VChip
                class="text-body-medium font-weight-bold"
                color="lime accent-2"
                variant="elevated"
                label
              >
                End-user component
              </VChip>
              <VSpacer />
              <VSelect
                v-model="selectedStateContext"
                :items="displayStateContexts"
                density="compact"
                item-title="name"
                label="State preset"
                variant="solo"
                flat
                hide-details
                @update:model-value="onContextChange"
              />
              <ThemeDialog class="ml-1" />
            </VSheet>
            <div class="mt-6">
              <ElementPlaceholder
                v-if="isElementEmpty"
                :icon="icon"
                :name="name"
              />
              <VRow v-else-if="element?.data">
                <VCol :cols="element.data.width ?? 12" class="display-frame">
                  <QuestionForm
                    v-if="isQuestion"
                    :element="element"
                    :user-state="userState"
                    @interaction="onInteraction"
                    @retry="onRetry"
                  />
                  <Display
                    v-else
                    :element="element"
                    :user-state="userState"
                    @interaction="onInteraction"
                  />
                </VCol>
              </VRow>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  getApiClient,
  initWebSocket,
  resolveElementId,
} from '@tailor-cms/cek-common';
import type { Element } from '@tailor-cms/cek-common';
import { findIndex } from 'lodash-es';

import ElementPlaceholder from './components/ElementPlaceholder.vue';
import QuestionForm from './components/QuestionForm/index.vue';
import ThemeDialog from './components/ThemeDialog.vue';

interface Props {
  icon?: string;
  isEmpty?: (data: Element['data']) => boolean;
  isQuestion?: boolean;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-cube',
  isEmpty: () => () => false,
  isQuestion: false,
  name: 'Content Element',
});

const isElementEmpty = computed(() => {
  if (!element.value?.data) return true;
  return props.isEmpty?.(element.value.data) ?? false;
});

const { VITE_SERVER_RUNTIME_URL } = import.meta.env;
const serverRuntimeUrl = new URL(VITE_SERVER_RUNTIME_URL);
const api = getApiClient(VITE_SERVER_RUNTIME_URL);

const element = ref<Element>();
const userState: any = ref({});
const displayStateContexts = ref([]);
const selectedStateContext = ref(null);

onMounted(async () => {
  const elementId = resolveElementId();
  if (!elementId) return;
  await load(elementId);
  const wsBus = initWebSocket(serverRuntimeUrl, elementId);
  wsBus.on('element:update', (v: Element) => (element.value = v));
  wsBus.on('userState:update', (v: any) => (userState.value = v));
  wsBus.on('userContext:change', (v: { index: number }) => {
    const contextName = displayStateContexts.value[v.index].name;
    if (selectedStateContext.value === contextName) return;
    // Different browser tab
    load(elementId);
  });
});

const load = async (id: string) => {
  try {
    const response = await api.getElement(id);
    if (!response?.element) return;
    element.value = response.element;
    userState.value = response?.userState;
    const contextData = await api.getContexts(id);
    const { contexts, currentContextIndex } = contextData;
    displayStateContexts.value = contexts;
    selectedStateContext.value = contexts[currentContextIndex].name;
  } catch (error) {
    console.log('Error on element get', error);
    // Retry
    setTimeout(() => load(id), 2000);
  }
};

async function onContextChange(name) {
  const index = findIndex(displayStateContexts.value, { name });
  await api.setState(element.value.uid, index);
  await load(element.value.uid);
}

const onInteraction = async (data) => {
  try {
    const response = await api.reportUserActivity(element.value.uid, data);
    if (response.status === 204) return;
    userState.value = await response.json();
  } catch (error) {
    console.log('Could not update user state', error);
  }
};

const onRetry = () => {
  userState.value = {};
};
</script>

<style lang="scss" scoped>
.v-application {
  background: transparent;
}
</style>
