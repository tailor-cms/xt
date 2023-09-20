<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ky from 'ky';

import AppBar from './components/AppBar.vue';
import MainLayout from './components/MainLayout.vue';

const SERVER_HOST = `localhost:${import.meta.env.VITE_TCE_SERVER_PORT || 8030}`;
const api = ky.create({ prefixUrl: `http://${SERVER_HOST}` });
const ws = new WebSocket(`ws://${SERVER_HOST}`);

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
    const response = await api('content-element').json();
    return response || {};
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
