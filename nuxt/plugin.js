import Vue from "vue";
import Toast from "vue-toastification";

Vue.use(Toast, <%= serialize(options) %>)

export default function (ctx, inject) {
  inject('toast', Vue.$toast)
}
