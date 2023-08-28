<script setup lang="ts">
import logoUrl from "../assets/logo.png";
import { useToggle } from "@vueuse/core";
import { useDarkGlobal } from "../utils";

const isDark = useDarkGlobal();
const toggleDark = useToggle(isDark);
</script>

<template>
  <v-app-bar :color="isDark ? 'blue-grey-darken-4' : 'grey-lighten-4'">
    <template v-slot:prepend>
      <v-app-bar-nav-icon>
        <img :src="logoUrl" width="32" />
      </v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      Dev Kit
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-btn icon @click.prevent="toggleDark()">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
</template>
