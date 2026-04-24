<template>
  <VCard class="question-form" color="grey-lighten-5">
    <VToolbar class="px-4" color="primary-darken-2" height="36">
      <VIcon :icon="icon" color="secondary-lighten-2" size="18" start />
      <span class="text-title-small">{{ type }}</span>
    </VToolbar>
    <VForm
      ref="form"
      :validate-on="autosave ? 'input' : 'submit'"
      class="text-left pa-6"
    >
      <QuestionPrompt
        :element-data="editedElement.data"
        :is-readonly="isReadonly"
        @update="update"
      />
      <Edit
        v-bind="{ element: editedElement, isFocused, isReadonly }"
        @delete="emit('delete')"
        @link="emit('link', $event)"
        @update="update"
      />
      <QuestionHint
        :hint="editedElement.data.hint"
        :is-readonly="isReadonly"
        @update="update({ hint: $event })"
      />
      <QuestionFeedback
        v-if="showFeedback"
        :answers="editedElement.data.answers"
        :feedback="editedElement.data.feedback"
        :is-gradable="editedElement.data.isGradable"
        :is-readonly="isReadonly"
        @update="update({ feedback: $event })"
      />
      <VFadeTransition>
        <div
          v-if="!isReadonly && isDirty && !autosave"
          class="d-flex justify-end"
        >
          <VBtn color="primary-darken-4" variant="text" @click="resetData">
            Cancel
          </VBtn>
          <VBtn
            class="ml-2"
            color="success"
            prepend-icon="mdi-check"
            variant="tonal"
            @click="save"
          >
            Save
          </VBtn>
        </div>
      </VFadeTransition>
    </VForm>
  </VCard>
</template>

<script lang="ts" setup>
import { cloneDeep, isEqual } from 'lodash-es';
import { computed, reactive, ref, watch } from 'vue';

import QuestionFeedback from './QuestionFeedback.vue';
import QuestionHint from './QuestionHint.vue';
import QuestionPrompt from './QuestionPrompt.vue';

interface Props {
  element: any;
  type: string;
  icon: string;
  autosave?: boolean;
  isReadonly?: boolean;
  isFocused?: boolean;
  showFeedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autosave: false,
  isReadonly: false,
  isFocused: false,
  showFeedback: true,
});

const emit = defineEmits([
  'add',
  'cancel',
  'delete',
  'save',
  'select',
  'link',
  'update',
]);

const form = ref();
const editedElement = reactive(cloneDeep(props.element));

const isDirty = computed(
  () => !isEqual(editedElement.data, props.element.data),
);

const save = async () => {
  if (!form.value) return;
  const { valid } = await form.value.validate();
  if (valid) emit('save', editedElement.data);
};

const update = (data: any) => {
  Object.assign(editedElement.data, data);
  if (props.autosave) emit('save', editedElement.data);
};

const resetData = () => {
  editedElement.data = cloneDeep(props.element.data);
};

watch(
  () => props.element,
  () => isDirty.value && resetData(),
);
</script>

<style lang="scss" scoped>
:deep(.v-input__control) {
  flex-wrap: wrap;
}
</style>
