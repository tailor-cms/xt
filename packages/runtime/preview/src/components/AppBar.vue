<script setup lang="ts">
import logoUrl from '../assets/logo.png';
import { useGlobalState } from '../state';

const { isDark, toggleDark, showEdit, showDisplay, showBothComponents } =
  useGlobalState();
</script>

<template>
  <v-app-bar :color="isDark ? 'grey-darken-4' : 'grey-lighten-4'" elevation="1">
    <template #prepend>
      <v-app-bar-nav-icon class="ml-2">
        <img :src="logoUrl" alt="Tailor logo" width="24" />
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="ml-1 font-weight-bold">
      Content Element Kit
      <span class="pl-1 text-body-2 font-weight-bold">0.0.1</span>
    </v-app-bar-title>
    <v-spacer />
    <v-btn-toggle
      :variant="isDark ? 'flat' : 'tonal'"
      class="mr-4"
      density="compact"
    >
      <v-btn @click="showEdit">
        <span>Edit</span>
        <v-icon end>mdi-pencil</v-icon>
      </v-btn>
      <v-btn @click="showDisplay">
        <span>Display</span>
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
    <v-btn icon @click.prevent="toggleDark()">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
</template>
