<template>
  <VMenu
    v-model="isOpen"
    :close-on-content-click="false"
    location="bottom end"
    width="26rem"
  >
    <template #activator="{ props: menuProps }">
      <VBtn
        v-bind="{ ...menuProps, ...$attrs }"
        :disabled="disabled"
        color="secondary"
        prepend-icon="mdi-creation"
        text="Generate"
        variant="tonal"
      />
    </template>
    <VCard class="pa-4">
      <div class="composer-header text-label-medium">
        <VIcon icon="mdi-creation" size="small" start />
        AI Context
      </div>
      <VTextarea
        v-model="context"
        class="mt-2"
        density="comfortable"
        max-rows="10"
        placeholder="Describe what this element should contain..."
        rows="3"
        variant="outlined"
        auto-grow
        hide-details
      />
      <div class="d-flex justify-end mt-3">
        <VBtn
          color="secondary"
          prepend-icon="mdi-creation"
          text="Generate"
          variant="flat"
          @click="generate"
        />
      </div>
    </VCard>
  </VMenu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), { disabled: false });

const context = defineModel<string>({ default: '' });
const emit = defineEmits(['generate']);

const isOpen = ref(false);

const generate = () => {
  isOpen.value = false;
  emit('generate');
};
</script>

<style lang="scss" scoped>
.composer-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
