<template>
  <div class="d-flex align-center ga-2">
    <VBtn
      v-if="url && !isEditing"
      :href="publicUrl || url"
      color="info"
      icon="mdi-open-in-new"
      target="_blank"
      variant="tonal"
    />
    <template v-if="fileName">
      <VBtn
        v-if="isEditing"
        color="red"
        icon="mdi-delete"
        variant="tonal"
        @click="file = null"
      />
      <VTextField
        :model-value="fileName"
        hide-details="auto"
        min-width="350"
        variant="outlined"
        disabled
      />
    </template>
    <!-- File upload input -->
    <template v-else-if="allowFileUpload && isEditing">
      <input
        ref="fileInput"
        :accept="extensions.join(', ')"
        :aria-label="props.uploadLabel"
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
        {{ props.uploadLabel }}
      </VBtn>
    </template>
    <template v-if="!uploading && (urlInput || !hasAsset)">
      <VTextField
        ref="urlField"
        :disabled="!isEditing"
        :model-value="urlInput"
        :placeholder="allowFileUpload ? 'or paste a URL...' : 'Paste a URL...'"
        :rules="[urlRule]"
        hide-details="auto"
        min-width="350"
        validate-on="blur"
        variant="outlined"
        clearable
        @update:model-value="urlInput = $event || null"
      />
    </template>
    <VBtn v-if="!isEditing" variant="text" @click="isEditing = true">
      Edit
    </VBtn>
    <template v-else>
      <VBtn
        v-if="hasChanges"
        :disabled="uploading"
        variant="text"
        @click="save"
      >
        Save
      </VBtn>
      <VBtn
        v-if="hasChanges || url"
        :disabled="uploading"
        variant="text"
        @click="cancel"
      >
        Cancel
      </VBtn>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, useTemplateRef } from 'vue';
import { last, pick } from 'lodash-es';
import type { StorageApi } from '@tailor-cms/cek-common';
import type { VTextField } from 'vuetify/components';

const isUploaded = (url: string | null) =>
  url?.startsWith('storage://') ?? false;

const urlRule = (value: string | null) =>
  !value || URL.canParse(value) || 'Please enter a valid URL';

interface AssetFile {
  url: string;
  publicUrl: string;
  name?: string;
  size?: number;
}

interface Props {
  extensions: string[];
  url?: string | null;
  publicUrl?: string | null;
  allowFileUpload?: boolean;
  uploadLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  url: null,
  publicUrl: null,
  allowFileUpload: true,
  uploadLabel: 'Select file',
});
const emit = defineEmits(['input']);

const storageService = inject('$storageService') as StorageApi;
const uploading = ref(false);
const isEditing = ref(!props.url);
const file = ref<AssetFile | null>(
  isUploaded(props.url) ? pick(props, ['url', 'publicUrl']) : null,
);

const fileInput = ref<HTMLInputElement>();
const urlField = useTemplateRef<InstanceType<typeof VTextField>>('urlField');
const urlInput = ref(!isUploaded(props.url) ? props.url : null);

const hasAsset = computed(() => file.value || urlInput.value);
const hasChanges = computed(
  () => props.url !== (urlInput.value || file.value?.url || null),
);

const fileName = computed(() => {
  if (!file.value || !file.value.url) return;
  return last(file.value.url.split('___'));
});

const validateAndUpload = async (target: HTMLInputElement) => {
  const files = Array.from(target.files ?? []);
  const regex = new RegExp('.(' + props.extensions.join('|') + ')$', 'i');
  const isValid = files.every((f: File) => regex.test(f.name));
  if (!isValid || !files[0]) return;
  uploading.value = true;
  try {
    const data = await storageService.upload(files[0]);
    file.value = { ...data, name: files[0].name, size: files[0].size };
    urlInput.value = null;
  } finally {
    uploading.value = false;
  }
};

const save = async () => {
  const result = await urlField.value?.validate();
  if (result?.length) return;
  isEditing.value = false;
  const payload = file.value || {
    url: urlInput.value,
    publicUrl: urlInput.value,
  };
  emit('input', payload);
};

const cancel = () => {
  const isLinked = !isUploaded(props.url);
  urlInput.value = isLinked ? props.url : null;
  urlField.value?.resetValidation();
  file.value = isLinked ? null : pick(props, ['url', 'publicUrl']);
  isEditing.value = !props.url;
};
</script>
