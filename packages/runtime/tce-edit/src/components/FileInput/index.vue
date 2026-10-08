<template>
  <FileDropzone
    v-if="isDropzone && !resolvedFileKey"
    :allow-url-source="allowUrlSource"
    :disabled="readonly"
    :error-message="uploadError"
    :extensions="allowedExtensions"
    :icon="resolvedIcon"
    :is-uploading="uploading"
    :progress="progress"
    :title="dropzoneTitle"
    @open="openDialog"
    @select="onFileSelect"
  />
  <VTextField
    v-else-if="!resolvedFileKey"
    :density="density"
    :label="resolvedLabel"
    :max-width="maxWidth"
    :min-width="minWidth"
    :placeholder="placeholder || 'Click to add...'"
    :prepend-inner-icon="resolvedIcon"
    :variant="variant"
    append-inner-icon="mdi-upload"
    class="file-input"
    readonly
    @click="!readonly && openDialog()"
  />
  <div v-else-if="isDropzone && $slots.default" class="file-input-media">
    <slot
      :file-name="resolvedFileName"
      :is-loading="isLoadingPreview"
      :url="previewUrl"
    ></slot>
    <!-- Editor-only file row below the media; sticks to the scroller
      bottom so tall media keeps the actions in reach -->
    <VExpandTransition>
      <div
        v-if="showActions && !readonly"
        class="position-sticky bottom-0 pa-3 mb-n3 bg-surface-raised"
      >
        <div class="d-flex align-center ga-2">
          <VIcon :icon="resolvedIcon" size="small" />
          <span class="text-body-small text-medium-emphasis text-truncate">
            {{ resolvedFileName }}
          </span>
          <VSpacer />
          <div class="d-flex align-center mr-n3">
            <slot :remove="onClear" :replace="openDialog" name="actions">
              <VBtn
                prepend-icon="mdi-swap-horizontal"
                size="small"
                text="Replace"
                variant="text"
                @click="openDialog()"
              />
              <VBtn
                color="error"
                prepend-icon="mdi-trash-can-outline"
                size="small"
                text="Remove"
                variant="text"
                @click="onClear"
              />
            </slot>
          </div>
        </div>
      </div>
    </VExpandTransition>
  </div>
  <VOverlay
    v-else
    v-model="previewExpanded"
    :class="['file-preview', { expanded: previewExpanded }]"
    content-class="d-flex align-center justify-center h-100 w-100"
    close-on-content-click
  >
    <template #activator="{ props: dialogProps }">
      <!-- Clicking the filled field replaces the file -->
      <VTextField
        :class="{ 'cursor-pointer': !readonly }"
        :density="density"
        :label="resolvedLabel"
        :max-width="maxWidth"
        :min-width="minWidth"
        :model-value="resolvedFileName"
        :variant="variant"
        class="file-input"
        readonly
        @click="!readonly && openDialog()"
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
            @click.stop
          >
            <VIcon icon="mdi-magnify" size="large" />
          </VBtn>
          <VBtn
            v-if="!readonly"
            aria-label="Remove file"
            color="error"
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
  <VDialog v-model="dialogOpen" :theme="$vuetify.theme.global.name" width="700">
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
            <UploadProgress
              v-if="uploading"
              :file-name="uploadingFileName"
              :progress="progress"
            />
            <template v-else>
              <VAlert
                v-if="uploadError"
                :text="uploadError"
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

import {
  ASSET_TYPE_DROPZONE_TITLE,
  ASSET_TYPE_ICON,
  ASSET_TYPE_LABEL,
  fileNameFromUrl,
  inferAssetType,
} from './asset';
import FileDropzone from './FileDropzone.vue';
import UploadProgress from './UploadProgress.vue';

defineOptions({ inheritAttrs: false });

interface Props {
  // 'field': a form control. 'dropzone': in-card media composer whose filled
  // state renders the default slot with a file row beneath it.
  mode?: 'field' | 'dropzone';
  fileKey?: string;
  fileName?: string;
  // Dropzone mode: show the file row below the media
  showActions?: boolean;
  readonly?: boolean;
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
  minWidth?: string | number;
  maxWidth?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'field',
  fileKey: '',
  fileName: '',
  showActions: true,
  readonly: false,
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
  minWidth: '350px',
  maxWidth: '100%',
});

const emit = defineEmits<{
  (e: 'upload', value: Record<string, any>): void;
  (e: 'input', value: Record<string, any> | null): void;
  (e: 'delete'): void;
}>();

const storageService = inject('$storageService') as StorageApi;
const uploading = ref(false);
// Percent complete, or null until the upload reports progress
const progress = ref<number | null>(null);
const uploadingFileName = ref('');
const uploadError = ref('');
const dialogOpen = ref(false);
const activeTab = ref('upload');
const urlInput = ref('');
const urlTitle = ref('');
const urlError = ref('');
const previewExpanded = ref(false);

// Floor the visible upload time so the progress panel doesn't flash on fast
// (small-file / localhost) uploads
const MIN_LOADING_MS = 800;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isDropzone = computed(() => props.mode === 'dropzone');
const category = computed(() => inferAssetType(props.allowedExtensions));
const dropzoneTitle = computed(
  () =>
    ASSET_TYPE_DROPZONE_TITLE[category.value ?? ''] ||
    ASSET_TYPE_DROPZONE_TITLE.other,
);

const openDialog = (tab: 'upload' | 'url' = 'upload') => {
  activeTab.value = tab;
  uploadError.value = '';
  dialogOpen.value = true;
};

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
  progress.value = null;
  uploadingFileName.value = file.name;
  uploadError.value = '';
  try {
    const [data] = await Promise.all([
      storageService.upload(file, {
        onProgress: (percent) => (progress.value = percent),
      }),
      delay(MIN_LOADING_MS),
    ]);
    emit('upload', {
      key: data.key,
      name: file.name,
      url: data.url,
      publicUrl: data.publicUrl,
    });
    closeDialog();
  } catch {
    // Dialog stays open so the error shows next to a retry
    uploadError.value = 'Upload failed. Please try again.';
  } finally {
    uploading.value = false;
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
  const url = urlInput.value.trim();
  // Same `name` key as uploads and library picks; the title is optional
  const name = urlTitle.value.trim() || fileNameFromUrl(url) || undefined;
  emit('input', { url, publicUrl: url, name });
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
