<template>
  <VAlert :color="alertProps.color" class="question-feedback" variant="tonal">
    <div class="d-flex align-center">
      <VIcon :icon="alertProps.icon" class="mr-2" size="small" />
      <span class="text-title-medium font-weight-bold">
        {{ alertProps.text }}
      </span>
    </div>
    <div v-if="feedback?.general" class="question-general-feedback mt-4">
      {{ feedback.general }}
    </div>
    <div v-if="hasAnswerFeedback" class="d-flex flex-column ga-2 mt-4">
      <VCard
        v-for="(it, key) in answerFeedback"
        :key="key"
        :text="it"
        variant="tonal"
      />
    </div>
  </VAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { omit } from 'lodash-es';
import type { QuestionFeedback } from '@tailor-cms/cek-common';

const props = defineProps<{
  feedback?: QuestionFeedback;
  isGraded: boolean;
  isCorrect: any;
}>();

// The reserved 'general' key is rendered separately, above the per-answer
// cards — it must not leak into the per-answer loop.
const answerFeedback = computed(() => omit(props.feedback, 'general'));

const hasAnswerFeedback = computed(
  () => Object.keys(answerFeedback.value).length > 0,
);

const alertProps = computed(() => {
  if (!props.isGraded) {
    return { text: 'Submitted', color: 'info', icon: 'mdi-information' };
  }
  if (props.isCorrect) {
    return { text: 'Correct', color: 'success', icon: 'mdi-check-circle' };
  }
  return { text: 'Incorrect', color: 'error', icon: 'mdi-close-circle' };
});
</script>
