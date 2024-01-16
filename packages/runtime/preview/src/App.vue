<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ky from 'ky';

import AppBar from './components/AppBar.vue';
import MainLayout from './components/MainLayout.vue';

const appUrl = new URL(window.location.href);
const apiPrefix = '/tce-server';
const api = ky.create({ prefixUrl: apiPrefix });
const wsProtocol = appUrl.protocol === 'http:' ? 'ws:' : 'wss:';
const ws = new WebSocket(`${wsProtocol}//${appUrl.host}${apiPrefix}`);

const element = ref({});
const userState = ref({});

onMounted(async () => {
  const { element: elementVal, userState: userStateVal } =
    (await getElement()) as any;
  element.value = elementVal;
  userState.value = userStateVal;
  ws.addEventListener('message', (message) => {
    const event = JSON.parse(message.data);
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

async function getElement() {
  try {
    return api('content-element').json();
  } catch (error) {
    console.log('Error on element get', error);
    await timeout(2000);
    console.log('Retrying element get...');
    return getElement();
  }
}

function getElementId() {
  const { id } = element.value as { id: number };
  return id;
}

async function resetElement() {
  const id = getElementId();
  if (!id) return;
  const path = `content-element/${id}/reset-element`;
  const response = await api.post(path);
  const { element: elementVal, userState: userStateVal } =
    (await response.json()) as any;
  element.value = elementVal;
  userState.value = userStateVal;
}

async function resetState() {
  const id = getElementId();
  if (!id) return;
  const path = `content-element/${id}/reset-state`;
  const response = await api.post(path);
  const { userState: userStateVal } = (await response.json()) as any;
  userState.value = userStateVal;
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
