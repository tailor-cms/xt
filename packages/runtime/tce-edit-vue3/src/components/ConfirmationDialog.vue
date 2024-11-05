<template>
  <VDialog v-model="isVisible" width="500" persistent @click:outside="close">
    <VCard
      :text="context.message"
      :title="context.title"
      prepend-icon="mdi-alert-circle"
    >
      <VDivider />
      <VCardActions>
        <VBtn
          :slim="false"
          color="primary-darken-4"
          variant="text"
          @click="close"
        >
          Close
        </VBtn>
        <VBtn
          :focus="isVisible"
          :slim="false"
          color="primary-darken-2"
          variant="tonal"
          @click="confirm"
        >
          Confirm
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import invoke from 'lodash/invoke';

const createContext = () => ({
  title: '',
  message: '',
  action: () => {},
});

const eventBus = inject('$eventBus') as any;

const isVisible = ref(false);
const context = ref(createContext());

const open = (contextValue: any) => {
  context.value = contextValue;
  isVisible.value = true;
  invoke(context.value, 'onOpen');
};

const close = () => {
  isVisible.value = false;
  invoke(context.value, 'onClose');
  // Wait for transition to end before resetting context
  setTimeout(() => {
    context.value = createContext();
  }, 200);
};

const confirm = () => {
  context.value?.action();
  close();
};

onMounted(() => eventBus.on('showConfirmationModal', open));
onBeforeUnmount(() => eventBus.off('showConfirmationModal', open));
</script>
