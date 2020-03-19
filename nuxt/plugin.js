import Vue from "vue";
import Toast from "vue-toastification";

Vue.use(Toast, <%= serialize(options.pluginOptions) %>)

export default function (ctx, inject) {
  inject('toast', Vue.$toast)
}
