<script setup lang="ts">
import logoUrl from '../assets/logo.png';
import { useGlobalState } from '../state';

const { isDark, toggleDark, showEdit, showDisplay, showBothComponents } =
  useGlobalState();
</script>

<template>
  <v-app-bar :color="isDark ? 'blue-grey-darken-4' : 'grey-lighten-5'">
    <template #prepend>
      <v-app-bar-nav-icon class="ml-3">
        <v-avatar :color="isDark ? 'blue-grey-darken-4' : '#333'" size="48">
          <img :src="logoUrl" alt="Tailor logo" width="30" />
        </v-avatar>
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="ml-3 font-weight-bold">Dev Kit</v-app-bar-title>
    <v-spacer />
    <v-btn-toggle class="mr-4" density="compact" borderless>
      <v-btn @click="showEdit">
        <span>Edit</span>
        <v-icon end>mdi-pencil</v-icon>
      </v-btn>
      <v-btn @click="showDisplay">
        <span>Preview</span>
        <v-icon end>mdi-fullscreen</v-icon>
      </v-btn>
      <v-btn @click="showBothComponents">
        <span>Both</span>
        <v-icon end>mdi-math-norm-box</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-btn href="https://github.com/tailor-cms/t-xt" icon>
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-btn icon @click.prevent="toggleDark()">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
</template>
