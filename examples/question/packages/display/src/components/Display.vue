<template>
  <VRadioGroup
    v-model="selectedAnswer"
    :readonly="isSubmitted"
    label="Select one:"
    hide-details
  >
    <VRadio
      v-for="(item, index) in element.data.answers"
      :key="index"
      :label="item"
      :value="index"
    />
  </VRadioGroup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Element } from 'tce-question-manifest';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits<{
  'user-input': [data: { response: number }];
}>();

const selectedAnswer = ref<number | null>(props.userState?.response ?? null);
const isSubmitted = computed(() => !!props.userState?.isSubmitted);

watch(selectedAnswer, (val) => {
  if (val !== null) emit('user-input', { response: val });
});

watch(
  () => props.userState?.response,
  (val) => {
    if (val !== selectedAnswer.value) selectedAnswer.value = val ?? null;
  },
);
</script>
