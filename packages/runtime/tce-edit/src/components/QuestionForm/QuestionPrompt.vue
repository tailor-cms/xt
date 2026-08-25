<template>
  <div class="my-3">
    <VInput :model-value="elementData.question" :rules="[requiredRule]">
      <template #default="{ isValid }">
        <VField
          :error="!isValid.value"
          class="w-100"
          label="Prompt"
          variant="outlined"
          active
        >
          <div class="w-100 mx-2">
            <VAlert
              v-if="!hasEmbeds"
              :text="alertMsg"
              class="mx-4 mt-4 text-center"
              icon="mdi-information-outline"
              variant="tonal"
              prominent
            />
            <EmbeddedContainer
              :add-element-options="{
                label: 'Add element',
                large: true,
                variant: 'text',
              }"
              :container="elementData"
              :is-readonly="isReadonly"
              class="text-center w-100"
              @delete="deleteEmbed($event.id)"
              @save="saveQuestion($event.embeds)"
            />
          </div>
        </VField>
      </template>
    </VInput>
  </div>
</template>

<script lang="ts" setup>
import { map, omit, size, sortBy, without } from 'lodash-es';
import { computed } from 'vue';

import EmbeddedContainer from '../EmbeddedContainer.vue';

interface QuestionElementData extends Record<string, any> {
  question: string[];
  embeds: Record<string, any>;
}

const props = defineProps<{
  elementData: QuestionElementData;
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
:deep(.v-input__details) {
  padding-inline: 1rem;
}
</style>
