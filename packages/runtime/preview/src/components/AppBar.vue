<script setup lang="ts">
import logoUrl from '../assets/logo.png';
import { useGlobalState } from '../state';

const { showEdit, showDisplay, showBothComponents } = useGlobalState();
</script>

<template>
  <v-app-bar color="blue-grey-darken-4" elevation="6">
    <template #prepend>
      <v-app-bar-nav-icon class="ml-2">
        <img :src="logoUrl" alt="Tailor logo" width="36" />
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="ml-2">
      Content Element Kit
      <v-chip
        class="ml-3 mb-1 text-body-2"
        color="#23F48B"
        density="compact"
        variant="tonal"
      >
        0.3.0
      </v-chip>
    </v-app-bar-title>
    <v-spacer />
    <v-btn-toggle class="mr-4" density="compact">
      <v-btn @click="showEdit">
        <span>Authoring</span>
        <v-icon end>mdi-pencil</v-icon>
      </v-btn>
      <v-btn @click="showDisplay">
        <span>End-user</span>
        <v-icon end>mdi-fullscreen</v-icon>
      </v-btn>
      <v-btn @click="showBothComponents">
        <span>Both</span>
        <v-icon end>mdi-math-norm-box</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-btn href="https://github.com/tailor-cms/tce-template" icon>
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-btn href="https://tailor-cms.github.io/xt/" icon>
      <v-icon>mdi-book-outline</v-icon>
    </v-btn>
  </v-app-bar>
</template>
