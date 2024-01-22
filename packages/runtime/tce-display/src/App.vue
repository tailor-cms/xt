<template>
  <v-app>
    <v-main class="pa-4">
      <v-container>
        <v-row>
          <v-col>
            <div class="d-flex pb-1">
              <v-chip
                class="text-body-2 font-weight-bold"
                color="#E0FB61"
                variant="elevated"
                label
              >
                End-user component
              </v-chip>
              <v-spacer />
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
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import findIndex from 'lodash/findIndex';
import ky from 'ky';

const appUrl = new URL(window.location.href);
const apiPrefix = '/tce-server';
const api = ky.create({ prefixUrl: apiPrefix });
const wsProtocol = appUrl.protocol === 'http:' ? 'ws:' : 'wss:';
const ws = new WebSocket(`${wsProtocol}//${appUrl.host}${apiPrefix}`);

const element: any = ref({});
const userState: any = ref({});
const displayStateContexts = ref([]);
const selectedStateContext = ref(null);

onMounted(() => {
  getElement();
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (element.value?.id && element.value?.id !== data.entityId) return;
    if (data.type === 'element:update') element.value = data.payload;
    if (data.type === 'userState:update') userState.value = data.payload;
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
    displayStateContexts.value = await api(contextsPath).json();
    selectedStateContext.value = displayStateContexts.value[0];
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
  selectedStateContext.value = displayStateContexts.value[index];
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
