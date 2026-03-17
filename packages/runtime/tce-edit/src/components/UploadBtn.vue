<template>
  <template v-if="fileName">
    <VBtn
      v-if="isEditing"
      color="red"
      icon="mdi-delete"
      variant="tonal"
      @click="emit('delete')"
    />
    <VTextField
      v-if="fileName"
      :model-value="fileName"
      hide-details="auto"
      min-width="350"
      variant="outlined"
      disabled
    />
  </template>
  <template v-else-if="isEditing">
    <input
      :id="id"
      :key="fileName"
      ref="fileInput"
      :accept="extensions.join(', ')"
      class="d-none"
      type="file"
      @change="validateAndUpload($event.target as HTMLInputElement)"
    />
    <VBtn
      v-if="fileInput"
      :loading="uploading"
      variant="text"
      @click="fileInput.click()"
    >
      <VIcon color="secondary" icon="mdi-cloud-upload-outline" start />
      {{ props.label }}
    </VBtn>
  </template>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import type { StorageApi } from '@tailor-cms/cek-common';
import { uniqueId } from 'lodash-es';

interface Props {
  isEditing: boolean;
  id?: string;
  fileName?: string;
  fileKey?: string;
  label?: string;
  extensions: string[];
}

const props = withDefaults(defineProps<Props>(), {
  id: uniqueId('file_'),
  fileName: '',
  fileKey: '',
  label: 'Choose a file',
});

const emit = defineEmits(['upload', 'delete', 'update:uploading']);

const fileInput = ref<HTMLInputElement>();
const uploading = ref(false);
const storageService = inject('$storageService') as StorageApi;

const upload = async (file: File) => {
  if (!file) return;
  uploading.value = true;
  emit('update:uploading', true);
  try {
    const data = await storageService.upload([file]);
    emit('upload', { ...data, name: file.name, size: file.size });
  } finally {
    uploading.value = false;
    emit('update:uploading', false);
  }
};

const validateAndUpload = (target: HTMLInputElement) => {
  const files = Array.from(target.files ?? []);
  const regex = new RegExp('.(' + props.extensions.join('|') + ')$', 'i');
  const isValid = files.every((file: File) => regex.test(file.name));
  if (isValid) return upload(files[0]);
};
</script>
