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
onMounted(async () => {
  element.value = await getElement();
  ws.addEventListener('message', (event) => {
    element.value = JSON.parse(event.data);
  });
});

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getElement() {
  try {
    const response: any = await api('content-element').json();
    return response?.element || {};
  } catch (error) {
    console.log('Error on element get', error);
    await timeout(2000);
    console.log('Retrying element get...');
    return getElement();
  }
}
</script>

<template>
  <v-app>
    <AppBar />
    <MainLayout :element="element" class="mt-14" />
  </v-app>
</template>

<style>
body {
  --nav-height: 4.2rem;
}
</style>
