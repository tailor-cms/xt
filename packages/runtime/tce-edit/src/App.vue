<template>
  <v-app>
    <v-main class="pa-4">
      <v-container>
        <v-row>
          <v-col>
            <h2 class="mb-5">Edit preview</h2>
            <v-sheet
              v-click-outside="unfocusElement"
              color="transparent"
              @click="isFocused = true"
            >
              <div class="edit-frame">
                <Edit
                  v-if="element.data"
                  :element="element"
                  :is-focused="isFocused"
                  @delete="onDelete"
                  @save="onSave"
                />
              </div>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Top toolbar</h3>
            <top-toolbar
              v-if="element.data"
              :element="element"
              :is-focused="isFocused"
              @delete="onDelete"
              @save="onSave"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Side toolbar</h3>
            <side-toolbar
              v-if="element.data"
              :element="element"
              :is-focused="isFocused"
              @delete="onDelete"
              @save="onSave"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ClickOutside } from 'vuetify/lib/directives';
import ky from 'ky';

import assetApi from './api/asset';

const SERVER_HOST = `localhost:${import.meta.env.VITE_TCE_SERVER_PORT || 8030}`;
const api = ky.create({ prefixUrl: `http://${SERVER_HOST}` });
const ws = new WebSocket(`ws://${SERVER_HOST}`);

export default {
  directives: {
    ClickOutside,
  },
  provide() {
    return {
      $storageService: assetApi,
      $elementBus: this.elementBus,
    };
  },
  data: () => ({
    element: {},
    isFocused: false,
  }),
  computed: {
    // TODO: Add editor bus
    elementBus: (vm) => vm.$radio.channel(`element:${vm.id}`),
  },
  async mounted() {
    await this.getElement();
    // Simulate SSE from Tailor
    ws.addEventListener('message', (event) => {
      this.element = JSON.parse(event.data);
    });
  },
  methods: {
    unfocusElement() {
      this.isFocused = false;
    },
    onSave(data) {
      this.updateElementData(data);
      // eslint-disable-next-line vue/require-explicit-emits
      this.$emit('save', data);
    },
    onDelete() {
      // eslint-disable-next-line vue/require-explicit-emits
      this.$emit('delete');
    },
    async getElement() {
      try {
        const response = await api('content-element', {
          searchParams: { runtime: 'authoring' },
        }).json();
        if (response === null) return;
        this.element = response;
      } catch (error) {
        console.log('Error on element get', error);
        // Retry
        setTimeout(() => this.getElement(), 2000);
      }
    },
    async updateElementData(data) {
      try {
        const response = await api
          .patch(`content-element/${this.element.id}`, { json: { data } })
          .json();

        this.element = response;
      } catch (error) {
        console.log('Error on element update', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-application {
  background-color: transparent !important;
}
</style>
