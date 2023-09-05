<template>
  <v-app>
    <v-main class="pa-4">
      <v-container>
        <v-row>
          <v-col>
            <h2 class="mb-2">Display preview</h2>
            <Display v-bind="dataSeed" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { dataSeed } from './data';
</script>

<style lang="scss" scoped>
.v-application {
  background-color: transparent !important;
}
</style>
