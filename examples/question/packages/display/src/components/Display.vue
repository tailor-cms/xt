<template>
  <div>
    <div class="text-title-small mb-2">Select one:</div>
    <VInput
      :model-value="selectedAnswer"
      :rules="[requiredRule]"
      hide-details="auto"
      validate-on="submit"
    >
      <VItemGroup
        v-model="selectedAnswer"
        class="w-100 d-flex flex-column ga-2"
        selected-class="bg-blue-grey-lighten-5"
        mandatory
      >
        <VItem
          v-for="(item, index) in element.data.answers"
          :key="index"
          v-slot="{ toggle, isSelected }"
          :value="index"
        >
          <VCard
            v-bind="isSubmitted ? {} : { onClick: toggle }"
            :class="{ readonly: isSubmitted, selected: isSelected }"
            :color="isSelected ? 'primary' : undefined"
            :variant="isSelected ? 'tonal' : 'flat'"
            class="d-flex align-center px-4 py-3"
            border
            rounded
          >
            <VAvatar
              :class="{ 'font-weight-bold': isSelected }"
              :variant="isSelected ? 'flat' : 'outlined'"
              class="mr-4"
              color="primary-darken-1"
              size="small"
            >
              {{ indexToAlpha(index) }}
            </VAvatar>
            {{ item }}
            <VSpacer />
            <VIcon
              v-if="isGradable && isSubmitted && isSelected"
              :color="isCorrect(index) ? 'success' : 'error'"
              :icon="`mdi-${isCorrect(index) ? 'check' : 'close'}-circle`"
            />
          </VCard>
        </VItem>
      </VItemGroup>
    </VInput>
  </div>
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
const isGradable = computed(() => props.element.data.isGradable);

const indexToAlpha = (index: number) => String.fromCharCode(index + 65);
const isCorrect = (index: number) => props.userState?.correct === index;

const requiredRule = (val: number) =>
  typeof val === 'number' || 'You have to select an answer';

watch(selectedAnswer, (val) => {
  if (val !== null) emit('user-input', { response: val });
});

watch(
  () => props.userState,
  (state = {}) => {
    selectedAnswer.value = state.response ?? null;
  },
  { deep: true },
);
</script>

<style scoped>
.v-input :deep(.selected.v-card) {
  border: 1px solid color-mix(in srgb, currentColor 36%, transparent);
}
</style>
