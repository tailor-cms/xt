<template>
  <VAppBar color="blue-grey-darken-4" elevation="6">
    <template #prepend>
      <VAppBarNavIcon class="ml-2">
        <img :src="logoUrl" alt="Tailor logo" width="36" />
      </VAppBarNavIcon>
    </template>
    <VAppBarTitle class="ml-2">
      Content Element Kit
      <VChip
        class="ml-3 mb-1 text-body-2"
        color="#23F48B"
        density="compact"
        variant="tonal"
      >
        {{ version }}
      </VChip>
    </VAppBarTitle>
    <VSpacer />
    <VBtnToggle class="mr-4" density="compact">
      <VBtn @click="showEdit">
        <span>Authoring</span>
        <VIcon end>mdi-pencil</VIcon>
      </VBtn>
      <VBtn @click="showDisplay">
        <span>End-user</span>
        <VIcon end>mdi-fullscreen</VIcon>
      </VBtn>
      <VBtn @click="showBothComponents">
        <span>Both</span>
        <VIcon end>mdi-math-norm-box</VIcon>
      </VBtn>
    </VBtnToggle>
    <VBtn href="https://github.com/tailor-cms/tce-template" icon>
      <VIcon>mdi-github</VIcon>
    </VBtn>
    <VBtn href="https://tailor-cms.github.io/xt/" icon>
      <VIcon>mdi-book-outline</VIcon>
    </VBtn>
  </VAppBar>
</template>

<script setup lang="ts">
import logoUrl from '../assets/logo.png';
import { useGlobalState } from '../state';
import { version } from './../../package.json';

const { showEdit, showDisplay, showBothComponents } = useGlobalState();
</script>
