<template>
  <VDialog v-model="isOpen" max-width="480">
    <VCard>
      <VToolbar :title="editing ? 'Edit theme' : 'Add custom theme'">
        <VBtn icon="mdi-close" @click="isOpen = false" />
      </VToolbar>
      <VForm ref="form" @submit.prevent="onSubmit">
        <VCardText>
          <VTextField
            v-model="formName"
            :disabled="editing"
            :rules="[rules.required, rules.unique]"
            class="mb-3"
            label="Theme name"
            variant="outlined"
          />
          <VTextarea
            v-model="formInput"
            :rules="[rules.json]"
            label="Theme definition"
            placeholder="Paste Vuetify ThemeDefinition"
            rows="6"
            variant="outlined"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="isOpen = false"> Cancel </VBtn>
          <VBtn color="primary" type="submit" variant="tonal">
            {{ editing ? 'Save' : 'Add theme' }}
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import JSON5 from 'json5';
import { ref } from 'vue';
import type { VForm } from 'vuetify/components';

import { useThemeState } from '../composables/useThemeState';

const { addCustomTheme, getCustomTheme, themeItems } = useThemeState();

const isOpen = ref(false);
const editing = ref(false);
const form = ref<InstanceType<typeof VForm>>();
const formName = ref('');
const formInput = ref('');

const rules = {
  required: (v: string) => !!v.trim() || 'Theme name is required',
  unique: (v: string) => {
    if (editing.value) return true;
    const exists = themeItems.value.some(
      (t) => t.title.toLowerCase() === v.trim().toLowerCase(),
    );
    return !exists || 'Theme name already exists';
  },
  json: (v: string) => {
    if (!v.trim()) return 'Theme definition is required';
    try {
      JSON5.parse(v);
      return true;
    } catch {
      return 'Invalid JSON';
    }
  },
};

const resetForm = () => {
  formName.value = '';
  formInput.value = '';
  form.value?.resetValidation();
};

const openAdd = () => {
  editing.value = false;
  resetForm();
  isOpen.value = true;
};

const openEdit = (name: string) => {
  const theme = getCustomTheme(name);
  if (!theme) return;
  editing.value = true;
  formName.value = theme.name;
  formInput.value = JSON.stringify(theme.definition, null, 2);
  form.value?.resetValidation();
  isOpen.value = true;
};

const onSubmit = async () => {
  const { valid } = await form.value!.validate();
  if (!valid) return;
  addCustomTheme(formName.value.trim(), formInput.value);
  isOpen.value = false;
};

defineExpose({ openAdd, openEdit });
</script>
