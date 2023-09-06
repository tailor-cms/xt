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

async function getElement() {
  try {
    const response = await api('content-element').json();
    return response || {};
  } catch (error) {
    console.log('Error on element get', error);
    return { msg: 'Error upon retrieving element state' };
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
