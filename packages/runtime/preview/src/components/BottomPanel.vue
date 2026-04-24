<template>
  <div>
    <VTabs v-model="state.selectedTab">
      <VTab :value="1">
        <VChip
          :text="state.elementHistory.length"
          append-icon="mdi-pen"
          class="mr-2"
          color="indigo"
          size="small"
        />
        Authoring history
      </VTab>
      <VTab :value="2">
        <VChip
          :text="state.userInteractions.length"
          append-icon="mdi-account"
          class="mr-2"
          color="green"
          size="small"
        />
        End-User state history
      </VTab>
    </VTabs>
    <div class="pa-6">
      <VWindow v-model="state.selectedTab">
        <VWindowItem :value="1" class="authoring-window">
          <VBtn
            class="mb-4"
            color="indigo-darken-4"
            prepend-icon="mdi-refresh"
            text="Reset content element"
            variant="tonal"
            @click="$emit('resetElement')"
          />
          <MutationList :changes="state.elementHistory" />
        </VWindowItem>
        <VWindowItem :value="2" class="user-state-window">
          <VBtn
            class="mb-4"
            color="indigo-darken-4"
            prepend-icon="mdi-refresh"
            text="Reset state context"
            variant="tonal"
            @click="$emit('resetState')"
          />
          <MutationList :changes="state.userInteractions" />
        </VWindowItem>
      </VWindow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { format as formatDate } from 'date-fns';

import MutationList from './MutationList.vue';

defineEmits(['resetElement', 'resetState']);
const props = defineProps<{
  element: any;
  userState: any;
}>();

const state = reactive({
  selectedTab: 1,
  elementHistory: [] as any[],
  userInteractions: [] as any[],
});

const orderContentElementKeys = (val: any) => {
  return [
    'id',
    'uid',
    'type',
    'position',
    'data',
    'meta',
    'refs',
    'contentId',
    'contentSignature',
    'linked',
    'detached',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ].reduce((acc: any, key: string) => {
    acc[key] = val[key];
    return acc;
  }, {});
};

watch(
  () => props.element,
  (val) => {
    if (val.updatedAt === state.elementHistory[0]?.data?.updatedAt) return;
    state.elementHistory.unshift({
      id: state.elementHistory.length,
      title: formatDate(val.updatedAt, 'HH:mm:ss'),
      data: orderContentElementKeys(val),
    });
    state.selectedTab = 1;
  },
  { deep: true, immediate: true },
);

watch(
  () => props.userState,
  (val) => {
    state.userInteractions.unshift({
      id: state.userInteractions.length,
      title: formatDate(new Date(), 'HH:mm:ss'),
      data: val,
    });
    state.selectedTab = 2;
  },
  { deep: true, immediate: true },
);
</script>
