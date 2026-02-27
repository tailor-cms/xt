<template>
  <VAppBar color="blue-grey-darken-4" elevation="3">
    <template #prepend>
      <VAppBarNavIcon class="ml-2">
        <img :src="logoUrl" alt="Tailor logo" width="36" />
      </VAppBarNavIcon>
    </template>
    <VAppBarTitle class="ml-2" text="Content Element Kit">
      <VChip
        :text="version"
        class="ml-3 mb-1 text-body-medium"
        color="#23F48B"
        density="compact"
        variant="tonal"
      />
    </VAppBarTitle>
    <VBtnToggle
      base-color="white"
      class="mr-4"
      density="compact"
      variant="tonal"
    >
      <VBtn append-icon="mdi-pencil" text="Authoring" @click="showEdit" />
      <VBtn append-icon="mdi-fullscreen" text="End-user" @click="showDisplay" />
      <VBtn
        append-icon="mdi-math-norm-box"
        text="Both"
        @click="showBothComponents"
      />
    </VBtnToggle>
    <VBtn href="https://github.com/tailor-cms/tce-template" icon="mdi-github" />
    <VBtn href="https://tailor-cms.github.io/xt/" icon="mdi-book-outline" />
  </VAppBar>
</template>

<script setup lang="ts">
import logoUrl from '../assets/logo-new.svg';
import { useGlobalState } from '../state';
import { version } from './../../package.json';

const { showEdit, showDisplay, showBothComponents } = useGlobalState();
</script>
