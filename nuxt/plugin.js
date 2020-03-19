/* eslint-disable */
// @ts-nocheck
import Vue from "vue";
import Toast from "vue-toastification";

// @ts-ignore
Vue.use(Toast, <%= serialize(options.pluginOptions) %>)

export default function (ctx, inject) {
  inject('toast', Vue.$toast)
}