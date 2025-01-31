<!-- eslint-disable vue/no-undef-components -->
<template>
  <VCard class="question-container" color="grey-lighten-5">
    <VToolbar class="px-4" color="primary-darken-2" height="36">
      <VIcon :icon="icon" color="secondary-lighten-2" size="18" start />
      <span class="text-subtitle-2">{{ type }}</span>
    </VToolbar>
    <VForm ref="form" class="content text-left pa-6" validate-on="submit">
      <Edit
        v-bind="{
          ...$attrs,
          element: editedElement,
          isFocused,
          isDisabled,
        }"
        @delete="emit('delete')"
        @link="emit('link', $event)"
        @save="save"
        @update="Object.assign(editedElement.data, $event)"
      />
      <VFadeTransition>
        <div v-if="!isDisabled && isDirty" class="d-flex justify-end">
          <VBtn color="primary-darken-4" variant="text" @click="cancel">
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
import { computed, reactive, ref, watch } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

interface Props {
  element: any;
  type?: string;
  icon?: string;
  isDisabled?: boolean;
  isFocused?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'Question element',
  icon: 'mdi-help-circle-outline',
  isDisabled: false,
  isFocused: false,
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

const cancel = () => {
  editedElement.data = cloneDeep(props.element.data);
};

watch(
  () => props.element,
  () => {
    if (!isDirty.value) return;
    editedElement.data = cloneDeep(props.element.data);
  },
);
</script>

<style lang="scss" scoped>
:deep(.v-input__control) {
  flex-wrap: wrap;
}
</style>
