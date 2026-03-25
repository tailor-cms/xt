<template>
  <div class="hint-container">
    <div class="text-subtitle-2 mb-2">Hint</div>
    <VTextField
      :model-value="hint"
      :clearable="!isReadonly"
      :readonly="isReadonly"
      placeholder="Optional hint..."
      variant="outlined"
      @update:model-value="$emit('update', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ hint: string; isReadonly: boolean }>();
defineEmits(['update']);
</script>
