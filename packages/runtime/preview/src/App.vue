<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ky from 'ky';
import { v4 as uuid } from '@lukeed/uuid/secure';

import AppBar from './components/AppBar.vue';
import MainLayout from './components/MainLayout.vue';

interface ContentElement {
  id: number;
  uid: string;
}

const { VITE_SERVER_RUNTIME_URL } = import.meta.env;
const serverRuntimeUrl = new URL(VITE_SERVER_RUNTIME_URL);
const wsProtocol = serverRuntimeUrl.protocol === 'http:' ? 'ws:' : 'wss:';

const api = ky.create({ prefixUrl: VITE_SERVER_RUNTIME_URL });

const element = ref<ContentElement>();
const userState = ref({});

const getElementRoute = (id: string) => `content-element/${id}`;
const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function getElement(id: string): Promise<void> {
  try {
    const res = await api(getElementRoute(id)).json();
    const { element: elementVal, userState: userStateVal } = res as any;
    element.value = elementVal;
    userState.value = userStateVal;
  } catch (error) {
    console.log('Error on element get', error);
    await timeout(2000);
    console.log('Retrying element get...');
    return getElement(id);
  }
}

async function resetElement(id: string) {
  await resetState(id);
  return api.post(`${getElementRoute(id)}/reset-element`);
}

async function resetState(id: string) {
  return api.post(`${getElementRoute(id)}/reset-state`);
}

onMounted(async () => {
  const url = new URL(window.location.href);
  const elementId = url.searchParams.get('id');
  if (!elementId) {
    url.searchParams.set('id', uuid());
    window.location.href = url.toString();
    return;
  }
  await getElement(elementId);
  const wsUrl = `${wsProtocol}//${serverRuntimeUrl.host}?id=${elementId}`;
  const ws = new WebSocket(wsUrl);
  ws.addEventListener('message', (message) => {
    const event = JSON.parse(message.data);
    if (elementId && elementId !== event.entityId) return;
    if (event.type === 'userState:update') {
      userState.value = event.payload;
    }
    if (event.type === 'element:update') {
      element.value = event.payload;
    }
    if (event.type === 'userContext:change') getElement(elementId);
  });
});
</script>

<template>
  <VApp>
    <AppBar />
    <MainLayout
      :element="element"
      :user-state="userState"
      class="mt-14"
      @reset-element="element && resetElement(element.uid)"
      @reset-state="element && resetState(element.uid)"
    />
  </VApp>
</template>

<style>
body {
  --nav-height: 4.2rem;
}
</style>
