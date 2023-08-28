<script setup lang="ts">
import Nav from "./components/Nav.vue";
import Main from "./components/Main.vue";
</script>

<template>
  <v-app>
    <Nav />
    <Main class="mt-14" />
  </v-app>
</template>

<style>
body {
  --nav-height: 4.2rem;
}
</style>
