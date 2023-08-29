<script setup lang="ts">
import { useToggle } from '@vueuse/core';

import logoUrl from '../assets/logo.png';
import { useDarkGlobal } from '../utils';

const isDark = useDarkGlobal();
const toggleDark = useToggle(isDark);
</script>

<template>
  <v-app-bar :color="isDark ? 'blue-grey-darken-4' : 'grey-lighten-4'">
    <template #prepend>
      <v-app-bar-nav-icon>
        <img :src="logoUrl" alt="Tailor logo" width="32" />
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title> Dev Kit </v-app-bar-title>
    <v-spacer />
    <v-btn icon>
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-btn icon @click.prevent="toggleDark()">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
</template>
