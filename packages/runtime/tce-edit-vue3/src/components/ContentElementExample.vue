<template>
  <VSheet class="d-flex flex-column align-center pa-12" rounded="lg">
    <VAvatar class="mb-4" color="primary-darken-4" size="x-large">
      <VIcon color="white" icon="mdi-cube" size="x-large" />
    </VAvatar>
    <div class="text-grey-darken-4 text-h5">Example Item</div>
    <div class="text-grey-darken-2 text-subtitle-1 mb-4">ID: {{ id }}</div>
    <VTextField
      v-model="input"
      :readonly="isDisabled"
      label="Title"
      variant="outlined"
      width="500"
      hide-details
      @change="$emit('save', { ...props.data, title: input })"
    />
  </VSheet>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

const props = defineProps<{
  id: string;
  isFocused: boolean;
  isDisabled: boolean;
  data: { title: string };
}>();
defineEmits(['save']);

const input = ref(props.data.title);
</script>
