<template>
  <v-app>
    <v-container>
      <div class="pa-6">
        <h2 class="mb-5">Display preview</h2>
        <Display v-bind="dataSeed" />
      </div>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { dataSeed } from './data';
</script>
