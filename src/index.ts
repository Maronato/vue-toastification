import { PluginFunction } from "vue";
import ToastInterface from "./ts/interface";
import { POSITION, TYPE } from "./ts/constants";
import { PluginOptions } from "./types";
import "./scss/index.scss";

const VueToastificationPlugin: PluginFunction<PluginOptions> = (
  Vue,
  options?
) => {
  const toast = ToastInterface(Vue, options);
  Vue.$toast = toast;
  Vue.prototype.$toast = toast;
};

export default VueToastificationPlugin;

export { POSITION, TYPE };
