<template>
  <div class="tce-container">
    <div>Times clicked: {{ element.data.count }}</div>
    <button @click="increment">Increment</button>
    <div class="background-input-container">
      <label for="backgroundInput">
        Set background:
        <input
          id="backgroundInput"
          accept="image/png, image/jpeg"
          type="file"
          @change="upload"
        />
      </label>
      <ul v-if="element.data.key" class="upload-details">
        <li><b>Storage key:</b>{{ element.data.key }}</li>
        <li><b>Internal url:</b>{{ element.data.assets?.backgroundUrl }}</li>
        <li>
          <b>Public url:</b>
          <a :to="element.data.backgroundUrl" target="_blank">
            {{ element.data.backgroundUrl }}
          </a>
        </li>
      </ul>
    </div>
    <img
      v-if="element.data.backgroundUrl"
      :src="element.data.backgroundUrl"
      alt="Background image"
      class="my-7"
      width="200px"
    />
    <div class="my-3">
      <button @click="emit('link')">Link example</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, inject } from 'vue';
import type { InputFileEvent, StorageApi } from '@tailor-cms/cek-common';
import { createUploadForm } from '@tailor-cms/cek-common';
import { Element } from 'tce-manifest';

const storageService = inject('$storageService') as StorageApi;
const elementBus = inject('$elementBus') as any;

const props = defineProps<{ element: Element; isFocused: boolean }>();
const emit = defineEmits(['save', 'link']);

const increment = () => {
  const data = props.element.data;
  const count = data.count + 1;
  emit('save', { ...data, count });
};

elementBus.on('decrement', ({ count }: any) => console.log(count));

const upload = (e: InputFileEvent | any) => {
  const form = createUploadForm(e);
  if (!form) return;
  return storageService.upload(form).then(({ key, url }) => {
    emit('save', {
      ...props.element.data,
      key,
      assets: {
        backgroundUrl: url,
      },
    });
  });
};
</script>

<style scoped>
.tce-container {
  background-color: transparent;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  overflow-x: hidden;
}

.background-input-container {
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
