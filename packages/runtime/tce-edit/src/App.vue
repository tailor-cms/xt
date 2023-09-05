<template>
  <v-app>
    <v-main class="pa-4">
      <v-container>
        <v-row>
          <v-col @click="isFocused = true">
            <h2 class="mb-5">Edit preview</h2>
            <div class="edit-frame">
              <Edit
                v-if="element.data"
                :element="element"
                :is-focused="isFocused"
                @delete="onDelete"
                @save="onSave"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Top toolbar</h3>
            <top-toolbar />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h3>Side toolbar</h3>
            <side-toolbar />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ky from 'ky';

const SERVER_HOST = `localhost:${import.meta.env.VITE_TCE_SERVER_PORT || 8030}`;
const api = ky.create({ prefixUrl: `http://${SERVER_HOST}` });
const ws = new WebSocket(`ws://${SERVER_HOST}`);

export default {
  data: () => ({
    element: {},
    isFocused: false,
  }),
  async mounted() {
    await this.getElement();
    // Simulate SSE from Tailor
    ws.addEventListener('message', (event) => {
      this.element = JSON.parse(event.data);
    });
  },
  methods: {
    // TODO: Missing implementation (vue-clickaway removed)
    unfocusElement() {
      this.isFocused = false;
    },
    onSave(data) {
      this.updateElementData(data);
      this.$emit('save', data);
    },
    onDelete() {
      this.$emit('delete');
    },
    async getElement() {
      try {
        const response = await api('content-element').json();
        if (response === null) return;
        this.element = response;
      } catch (error) {
        console.log('Error on element get', error);
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
