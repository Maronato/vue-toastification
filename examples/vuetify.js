import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: "fa"
  }
};

export default new Vuetify(opts);
