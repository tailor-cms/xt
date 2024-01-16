<template>
  <div v-show="isLoaded">
    <v-tabs v-model="state.selectedTab">
      <v-tab :value="1">
        <VChip append-icon="mdi-pen" class="mr-2" color="indigo" size="small">
          {{ state.elementHistory.length }}
        </VChip>
        Authoring history
      </v-tab>
      <v-tab :value="2">
        <VChip
          append-icon="mdi-account"
          class="mr-2"
          color="green"
          size="small"
        >
          {{ state.userInteractions.length }}
        </VChip>
        End-User state history
      </v-tab>
    </v-tabs>
    <div class="pa-6">
      <v-window v-model="state.selectedTab">
        <v-window-item :value="1">
          <VBtn
            class="mb-4"
            color="indigo-darken-4"
            variant="tonal"
            @click="$emit('resetElement')"
          >
            <VIcon class="mr-2 left">mdi-refresh</VIcon>
            Reset content element
          </VBtn>
          <MutationList :changes="state.elementHistory" />
        </v-window-item>
        <v-window-item :value="2">
          <VBtn
            class="mb-4"
            color="indigo-darken-4"
            variant="tonal"
            @click="$emit('resetState')"
          >
            <VIcon class="mr-2 left">mdi-refresh</VIcon>
            Reset end-user state
          </VBtn>
          <MutationList :changes="state.userInteractions" />
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { format as formatDate } from 'date-fns';

import MutationList from './MutationList.vue';

defineEmits(['resetElement', 'resetState']);
const props = defineProps<{
  isLoaded: Boolean;
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
    state.elementHistory.unshift({
      id: state.elementHistory.length,
      title: formatDate(val.updatedAt, 'HH:mm:ss'),
      data: orderContentElementKeys(val),
    });
    state.selectedTab = 1;
  },
  { deep: true },
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
  { deep: true },
);
</script>
