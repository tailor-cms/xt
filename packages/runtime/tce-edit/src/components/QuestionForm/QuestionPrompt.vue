<template>
  <div class="mb-4">
    <div class="text-subtitle-2 mb-2">Question</div>
    <VInput :model-value="elementData.question" :rules="[requiredRule]">
      <div class="question-prompt rounded w-100">
        <VAlert
          v-if="!hasEmbeds"
          :text="alertMsg"
          class="mx-6 mt-4 mb-2 text-center"
          color="primary-darken-1"
          icon="mdi-information-outline"
          variant="tonal"
          prominent
        />
        <EmbeddedContainer
          :add-element-options="{
            label: 'Add question element',
            large: true,
            variant: 'text',
          }"
          :container="elementData"
          :is-readonly="isReadonly"
          class="text-center"
          @delete="deleteEmbed($event.id)"
          @save="saveQuestion($event.embeds)"
        />
      </div>
    </VInput>
  </div>
</template>

<script lang="ts" setup>
import { map, omit, size, sortBy, without } from 'lodash-es';
import { computed } from 'vue';

import EmbeddedContainer from '../EmbeddedContainer.vue';

const props = defineProps<{
  elementData: Record<string, any>;
  isReadonly: boolean;
}>();
const emit = defineEmits(['update']);

const hasEmbeds = computed(() => size(props.elementData.embeds) > 0);

const alertMsg = computed(() => {
  return props.isReadonly
    ? 'No question elements added.'
    : 'Click the button below to add a question element.';
});

const saveQuestion = (embeds: Record<string, any>) => {
  const question = map(sortBy(embeds, 'position'), 'id');
  emit('update', { question, embeds });
};

const deleteEmbed = (id: string) => {
  const { embeds, question } = props.elementData;
  emit('update', {
    embeds: omit(embeds, id),
    question: without(question, id),
  });
};

const requiredRule = (val: string[]) =>
  !!val?.length || 'Please define question';
</script>

<style lang="scss" scoped>
.question-prompt {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    width: 100%;
    border: 1px solid currentColor;
    opacity: 0.38;
    pointer-events: none;
    border-radius: inherit;
    transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::after {
    opacity: 0.87;
  }
}

:deep(.v-input__details) {
  padding-inline: 1rem;
}
</style>
