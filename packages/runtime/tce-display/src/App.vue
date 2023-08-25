<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="6">
            <h2 class="mb-5">Display preview</h2>
            <TceDisplay v-bind="dataSeed" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { dataSeed } from "./data";
</script>
