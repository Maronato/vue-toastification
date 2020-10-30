import Vue from "vue";
import { enableAutoPageviews } from "./plausible";
import vuetify from "./vuetify";
import App from "./App.vue";
import Toast from "../src/index";

Vue.config.productionTip = false;

Vue.use(Toast);

enableAutoPageviews();

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
