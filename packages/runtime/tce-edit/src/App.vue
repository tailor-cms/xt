<template>
  <v-app>
    <v-main class="pa-4">
      <v-container>
        <v-row>
          <v-col>
            <v-chip
              class="elevation-2 mt-1 mb-2 body-2 font-weight-bold"
              color="#E0FB61"
              label
            >
              Authoring component
            </v-chip>
            <v-sheet
              v-click-outside="unfocusElement"
              color="transparent"
              @click="isFocused = true"
            >
              <div class="edit-frame pt-3">
                <Edit
                  v-if="element.data"
                  :element="element"
                  :is-focused="isFocused"
                  @delete="onDelete"
                  @link="onLink"
                  @save="onSave"
                />
              </div>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <v-chip
                class="elevation-2 my-3 body-2 font-weight-bold"
                color="grey darken-3"
                dark
                label
              >
                Top toolbar
              </v-chip>
            </div>
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
            <v-chip
              class="elevation-2 my-3 body-2 font-weight-bold"
              color="grey darken-3"
              dark
              label
            >
              Side toolbar
            </v-chip>
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
    <v-dialog v-model="isLinkDialogVisible" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5">Link element dialog</v-card-title>
        <v-card-text>
          In Tailor, this action will open a dialog to select a content element
          to link to. The `refs` property is updated with mock data to reflect
          the mocked selection.
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue-grey darken-2"
            text
            @click="isLinkDialogVisible = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { ClickOutside } from 'vuetify/lib/directives';
import ky from 'ky';

import assetApi from './api/asset';

const appUrl = new URL(window.location.href);
const apiPrefix = '/tce-server';
const api = ky.create({ prefixUrl: apiPrefix });
const wsProtocol = appUrl.protocol === 'http:' ? 'ws:' : 'wss:';
const ws = new WebSocket(`${wsProtocol}//${appUrl.host}${apiPrefix}`);

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
    isLinkDialogVisible: false,
  }),
  computed: {
    // TODO: Add editor bus
    elementBus: (vm) => vm.$radio.channel(`element:${vm.id}`),
  },
  async mounted() {
    await this.getElement();
    // Simulate SSE from Tailor
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== 'element:update') return;
      this.element = data.payload;
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
    async onLink() {
      this.isLinkDialogVisible = true;
      const refs = {
        linked: [
          {
            outlineId: 1,
            containerId: 2,
            id: 3,
          },
        ],
      };
      await api
        .patch(`content-element/${this.element.id}`, { json: { refs } })
        .json();
    },
    async getElement() {
      try {
        const response = await api('content-element', {
          searchParams: { runtime: 'authoring' },
        }).json();
        if (response === null) return;
        this.element = response?.element;
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
