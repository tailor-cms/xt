<template>
  <VDialog
    :model-value="modelValue"
    :theme="$vuetify.theme.global.name"
    width="700"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <VCard :prepend-icon="icon || undefined" :title="heading || resolvedLabel">
      <VCardText>
        <VTabs v-model="activeTab" class="mb-6" grow>
          <VTab prepend-icon="mdi-upload" text="Upload" value="upload" />
          <VTab
            v-if="allowUrlSource"
            prepend-icon="mdi-link-variant"
            text="URL"
            value="url"
          />
        </VTabs>
        <VWindow v-model="activeTab">
          <VWindowItem value="upload">
            <UploadProgress
              v-if="uploading"
              :file-name="fileName"
              :progress="progress"
            />
            <template v-else>
              <VAlert
                v-if="error"
                :text="error"
                class="mb-3"
                density="compact"
                type="error"
                variant="tonal"
              />
              <VFileUpload
                :filter-by-type="acceptedFileTypes"
                color="transparent"
                hide-details
                @update:model-value="onFileSelect"
              />
            </template>
          </VWindowItem>
          <VWindowItem v-if="allowUrlSource" value="url">
            <VTextField
              v-model="urlInput"
              :error-messages="urlError"
              hide-details="auto"
              label="File URL"
              @keydown.enter="submitUrl"
            />
            <VTextField
              v-model="urlTitle"
              class="mt-3"
              label="Title"
              hide-details
            />
          </VWindowItem>
        </VWindow>
      </VCardText>
      <VDivider />
      <VCardActions class="px-4 pb-3 flex-end">
        <VBtn @click="close"> Cancel </VBtn>
        <VBtn v-if="activeTab === 'url'" variant="tonal" @click="submitUrl">
          Import
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
// Mirrors the core-components asset picker; the kit has no asset library,
// so the sources are upload and URL only.
import { computed, ref, watch } from 'vue';

import {
  ASSET_TYPE_LABEL,
  fileNameFromUrl,
  inferAssetType,
} from '../utils/asset';
import UploadProgress from './UploadProgress.vue';
import { useUpload } from '../composables/useUpload';

export type PickerTab = 'upload' | 'url';

export interface AssetPick {
  // storage:// URI for uploads; external URL as entered on the URL tab
  url: string;
  // Signed URL for immediate display
  publicUrl?: string | null;
  // Bare storage key
  key?: string;
  name?: string;
}

interface Props {
  modelValue: boolean;
  // Accepted extensions with dot prefix (e.g. ['.jpg', '.png'])
  allowedExtensions?: string[];
  // Allow importing assets from an external URL
  allowUrlSource?: boolean;
  // Defaults to the label inferred from the extensions (e.g. "Image")
  heading?: string;
  icon?: string;
  initialTab?: PickerTab;
}

const props = withDefaults(defineProps<Props>(), {
  allowedExtensions: () => [],
  allowUrlSource: false,
  heading: '',
  icon: '',
  initialTab: 'upload',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  // Uploaded from the Upload tab
  upload: [payload: AssetPick];
  // Imported from a URL
  select: [payload: AssetPick];
}>();

const { upload, uploading, progress, fileName, error } = useUpload();

const activeTab = ref<PickerTab>(props.initialTab);
const urlInput = ref('');
const urlTitle = ref('');
const urlError = ref('');

const resolvedLabel = computed(() => {
  const category = inferAssetType(props.allowedExtensions);
  return ASSET_TYPE_LABEL[category ?? ''] || ASSET_TYPE_LABEL.other;
});

const acceptedFileTypes = computed(() => props.allowedExtensions.join(','));

// Fresh tab and inputs on each open; close may be programmatic
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return;
    activeTab.value = props.initialTab;
    urlInput.value = '';
    urlTitle.value = '';
    urlError.value = '';
    error.value = '';
  },
);

const close = () => emit('update:modelValue', false);

// Dialog stays open on failure so the error shows next to a retry
const onFileSelect = async (files: File | File[] | null) => {
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) return;
  const payload = await upload(file);
  if (!payload) return;
  emit('upload', payload);
  close();
};

const submitUrl = () => {
  if (!urlInput.value) {
    urlError.value = 'URL is required';
    return;
  }
  if (!URL.canParse(urlInput.value)) {
    urlError.value = 'Please enter a valid URL';
    return;
  }
  const url = urlInput.value.trim();
  // Same `name` key as uploads; the title is optional
  const name = urlTitle.value.trim() || fileNameFromUrl(url) || undefined;
  emit('select', { url, publicUrl: url, name });
  close();
};
</script>
