<template>
  <VTextField
    v-if="!resolvedFileKey"
    :density="density"
    :label="resolvedLabel"
    :placeholder="placeholder || 'Click to add...'"
    :prepend-inner-icon="resolvedIcon"
    :variant="variant"
    append-inner-icon="mdi-upload"
    readonly
    @click="dialogOpen = true"
  />
  <VOverlay
    v-else
    v-model="previewExpanded"
    :class="{ expanded: previewExpanded }"
    content-class="d-flex align-center justify-center h-100 w-100"
    close-on-content-click
  >
    <template #activator="{ props: dialogProps }">
      <VTextField
        :density="density"
        :label="resolvedLabel"
        :model-value="resolvedFileName"
        :variant="variant"
        readonly
      >
        <template #prepend-inner>
          <VProgressCircular v-if="isLoadingPreview" size="24" indeterminate />
          <VImg
            v-else-if="isPreviewEnabled && previewUrl"
            :src="previewUrl"
            height="24"
            width="24"
            cover
          />
          <VIcon v-else :icon="resolvedIcon" />
        </template>
        <template #append-inner>
          <VBtn
            v-if="isPreviewEnabled"
            v-bind="dialogProps"
            aria-label="Preview image"
            class="mr-1"
            size="x-small"
            variant="tonal"
            icon
          >
            <VIcon icon="mdi-magnify" size="large" />
          </VBtn>
          <VBtn
            aria-label="Remove file"
            size="x-small"
            variant="tonal"
            icon
            @click.stop="onClear"
          >
            <VIcon icon="mdi-trash-can-outline" size="large" />
          </VBtn>
        </template>
      </VTextField>
    </template>
    <VBtn
      aria-label="Close preview"
      class="position-absolute top-0 right-0 ma-4"
      color="white"
      icon="mdi-close"
      variant="tonal"
      @click="previewExpanded = false"
    />
    <img v-if="previewUrl" :alt="resolvedFileName" :src="previewUrl" />
  </VOverlay>
  <VDialog v-model="dialogOpen" width="700">
    <VCard :title="dialogHeading">
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
            <VFileUpload
              :filter-by-type="acceptedFileTypes"
              color="transparent"
              hide-details
              @update:model-value="onFileSelect"
            />
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
        <VBtn @click="closeDialog"> Cancel </VBtn>
        <VBtn v-if="activeTab === 'url'" variant="tonal" @click="submitUrl">
          Import
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue';
import type { StorageApi } from '@tailor-cms/cek-common';
import { VFileUpload } from 'vuetify/labs/VFileUpload';

import { ASSET_TYPE_ICON, ASSET_TYPE_LABEL, inferAssetType } from './asset';

defineOptions({ inheritAttrs: false });

interface Props {
  fileKey?: string;
  fileName?: string;
  allowUrlSource?: boolean;
  allowedExtensions?: string[];
  showPreview?: boolean;
  publicUrl?: string | null;
  label?: string;
  placeholder?: string;
  icon?: string;
  variant?: 'flat' | 'outlined' | 'tonal' | 'text';
  density?: 'default' | 'comfortable' | 'compact';
  dark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fileKey: '',
  fileName: '',
  allowUrlSource: false,
  allowedExtensions: () => [],
  showPreview: false,
  publicUrl: null,
  label: '',
  placeholder: '',
  icon: '',
  variant: 'outlined',
  density: 'default',
  dark: false,
});

const emit = defineEmits<{
  (e: 'upload', value: Record<string, any>): void;
  (e: 'input', value: Record<string, any> | null): void;
  (e: 'delete'): void;
}>();

const storageService = inject('$storageService') as StorageApi;
const uploading = ref(false);
const dialogOpen = ref(false);
const activeTab = ref('upload');
const urlInput = ref('');
const urlTitle = ref('');
const urlError = ref('');
const previewExpanded = ref(false);

const category = computed(() => inferAssetType(props.allowedExtensions));

const resolvedFileKey = computed(
  () => props.fileKey?.replace(/^storage:\/\//, '') || '',
);

const resolvedLabel = computed(
  () =>
    props.label ||
    ASSET_TYPE_LABEL[category.value ?? ''] ||
    ASSET_TYPE_LABEL.other,
);

const resolvedIcon = computed(
  () =>
    props.icon ||
    ASSET_TYPE_ICON[category.value ?? ''] ||
    ASSET_TYPE_ICON.other,
);

const resolvedFileName = computed(() => {
  if (props.fileName) return props.fileName;
  if (!resolvedFileKey.value) return '';
  const segments = resolvedFileKey.value.split('__');
  return segments.length > 1
    ? segments.slice(1).join('__')
    : resolvedFileKey.value.split('/').pop() || '';
});

const acceptedFileTypes = computed(() => props.allowedExtensions.join(','));

const dialogHeading = computed(() => {
  const base = props.placeholder || resolvedLabel.value;
  return resolvedFileKey.value ? `Change ${base.toLowerCase()}` : base;
});

const isPreviewEnabled = computed(
  () => props.showPreview || category.value === 'image',
);

const isLoadingPreview = ref(false);
const internalPublicUrl = ref('');
const previewUrl = computed(
  () => props.publicUrl || internalPublicUrl.value || '',
);

watch(
  [resolvedFileKey, () => props.publicUrl],
  async ([key, propUrl]) => {
    if (!isPreviewEnabled.value || !key) return;
    if (propUrl) return;
    internalPublicUrl.value = '';
    isLoadingPreview.value = true;
    try {
      internalPublicUrl.value = await storageService.getUrl(key);
    } catch {
      internalPublicUrl.value = '';
    } finally {
      isLoadingPreview.value = false;
    }
  },
  { immediate: true },
);

const closeDialog = () => {
  dialogOpen.value = false;
  activeTab.value = 'upload';
  urlInput.value = '';
  urlTitle.value = '';
  urlError.value = '';
};

const onFileSelect = async (files: File | File[] | null) => {
  if (!files) return;
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) return;
  uploading.value = true;
  try {
    const data = await storageService.upload(file);
    emit('upload', {
      key: data.key,
      name: file.name,
      url: data.url,
      publicUrl: data.publicUrl,
    });
  } finally {
    uploading.value = false;
    closeDialog();
  }
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
  emit('input', {
    url: urlInput.value.trim(),
    publicUrl: urlInput.value.trim(),
    title: urlTitle.value.trim() || undefined,
  });
  closeDialog();
};

const onClear = () => {
  emit('delete');
  emit('input', null);
};
</script>

<style lang="scss" scoped>
.v-overlay {
  transition: all 0.3s ease;

  &.expanded {
    backdrop-filter: blur(18px);
  }

  :deep(img) {
    max-width: 100%;
  }
}
</style>
