import ToastInterface from "./js/interface";
import "./scss/index.scss";

const plugin = {};

plugin.install = (Vue, options = {}) => {
  const toast = ToastInterface(Vue, options);
  Vue.$toast = toast;
  Vue.prototype.$toast = toast;
};

export default plugin;
