<template>
  <UploadProgress
    v-if="isUploading"
    :file-name="fileName"
    :progress="progress"
  />
  <template v-else>
    <VAlert
      v-if="errorMessage"
      :text="errorMessage"
      class="mb-3"
      density="compact"
      type="error"
      variant="tonal"
    />
    <VFileUpload
      :disabled="disabled"
      :filter-by-type="accept"
      :model-value="[]"
      :scrim="false"
      class="file-dropzone-upload"
      color="transparent"
      hide-details="auto"
      icon=""
      rounded="lg"
      @update:model-value="onSelect"
    >
      <template #title>
        <VAvatar size="x-large" variant="tonal">
          <VIcon :icon="icon" size="28" />
        </VAvatar>
        <div class="mt-4 mb-1 font-weight-medium text-title-large">
          {{ title }}
        </div>
        <div class="text-body-medium text-medium-emphasis">
          Drag & drop anywhere in this block
          <template v-if="formats"> · {{ formats }}</template>
        </div>
      </template>
      <template #browse="{ props: browseProps }">
        <div class="d-flex flex-wrap justify-center ga-2 mt-4">
          <VBtn
            v-bind="browseProps"
            color="secondary"
            prepend-icon="mdi-upload"
            size="default"
            text="Upload"
            variant="tonal"
          />
          <VBtn
            v-if="allowUrlSource"
            size="default"
            text="From URL"
            variant="tonal"
            @click.stop="emit('open', 'url')"
          />
        </div>
      </template>
    </VFileUpload>
  </template>
</template>

<script lang="ts" setup>
// Mirrors the core-components dropzone; the kit has no asset library, so
// the sources are upload and URL only.
import { computed, ref } from 'vue';
import { uniq } from 'lodash-es';

import UploadProgress from './UploadProgress.vue';

interface Props {
  title: string;
  icon: string;
  // Accepted extensions with dot prefix (e.g. ['.jpg', '.png'])
  extensions?: string[];
  allowUrlSource?: boolean;
  disabled?: boolean;
  isUploading?: boolean;
  // Upload percent complete; null renders an indeterminate bar
  progress?: number | null;
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  extensions: () => [],
  allowUrlSource: false,
  disabled: false,
  isUploading: false,
  progress: null,
  errorMessage: '',
});

const emit = defineEmits<{
  select: [file: File];
  open: [tab: 'url'];
}>();

const fileName = ref('');

const accept = computed(() => props.extensions.join(','));

const listFormat = new Intl.ListFormat('en', { type: 'disjunction' });
const formats = computed(() => {
  const names = props.extensions.map((it) =>
    it.replace(/^\./, '').toUpperCase(),
  );
  return listFormat.format(uniq(names));
});

const onSelect = (files: File | File[] | null) => {
  if (!files) return;
  const file = Array.isArray(files) ? files[0] : files;
  if (!file) return;
  fileName.value = file.name;
  emit('select', file);
};
</script>

<style lang="scss" scoped>
.file-dropzone-upload :deep(.v-file-upload-dropzone) {
  padding: 1.5rem;
  border-color: transparent;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &.v-file-upload-dropzone--dragging {
    background: rgba(var(--v-theme-primary), 0.06);
    border-color: rgb(var(--v-theme-primary));
  }

  .v-file-upload-divider {
    display: none;
  }
}
</style>
