<template>
  <VMenu :close-on-content-click="false" width="300">
    <template #activator="{ props: menuProps }">
      <VBtn
        v-bind="menuProps"
        color="primary-darken-2"
        prepend-icon="mdi-cog"
        text="Settings"
        variant="tonal"
      />
    </template>
    <VCard class="pa-4">
      <div class="settings-header text-label-medium">
        <VIcon icon="mdi-cog" size="small" start />
        Element Props
      </div>
      <VCheckbox
        v-model="settings.isReadonly"
        color="primary"
        density="comfortable"
        label="Readonly"
        hide-details
      />
      <VCheckbox
        v-model="settings.persistFocus"
        :disabled="settings.isReadonly"
        color="primary"
        density="comfortable"
        label="Focused"
        hide-details
      />
      <VCheckbox
        v-model="settings.isDragged"
        :disabled="settings.isReadonly"
        color="primary"
        density="comfortable"
        label="Dragged"
        hide-details
      />
      <VCheckbox
        v-if="config.isQuestion"
        v-model="settings.autosave"
        :disabled="settings.isReadonly"
        color="primary"
        density="comfortable"
        label="Autosave"
        hide-details
      />
      <div class="settings-header text-label-medium mt-4">
        <VIcon icon="mdi-cube" size="small" start />
        Element Data
      </div>
      <VCheckbox
        :disabled="config.forceFullWidth"
        :false-value="12"
        :model-value="element.data.width"
        :true-value="6"
        color="primary"
        density="comfortable"
        label="Half width"
        hide-details
        @click.prevent="$emit('toggleHalfWidth')"
      />
      <VCheckbox
        v-if="config.isQuestion"
        :disabled="config.isToggleGradableDisabled"
        :model-value="settings.isGradable"
        color="primary"
        density="comfortable"
        label="Gradable"
        hide-details
        @click.prevent="$emit('toggleGradable')"
      />
      <template v-if="config.isAiEnabled">
        <div class="settings-header text-label-medium mt-4 mb-2">
          <VIcon icon="mdi-creation" size="small" start />
          AI Context
        </div>
        <VTextarea
          v-model="settings.aiContext"
          placeholder="Enter context for AI generation..."
          rows="3"
          variant="outlined"
          hide-details
        />
      </template>
    </VCard>
  </VMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Element } from '@tailor-cms/cek-common';

interface AppSettings {
  isReadonly: boolean;
  persistFocus: boolean;
  isDragged: boolean;
  autosave: boolean;
  isGradable: boolean;
  aiContext: string;
}

interface SettingsConfig {
  isQuestion: boolean;
  isToggleGradableDisabled: boolean;
  forceFullWidth: boolean;
  isAiEnabled: boolean;
}

interface Props {
  element: Element;
  settings: AppSettings;
  config: SettingsConfig;
}

const props = defineProps<Props>();

const emit = defineEmits([
  'update:settings',
  'toggleHalfWidth',
  'toggleGradable',
]);

const settings = computed({
  get: () => props.settings,
  set: (value) => emit('update:settings', value),
});

const { config } = props;
</script>

<style lang="scss" scoped>
.settings-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  text-transform: uppercase;
  padding: 0.5rem 0;
}
</style>
