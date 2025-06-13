<script setup lang="ts">
import {
  getApiClient,
  initWebSocket,
  resolveElementId,
} from '@tailor-cms/cek-common';
import { onMounted, ref } from 'vue';
import type { Element } from '@tailor-cms/cek-common';

import AppBar from './components/AppBar.vue';
import MainLayout from './components/MainLayout.vue';

const { VITE_SERVER_RUNTIME_URL } = import.meta.env;
const serverRuntimeUrl = new URL(VITE_SERVER_RUNTIME_URL);
const api = getApiClient(VITE_SERVER_RUNTIME_URL);

const element = ref<Element>();
const userState = ref({});

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function load(id: string): Promise<any> {
  try {
    const res = await api.getElement(id);
    element.value = res.element;
    userState.value = res.userState;
  } catch (error) {
    console.log('Error on element get', error);
    await timeout(2000);
    console.log('Retrying element get...');
    return load(id);
  }
}

async function resetElement(id: string) {
  await api.resetState(id);
  return api.resetElement(id);
}

onMounted(async () => {
  const elementId = resolveElementId();
  if (!elementId) return;
  await load(elementId);
  const wsBus = initWebSocket(serverRuntimeUrl, elementId);
  wsBus.on('element:update', (v: Element) => (element.value = v));
  wsBus.on('userState:update', (v: any) => (userState.value = v));
  wsBus.on('userContext:change', (v: { index: number }) => load(elementId));
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
      @reset-state="element && api.resetState(element.uid)"
    />
  </VApp>
</template>

<style>
body {
  --nav-height: 4.2rem;
}
</style>
