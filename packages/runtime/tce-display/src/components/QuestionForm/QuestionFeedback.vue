<template>
  <VAlert :color="alertProps.color" class="question-feedback" variant="tonal">
    <div class="d-flex align-center">
      <VIcon :icon="alertProps.icon" class="mr-2" size="small" />
      <span class="text-title-medium font-weight-bold">
        {{ alertProps.text }}
      </span>
    </div>
    <div v-if="hasFeedback" class="d-flex flex-column ga-2 mt-4">
      <VCard
        v-for="(it, key) in feedback"
        :key="key"
        :text="it"
        variant="tonal"
      />
    </div>
  </VAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  feedback: any;
  isGraded: boolean;
  isCorrect: any;
}>();

const hasFeedback = computed(
  () => props.feedback && Object.keys(props.feedback).length,
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
