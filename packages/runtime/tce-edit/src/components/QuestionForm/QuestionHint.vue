<template>
  <div class="question-hint">
    <div class="text-title-small mb-2">Hint</div>
    <VTextField
      :clearable="!isReadonly"
      :model-value="hint"
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
