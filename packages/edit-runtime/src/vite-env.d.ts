/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vuetify";
declare module "vuetify/lib";
declare module "vuetify/lib/components";
declare module "vuetify/lib/directives";
