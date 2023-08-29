<script setup lang="ts">
import AppBar from './components/AppBar.vue';
import MainLayout from './components/MainLayout.vue';
</script>

<template>
  <v-app>
    <AppBar />
    <MainLayout class="mt-14" />
  </v-app>
</template>

<style>
body {
  --nav-height: 4.2rem;
}
</style>
