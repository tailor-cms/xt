<template>
  <VApp>
    <VMain class="pa-4">
      <VContainer>
        <VRow>
          <VCol>
            <div class="d-flex pb-1">
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
            <Display
              v-if="element.data"
              v-bind="element"
              :user-state="userState"
              @interaction="onInteraction"
            />
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { findIndex } from 'lodash-es';
import ky from 'ky';

const { VITE_SERVER_RUNTIME_URL } = import.meta.env;
const serverRuntimeUrl = new URL(VITE_SERVER_RUNTIME_URL);
const apiPrefix = '/tce-server';
const api = ky.create({ prefixUrl: apiPrefix });
const wsProtocol = serverRuntimeUrl.protocol === 'http:' ? 'ws:' : 'wss:';
const ws = new WebSocket(`${wsProtocol}//${serverRuntimeUrl.host}${apiPrefix}`);

const element: any = ref({});
const userState: any = ref({});
const displayStateContexts = ref([]);
const selectedStateContext = ref(null);

onMounted(() => {
  getElement();
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    const elementUid = element.value?.uid;
    if (elementUid && elementUid !== data.entityId) return;
    if (data.type === 'element:update') element.value = data.payload;
    if (data.type === 'userState:update') userState.value = data.payload;
    if (data.type === 'userContext:change') {
      const { index } = data.payload;
      const contextName = displayStateContexts.value[index].name;
      if (selectedStateContext.value === contextName) return;
      // Different browser tab
      getElement();
    }
  });
});

const getElement = async () => {
  try {
    const response: any = await api('content-element', {
      searchParams: { runtime: 'delivery' },
    }).json();
    if (!response?.element) return;
    element.value = response.element;
    userState.value = response?.userState;
    const contextsPath = `content-element/${element.value.id}/state-contexts`;
    const contextData: any = await api(contextsPath).json();
    const { contexts, currentContextIndex } = contextData;
    displayStateContexts.value = contexts;
    selectedStateContext.value = contexts[currentContextIndex].name;
  } catch (error) {
    console.log('Error on element get', error);
    // Retry
    setTimeout(() => getElement(), 2000);
  }
};

async function onContextChange(name) {
  const index = findIndex(displayStateContexts.value, { name });
  const contextsPath = `content-element/${element.value.id}/set-state`;
  await api.post(contextsPath, { json: { index } });
  await getElement();
}

const onInteraction = async (data) => {
  try {
    const response: any = await api.post(
      `content-element/${element.value.id}/activity`,
      { json: data },
    );
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
