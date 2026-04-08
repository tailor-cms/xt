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
        @change="uploadImage"
      />
      <VSheet
        v-if="element.data.key"
        class="upload-details d-flex flex-column ga-4 pa-4"
        color="primary-lighten-5"
        tag="ul"
        rounded
      >
        <div class="d-flex align-center font-weight-bold">
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
    <div class="my-3">
      <template v-if="linkedElement">
        <div class="text-label-medium text-uppercase font-weight-bold my-2">
          Linked element:
        </div>
        <VSheet class="py-2 px-4" color="surface-light" rounded>
          <pre class="text-body-medium my-1">{{
            JSON.stringify(linkedElement.data, null, 2)
          }}</pre>
        </VSheet>
      </template>
      <VBtn v-else-if="!isReadonly" variant="tonal" @click="emit('link')">
        Link element
      </VBtn>
    </div>
    <VBtn
      v-if="!isReadonly"
      :loading="isLoading"
      prepend-icon="mdi-export"
      variant="tonal"
      @click="exportData"
    >
      Export data
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { Element, ElementData } from 'tce-manifest';
import type {
  ElementReferences,
  InputFileEvent,
  RpcCaller,
  StorageApi,
} from '@tailor-cms/cek-common';

const rpc = inject('$rpc') as RpcCaller;
const storageService = inject('$storageService') as StorageApi;
const elementBus = inject('$elementBus') as any;

const props = defineProps<{
  element: Element;
  references?: ElementReferences;
  isFocused: boolean;
  isDragged: boolean;
  isReadonly: boolean;
}>();

const emit = defineEmits<{
  save: [data: ElementData];
  link: [key?: string];
}>();

const linkedElement = computed(() => props.references?.linked?.[0]);

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

const uploadImage = (e: InputFileEvent) => {
  const files = Array.from(e.target.files ?? []);
  if (!files.length) return;
  return storageService.upload(files).then(({ key, url }) =>
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
    const { url } = await rpc<{ url: string }>('exportData', {
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
