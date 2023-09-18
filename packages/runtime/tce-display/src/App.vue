<template>
  <v-app>
    <v-main class="pa-4">
      <v-container>
        <v-row>
          <v-col>
            <h2 class="mb-2">Display preview</h2>
            <Display v-if="element.data" v-bind="element" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ky from 'ky';

const SERVER_HOST = `localhost:${import.meta.env.VITE_TCE_SERVER_PORT || 8030}`;
const api = ky.create({ prefixUrl: `http://${SERVER_HOST}` });
const ws = new WebSocket(`ws://${SERVER_HOST}`);

const element: any = ref({});

onMounted(() => {
  getElement();
  ws.addEventListener('message', (event) => {
    element.value = JSON.parse(event.data);
  });
});

const getElement = async () => {
  try {
    const response = await api('content-element').json();
    if (response === null) return;
    element.value = response;
  } catch (error) {
    console.log('Error on element get', error);
    // Retry
    setTimeout(() => getElement(), 2000);
  }
};
</script>

<style lang="scss" scoped>
.v-application {
  background-color: transparent !important;
}
</style>
