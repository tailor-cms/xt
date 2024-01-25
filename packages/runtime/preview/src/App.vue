<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ky from 'ky';

import AppBar from './components/AppBar.vue';
import MainLayout from './components/MainLayout.vue';

interface ContentElement {
  id: number;
  uid: string;
}

const appUrl = new URL(window.location.href);
const apiPrefix = '/tce-server';
const api = ky.create({ prefixUrl: apiPrefix });
const wsProtocol = appUrl.protocol === 'http:' ? 'ws:' : 'wss:';
const ws = new WebSocket(`${wsProtocol}//${appUrl.host}${apiPrefix}`);

const element = ref<ContentElement>();
const userState = ref({});

onMounted(async () => {
  await getElement();
  ws.addEventListener('message', (message) => {
    const event = JSON.parse(message.data);
    const elementUid = element.value?.uid;
    if (elementUid && elementUid !== event.entityId) return;
    if (event.type === 'userState:update') {
      userState.value = event.payload;
    }
    if (event.type === 'element:update') {
      element.value = event.payload;
    }
    if (event.type === 'userContext:change') getElement();
  });
});

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getElement(): Promise<any> {
  try {
    const res = await api('content-element').json();
    const { element: elementVal, userState: userStateVal } = res as any;
    element.value = elementVal;
    userState.value = userStateVal;
  } catch (error) {
    console.log('Error on element get', error);
    await timeout(2000);
    console.log('Retrying element get...');
    return getElement();
  }
}

async function resetElement() {
  const id = element.value?.id;
  if (!id) return;
  await resetState();
  const path = `content-element/${id}/reset-element`;
  return api.post(path);
}

async function resetState() {
  const id = element.value?.id;
  if (!id) return;
  const path = `content-element/${id}/reset-state`;
  return api.post(path);
}
</script>

<template>
  <v-app>
    <AppBar />
    <MainLayout
      :element="element"
      :user-state="userState"
      class="mt-14"
      @reset-element="resetElement"
      @reset-state="resetState"
    />
  </v-app>
</template>

<style>
body {
  --nav-height: 4.2rem;
}
</style>
