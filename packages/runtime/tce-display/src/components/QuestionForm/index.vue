<template>
  <VCard class="question-form pa-4" variant="flat" border>
    <VForm ref="form" class="tce-root" @submit.prevent="submit">
      <div class="d-flex align-center mb-4">
        <div class="text-title-medium font-weight-bold">Question</div>
        <VSpacer />
        <div v-if="hint" class="d-flex justify-end text-title-small">
          <QuestionHint :hint="hint" />
        </div>
      </div>
      <QuestionPrompt
        :embeds="element.data.embeds"
        :question="element.data.question"
        class="mb-4"
      />
      <Display
        :element="element"
        :user-state="userState"
        @user-input="onUserInput"
      />
      <VDivider class="mt-8 mb-4 mx-n4" />
      <VFadeTransition>
        <QuestionFeedback
          v-if="showFeedback && isSubmitted"
          :feedback="element.data.feedback"
          :is-correct="userState.isCorrect"
          :is-graded="element.data.isGradable"
          class="mt-4"
        />
      </VFadeTransition>
      <div class="d-flex justify-end mt-4">
        <VBtn
          v-if="!isSubmitted"
          :disabled="!hasResponse"
          append-icon="mdi-send"
          color="primary"
          type="submit"
          variant="flat"
        >
          Submit
        </VBtn>
        <VBtn v-else append-icon="mdi-refresh" variant="text" @click="retry">
          Retry
        </VBtn>
      </div>
    </VForm>
  </VCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import QuestionFeedback from './QuestionFeedback.vue';
import QuestionHint from './QuestionHint.vue';
import QuestionPrompt from './QuestionPrompt.vue';

interface Props {
  element: any;
  userState: any;
  showFeedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: true,
});
const emit = defineEmits(['interaction', 'retry']);

const form = ref();
const isSubmitted = computed(() => !!props.userState?.isSubmitted);
const hint = computed(() => props.element.data.hint);

const response = ref<Record<string, any> | null>(null);
const hasResponse = computed(() => response.value !== null);

const onUserInput = (data: Record<string, any>) => {
  response.value = data;
};

const submit = async () => {
  if (!form.value || !response.value) return;
  const { valid } = await form.value.validate();
  if (valid) emit('interaction', response.value);
};

const retry = () => {
  response.value = null;
  emit('retry');
};
</script>
