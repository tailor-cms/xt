<template>
  <VDataIterator :items="changes" :items-per-page="50" expand-on-click>
    <template #default="{ items, isExpanded, toggleExpand }">
      <template v-for="(item, index) in items" :key="item.raw.id">
        <v-card
          :disabled="index === 0"
          :ripple="false"
          class="mb-1"
          @click="toggleExpand(item)"
        >
          <v-card-title class="d-flex align-center">
            <v-icon color="orange-darken-3" icon="mdi-update" size="18" start />
            <div class="text-body-1">{{ item.raw.title }}</div>
          </v-card-title>
          <v-card-text v-if="isExpanded(item) || index === 0">
            <JsonEditor
              :main-menu-bar="false"
              :status-bar="false"
              :value="item.raw.data"
              mode="text"
            />
          </v-card-text>
        </v-card>
      </template>
    </template>
  </VDataIterator>
</template>

<script setup lang="ts">
import JsonEditor from 'vue3-ts-jsoneditor';

defineProps<{ changes: any[] }>();
</script>

<style scoped lang="scss">
.v-card--disabled > :not(.v-card__loader) {
  opacity: 1 !important;
}
</style>
