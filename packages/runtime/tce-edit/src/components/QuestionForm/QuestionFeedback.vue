<template>
  <div class="question-feedback">
    <div class="mb-2">
      <span class="text-title-small">Feedback</span>
      <VBtn
        class="ml-2"
        color="primary-darken-4"
        size="small"
        variant="text"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? 'hide' : 'show' }}
      </VBtn>
    </div>
    <VExpandTransition>
      <div v-show="isExpanded">
        <div class="question-general-feedback text-title-small mb-6">
          <div class="mb-4">General feedback</div>
          <VTextarea
            v-if="!isReadonly"
            :model-value="generalFeedback"
            placeholder="Add general feedback..."
            rows="2"
            variant="outlined"
            auto-grow
            hide-details
            @update:model-value="emit('update', { generalFeedback: $event })"
          />
          <template v-else>
            <div v-if="generalFeedback" v-text="generalFeedback" />
            <span v-else class="font-italic">Feedback not added.</span>
          </template>
        </div>
        <template v-if="showAnswerFeedback">
          <div
            v-for="(answer, index) in processedAnswers"
            :key="index"
            class="text-title-small mb-6"
          >
            <div class="mb-4">
              {{ isGradable ? 'Answer' : 'Option' }}
              {{ index + 1 }}:
              {{ answer || 'Answer not added.' }}
            </div>
            <VTextarea
              v-if="!isReadonly"
              :model-value="feedback?.[index]"
              placeholder="Add feedback..."
              rows="2"
              variant="outlined"
              auto-grow
              hide-details
              @update:model-value="update($event, index)"
            />
            <template v-else>
              <div v-if="feedback?.[index]" v-text="feedback[index]" />
              <span v-else class="font-italic">Feedback not added.</span>
            </template>
          </div>
        </template>
      </div>
    </VExpandTransition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { isArray, some } from 'lodash-es';

interface Props {
  answers: string[];
  isReadonly: boolean;
  isGradable: boolean;
  showAnswerFeedback: boolean;
  feedback?: Record<number, string>;
  generalFeedback?: string;
}

const props = withDefaults(defineProps<Props>(), {
  feedback: () => ({}),
  generalFeedback: '',
});
const emit = defineEmits(['update']);

const isExpanded = ref(some(props.feedback) || !!props.generalFeedback);

const processedAnswers = computed(() =>
  isArray(props.answers) ? props.answers : ['True', 'False'],
);

const update = (value: string, index: number) => {
  emit('update', { feedback: { ...props.feedback, [index]: value } });
};

const hasFeedback = computed(
  () => some(props.feedback) || !!props.generalFeedback,
);

watch(
  () => props.isReadonly,
  (val) => {
    if (!hasFeedback.value) return;
    if (!val) isExpanded.value = true;
  },
);
</script>
