<template>
  <div class="tce-container">
    <VTextField
      :model-value="element.data.description"
      :readonly="isReadonly"
      class="mt-4"
      label="Description"
      @update:model-value="updateDescription"
    />
    <div>Times clicked: {{ element.data.count }}</div>
    <VBtn
      v-if="!isReadonly"
      class="my-3"
      prepend-icon="mdi-plus"
      variant="tonal"
      @click="increment"
    >
      Increment
    </VBtn>
    <div class="my-4">
      <VFileInput
        v-if="!isReadonly && !element.data.key"
        accept="image/png, image/jpeg"
        label="Set background"
        hide-details
        prepend-icon
        @change="uploadImage"
      />
      <VSheet
        v-if="element.data.key"
        class="upload-details d-flex flex-column ga-4 pa-4"
        color="primary-lighten-5"
        tag="ul"
        rounded
      >
        <div class="d-flex align-center font-weight-bold text-title-medium">
          <span class="ml-2">Background image</span>
          <VSpacer />
          <VBtn
            v-if="!isReadonly"
            color="primary-darken-2"
            icon="mdi-close"
            size="x-small"
            variant="tonal"
            @click="removeImage"
          />
        </div>
        <VSheet class="py-2 px-4" tag="li" rounded>
          <b>Storage key:</b>{{ element.data.key }}
        </VSheet>
        <VSheet class="py-2 px-4" tag="li" rounded>
          <b>Internal url:</b>{{ element.data.assets?.backgroundUrl }}
        </VSheet>
        <VSheet class="py-2 px-4" tag="li" rounded>
          <b>Public url:</b>
          <a :to="element.data.backgroundUrl" target="_blank">
            {{ element.data.backgroundUrl }}
          </a>
        </VSheet>
        <VImg
          v-if="element.data.backgroundUrl"
          :src="element.data.backgroundUrl"
          alt="Background image"
          width="200"
          rounded
        />
      </VSheet>
    </div>
    <VBtn v-if="!isReadonly" class="my-3" variant="tonal" @click="emit('link')">
      Link example
    </VBtn>
    <VBtn
      v-if="!isReadonly"
      :loading="isLoading"
      class="my-3 ml-2"
      prepend-icon="mdi-export"
      variant="tonal"
      @click="exportData"
    >
      Export data
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import type {
  CallElementAction,
  InputFileEvent,
  StorageApi,
} from '@tailor-cms/cek-common';
import { inject, ref } from 'vue';
import { createUploadForm } from '@tailor-cms/cek-common';
import { Element } from 'tce-manifest';

const callElementAction = inject('$callElementAction') as CallElementAction;
const storageService = inject('$storageService') as StorageApi;
const elementBus = inject('$elementBus') as any;

const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isDragged: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits(['save', 'link']);

const increment = () => {
  const data = props.element.data;
  const count = data.count + 1;
  emit('save', { ...data, count });
};

const updateDescription = (description: string) => {
  const data = props.element.data;
  emit('save', { ...data, description });
};

elementBus.on('decrement', ({ count }: any) => console.log(count));

const uploadImage = (e: InputFileEvent | any) => {
  const form = createUploadForm(e);
  if (!form) return;
  return storageService.upload(form).then(({ key, url }) =>
    emit('save', {
      ...props.element.data,
      key,
      assets: { backgroundUrl: url },
    }),
  );
};

const removeImage = () => {
  emit('save', {
    ...props.element.data,
    key: undefined,
    assets: undefined,
    backgroundUrl: undefined,
  });
};

const isLoading = ref(false);

const exportData = async () => {
  isLoading.value = true;
  try {
    const { url } = await callElementAction<{ url: string }>('exportData', {
      uid: props.element.uid,
      data: props.element.data,
    });
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'element-data.json';
    link.click();
    URL.revokeObjectURL(blobUrl);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.tce-container {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}

.upload-details > li {
  word-break: break-word;

  > b {
    display: inline-block;
  }
}
</style>
