<template>
  <div class="tce-container">
    <div>Times clicked: {{ element.data.count }}</div>
    <button @click="increment">Increment</button>
    <div class="background-input">
      <label for="backgroundInput">
        Set background:
        <input
          id="backgroundInput"
          accept="image/png, image/jpeg"
          class="background-input"
          type="file"
          @change="(e) => upload(e)"
        />
      </label>
      <ul v-if="element.data.key" class="upload-details">
        <li><b>Storage key:</b>{{ element.data.key }}</li>
        <li><b>Internal url:</b>{{ element.data.url }}</li>
        <li>
          <b>Public url:</b>
          <a :href="element.data.publicUrl" target="_blank">
            {{ element.data.publicUrl }}
          </a>
        </li>
      </ul>
    </div>
    <img
      v-if="element.data.publicUrl"
      :src="element.data.publicUrl"
      alt="Background image"
      max-height="100px"
    />
  </div>
</template>

<script setup lang="ts">
import type { InputFileEvent, StorageApi } from '@tailor-cms/cek-common';
import { createUploadForm } from '@tailor-cms/cek-common';
import { Element } from 'tce-manifest';
import { inject } from 'vue';

const storageService = inject('$storageService') as StorageApi;

const props = defineProps<{ element: Element; isFocused: boolean }>();
const emit = defineEmits(['save']);

const increment = () => {
  const { data } = props.element;
  const count = data.count + 1;
  emit('save', { ...data, count });
};

const upload = (e: InputFileEvent) => {
  const form = createUploadForm(e);
  if (!form) return;
  return storageService.upload(form).then((response) => {
    emit('save', {
      ...props.element.data,
      ...response,
      assets: {
        backgroundUrl: response.url,
      },
    });
  });
};
</script>

<style scoped>
.tce-container {
  background-color: transparent;
  margin-top: 1rem;
  padding: 1rem;
  border: 2px dashed #888;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}

.background-input {
  margin: 1rem 0;
}

button {
  margin-top: 1rem;
  padding: 0.125rem 0.625rem;
  background-color: #eee;
  border: 1px solid #444;
}

.upload-details {
  padding: 0;
  list-style: none;

  > li {
    margin: 1rem 0;
    padding: 0.5rem;
    background-color: #ddd;
    overflow-x: hidden;
    text-overflow: ellipsis;

    > b {
      display: inline-block;
      padding-right: 0.5rem;
    }
  }
}
</style>
