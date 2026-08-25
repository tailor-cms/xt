<template>
  <div class="feedback-container">
    <VBtn
      :append-icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      :aria-controls="contentId"
      :aria-expanded="isExpanded"
      class="mb-2"
      color="secondary"
      rounded="lg"
      size="small"
      text="Feedback"
      variant="tonal"
      @click="isExpanded = !isExpanded"
    />
    <VExpandTransition>
      <div
        v-show="isExpanded"
        :id="contentId"
        class="d-flex flex-column ga-3 pt-2"
      >
        <VTextarea
          :model-value="feedback?.general"
          :readonly="isReadonly"
          density="comfortable"
          label="General feedback"
          rows="1"
          variant="outlined"
          auto-grow
          hide-details
          @update:model-value="update($event, 'general')"
        />
        <template v-if="showAnswerFeedback">
          <VTextarea
            v-for="(answer, index) in processedAnswers"
            :key="index"
            :label="answerLabel(answer, index)"
            :model-value="feedback?.[index]"
            :readonly="isReadonly"
            density="comfortable"
            rows="1"
            variant="outlined"
            auto-grow
            hide-details
            @update:model-value="update($event, index)"
          />
        </template>
      </div>
    </VExpandTransition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useId, watch } from 'vue';
import { isArray, some } from 'lodash-es';
import type { QuestionFeedback } from '@tailor-cms/cek-common';

interface Props {
  answers?: string[];
  isReadonly: boolean;
  isGradable: boolean;
  showAnswerFeedback?: boolean;
  feedback?: QuestionFeedback;
}

const props = withDefaults(defineProps<Props>(), {
  answers: () => [],
  feedback: () => ({}),
  showAnswerFeedback: false,
});
const emit = defineEmits(['update']);

const contentId = useId();
const isExpanded = ref(some(props.feedback));
const answerType = computed(() => (props.isGradable ? 'Answer' : 'Option'));
const processedAnswers = computed(() =>
  isArray(props.answers) && props.answers.length
    ? props.answers
    : ['True', 'False'],
);

const answerLabel = (answer: string, index: number) => {
  const prefix = `${answerType.value} ${index + 1}`;
  return answer ? `${prefix} · ${answer}` : `${prefix} (answer not added)`;
};

const update = (value: string, key: number | 'general') => {
  emit('update', { ...props.feedback, [key]: value });
};

watch(
  () => props.isReadonly,
  (val) => {
    if (!some(props.feedback)) return;
    if (!val) isExpanded.value = true;
  },
);
</script>
