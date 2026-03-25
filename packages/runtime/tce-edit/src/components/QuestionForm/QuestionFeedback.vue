<template>
  <div class="feedback-container">
    <div class="mb-2">
      <span class="text-subtitle-2">Feedback</span>
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
        <div
          v-for="(answer, index) in processedAnswers"
          :key="index"
          class="text-subtitle-2 mb-6"
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
            <div
              v-if="feedback?.[index]"
              v-text="feedback[index]"
            />
            <span v-else class="font-italic">Feedback not added.</span>
          </template>
        </div>
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
  feedback?: Record<number, string>;
}

const props = withDefaults(defineProps<Props>(), {
  feedback: () => ({}),
});
const emit = defineEmits(['update']);

const isExpanded = ref(some(props.feedback));

const processedAnswers = computed(() =>
  isArray(props.answers) ? props.answers : ['True', 'False'],
);

const update = (value: string, index: number) => {
  emit('update', { ...props.feedback, [index]: value });
};

watch(
  () => props.isReadonly,
  (val) => {
    if (!some(props.feedback)) return;
    if (!val) isExpanded.value = true;
  },
);
</script>
