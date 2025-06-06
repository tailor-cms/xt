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
const api = ky.create({ prefixUrl: VITE_SERVER_RUNTIME_URL });
const wsProtocol = serverRuntimeUrl.protocol === 'http:' ? 'ws:' : 'wss:';

const element = ref<ContentElement>();
const userState = ref({});

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

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getElement(elementId: string): Promise<any> {
  try {
    const res = await api(`content-element/${elementId}`).json();
    const { element: elementVal, userState: userStateVal } = res as any;
    element.value = elementVal;
    userState.value = userStateVal;
  } catch (error) {
    console.log('Error on element get', error);
    await timeout(2000);
    console.log('Retrying element get...');
    return getElement(elementId);
  }
}

async function resetElement() {
  const id = element.value?.uid;
  if (!id) return;
  await resetState();
  const path = `content-element/${id}/reset-element`;
  return api.post(path);
}

async function resetState() {
  const id = element.value?.uid;
  if (!id) return;
  const path = `content-element/${id}/reset-state`;
  return api.post(path);
}
</script>

<template>
  <VApp>
    <AppBar />
    <MainLayout
      :element="element"
      :user-state="userState"
      class="mt-14"
      @reset-element="resetElement"
      @reset-state="resetState"
    />
  </VApp>
</template>

<style>
body {
  --nav-height: 4.2rem;
}
</style>
