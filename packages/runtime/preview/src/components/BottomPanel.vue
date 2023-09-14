<template>
  <div v-show="isLoaded">
    <v-tabs density="compact" hide-slider>
      <v-tab>Server state</v-tab>
    </v-tabs>
    <div class="pa-6">
      <JsonEditor
        v-if="isLoaded"
        :main-menu-bar="false"
        :status-bar="false"
        :value="orderKeys(props.element)"
        mode="text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import JsonEditor from 'vue3-ts-jsoneditor';

const props = defineProps<{ element: any; isLoaded: Boolean }>();

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
</script>
