<template>
  <div>
    <VInput
      v-slot="{ isValid }"
      :model-value="elementData.correct"
      :rules="correctRule"
    >
      <div class="text-title-small mb-2">{{ title }}</div>
      <VTextField
        v-for="(answer, index) in elementData.answers"
        :key="index"
        :model-value="answer"
        :placeholder="placeholder"
        :readonly="isReadonly"
        :rules="answerRule"
        class="my-2 w-100"
        variant="outlined"
        @update:model-value="updateAnswer(index, $event)"
      >
        <template #prepend>
          <VRadio
            v-if="isGradable"
            :error="isValid.value === false"
            :model-value="elementData.correct === index"
            :readonly="isReadonly"
            color="primary"
            hide-details
            @click="emit('update', { correct: index })"
          />
          <VAvatar
            v-else
            class="font-weight-bold ma-1"
            color="primary-darken-3"
            size="small"
          >
            {{ index + 1 }}
          </VAvatar>
        </template>
      </VTextField>
    </VInput>
  </div>
</template>

<script lang="ts" setup>
import type { Element, ElementData } from 'tce-question-manifest';
import { computed } from 'vue';

const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits<{
  update: [data: Partial<ElementData>];
}>();

const elementData = computed(() => props.element.data);
const isGradable = computed(() => elementData.value.isGradable);

const title = computed(() =>
  isGradable.value ? 'Select the correct answer' : 'Options',
);
const placeholder = computed(() =>
  isGradable.value ? 'Answer...' : 'Option...',
);

const answerRule = [(val: string) => !!val || 'Answer is required'];
const correctRule = computed(() =>
  isGradable.value
    ? [
        (val?: number | null) =>
          typeof val === 'number' || 'Please choose the correct answer',
      ]
    : [],
);

const updateAnswer = (index: number, value: string) => {
  const answers = elementData.value.answers.map((a, i) =>
    i === index ? value : a,
  );
  emit('update', { answers });
};
</script>
