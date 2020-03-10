import Vue from "vue";
import vuetify from "./vuetify";
import App from "./App.vue";
import Toast from "../src/index";
import "../src/scss/index.scss";

Vue.config.productionTip = false;

Vue.use(Toast);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");
