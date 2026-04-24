<template>
  <EmbeddedContainer :elements="elements" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import EmbeddedContainer from '../EmbeddedContainer.vue';

const props = defineProps<{
  question: string[];
  embeds: Record<string, any>;
}>();

const elements = computed(() => props.question.map((id) => props.embeds[id]));
</script>
