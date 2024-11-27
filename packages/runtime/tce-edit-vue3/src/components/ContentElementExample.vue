<template>
  <VSheet class="d-flex flex-column align-center pa-12" rounded="lg" border>
    <VAvatar class="mb-4" color="primary-darken-4" size="x-large">
      <VIcon color="white" icon="mdi-cube" size="x-large" />
    </VAvatar>
    <div class="text-grey-darken-4 text-h5">{{ type }} Example</div>
    <div class="text-grey-darken-2 text-subtitle-1 mb-4">ID: {{ id }}</div>
    <VTextField
      v-model="input"
      :readonly="isDisabled"
      label="Title"
      max-width="500"
      variant="outlined"
      width="100%"
      hide-details
      @change="$emit('save', { ...props.data, title: input })"
    />
  </VSheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  id: string;
  isDisabled: boolean;
  type: string;
  data: { title: string };
}>();
defineEmits(['save']);

const input = ref(props.data.title);
</script>
