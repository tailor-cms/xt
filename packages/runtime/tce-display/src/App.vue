<template>
  <VApp>
    <VMain class="pa-4">
      <VContainer>
        <VRow>
          <VCol>
            <div class="d-flex mb-1">
              <VChip
                class="text-body-2 font-weight-bold"
                color="#E0FB61"
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
                hide-details
                @update:model-value="onContextChange"
              />
            </div>
            <VSheet class="pa-8" color="white" elevation="3" rounded="lg">
              <VRow v-if="element?.data">
                <VCol :cols="element.data.width ?? 12" class="display-frame">
                  <Display
                    :element="element"
                    :user-state="userState"
                    @interaction="onInteraction"
                  />
                </VCol>
              </VRow>
            </VSheet>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import {
  getApiClient,
  initWebSocket,
  resolveElementId,
} from '@tailor-cms/cek-common';
import { onMounted, ref } from 'vue';
import type { Element } from '@tailor-cms/cek-common';
import { findIndex } from 'lodash-es';

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
</script>

<style lang="scss" scoped>
.v-application {
  background-color: transparent !important;
}
</style>
