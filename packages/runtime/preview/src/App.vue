<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ky from 'ky';

import AppBar from './components/AppBar.vue';
import MainLayout from './components/MainLayout.vue';

interface ContentElement {
  id: number;
}

const appUrl = new URL(window.location.href);
const apiPrefix = '/tce-server';
const api = ky.create({ prefixUrl: apiPrefix });
const wsProtocol = appUrl.protocol === 'http:' ? 'ws:' : 'wss:';
const ws = new WebSocket(`${wsProtocol}//${appUrl.host}${apiPrefix}`);

const element = ref<ContentElement>();
const userState = ref({});

onMounted(async () => {
  const { element: elementVal, userState: userStateVal } = await getElement();
  element.value = elementVal;
  userState.value = userStateVal;
  ws.addEventListener('message', (message) => {
    const event = JSON.parse(message.data);
    const elementId = element.value?.id;
    if (elementId && elementId !== event.entityId) return;
    if (event.type === 'userState:update') {
      userState.value = event.payload;
    }
    if (event.type === 'element:update') {
      element.value = event.payload;
    }
  });
});

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getElement(): Promise<any> {
  try {
    return api('content-element').json();
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
