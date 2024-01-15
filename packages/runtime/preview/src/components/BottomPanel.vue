<template>
  <div v-show="isLoaded">
    <v-tabs v-model="state.selectedTab">
      <v-tab :value="1">
        <VIcon class="mr-2" size="small">mdi-server</VIcon>
        Element server state
      </v-tab>
      <v-tab :value="2">
        <VChip append-icon="mdi-pen" class="mr-2" color="indigo" size="small">
          {{ state.elementHistory.length }}
        </VChip>
        Authoring changes
      </v-tab>
      <v-tab :value="3">
        <VChip
          append-icon="mdi-account"
          class="mr-2"
          color="green"
          size="small"
        >
          {{ state.userInteractions.length }}
        </VChip>
        End-User state changes
      </v-tab>
    </v-tabs>
    <div class="pa-6">
      <v-window v-model="state.selectedTab">
        <v-window-item :value="1">
          <JsonEditor
            v-if="isLoaded"
            :main-menu-bar="false"
            :status-bar="false"
            :value="orderKeys(props.element)"
            mode="text"
          />
        </v-window-item>
        <v-window-item :value="2">
          <VBtn class="mb-4" color="indigo-darken-4" variant="tonal">
            <VIcon class="mr-2 left">mdi-refresh</VIcon>
            Reset
          </VBtn>
          <MutationList :changes="state.elementHistory" />
        </v-window-item>
        <v-window-item :value="3">
          <VBtn class="mb-4" color="indigo-darken-4" variant="tonal">
            <VIcon class="mr-2 left">mdi-refresh</VIcon>
            Reset
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
import JsonEditor from 'vue3-ts-jsoneditor';

import MutationList from './MutationList.vue';

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

const orderKeys = (val: any) => {
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
      data: orderKeys(val),
    });
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
  },
  { deep: true },
);
</script>
