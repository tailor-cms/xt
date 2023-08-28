<template>
  <v-app>
    <Display v-bind="dataSeed" />
  </v-app>
</template>

<script setup lang="ts">
import { dataSeed } from "./data";
</script>
