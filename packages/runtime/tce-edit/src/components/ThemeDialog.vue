<template>
  <VDialog v-model="isOpen" max-height="600" max-width="480" scrollable>
    <template #activator="{ props: activatorProps }">
      <VBtn
        v-bind="{ ...activatorProps, ...$attrs }"
        aria-label="Theme selector"
        icon="mdi-palette-outline"
        size="small"
        variant="flat"
      />
    </template>
    <VCard>
      <VToolbar class="mb-4" title="Theme selector">
        <VBtn icon="mdi-close" @click="isOpen = false" />
      </VToolbar>
      <VRadioGroup
        :model-value="activeTheme"
        class="px-4"
        hide-details
        @update:model-value="setTheme"
      >
        <div
          v-for="item in themeItems"
          :key="item.value"
          class="d-flex align-center"
        >
          <VRadio :label="item.title" :value="item.value" />
          <VSpacer />
          <template v-if="item.removable">
            <VBtn
              aria-label="Edit theme"
              color="primary"
              size="x-small"
              variant="text"
              icon
              @click.stop="themeForm?.openEdit(item.title)"
            >
              <VIcon icon="mdi-square-edit-outline" size="large" />
            </VBtn>
            <VBtn
              aria-label="Remove theme"
              color="error"
              size="x-small"
              variant="text"
              icon
              @click.stop="removeCustomTheme(item.title)"
            >
              <VIcon icon="mdi-trash-can-outline" size="large" />
            </VBtn>
          </template>
        </div>
      </VRadioGroup>
      <VCardText>
        <VSheet
          v-for="color in activeColors"
          :key="color"
          :color="color"
          class="px-4 py-2 mb-1 text-label-large"
          border
          rounded
        >
          {{ color }}
        </VSheet>
      </VCardText>
      <VDivider />
      <VCardActions>
        <VBtn
          prepend-icon="mdi-plus"
          text="Add custom theme"
          variant="text"
          @click="themeForm?.openAdd()"
        />
      </VCardActions>
    </VCard>
    <ThemeForm ref="themeForm" />
  </VDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import ThemeForm from './ThemeForm.vue';
import { useThemeState } from '../composables/useThemeState';

const { activeTheme, getThemeColors, removeCustomTheme, setTheme, themeItems } =
  useThemeState();

const isOpen = ref(false);
const themeForm = ref<InstanceType<typeof ThemeForm>>();
const activeColors = computed(() => getThemeColors(activeTheme.value));
</script>
