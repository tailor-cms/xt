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
    <UploadBtn
      v-if="allowFileUpload"
      :extensions="extensions"
      :file-name="fileName"
      :is-editing="isEditing"
      :label="props.uploadLabel"
      @delete="file = null"
      @update:uploading="uploading = $event"
      @upload="uploadFile"
    />
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
import { computed, ref, useTemplateRef } from 'vue';
import { last, pick } from 'lodash-es';
import type { VTextField } from 'vuetify/components';

import UploadBtn from './UploadBtn.vue';

const isUploaded = (url: string | null) =>
  url?.startsWith('storage://') ?? false;

const urlRule = (value: string | null) =>
  !value || URL.canParse(value) || 'Please enter a valid URL';

interface AssetFile {
  url: string;
  publicUrl: string;
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

const uploading = ref(false);
const isEditing = ref(!props.url);
const file = ref<AssetFile | null>(
  isUploaded(props.url) ? pick(props, ['url', 'publicUrl']) : null,
);

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

const uploadFile = (value: any) => {
  file.value = value;
  urlInput.value = null;
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
