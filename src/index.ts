import _Vue, { PluginFunction } from "vue";
import ToastInterface from "./ts/interface";
import { POSITION, TYPE } from "./ts/constants";
import { PluginOptions } from "./types";
import "./scss/index.scss";

const createToastInterface = (options?: PluginOptions, Vue = _Vue) =>
  ToastInterface(Vue, options);

const VueToastificationPlugin: PluginFunction<PluginOptions> = (
  Vue,
  options?
) => {
  const toast = createToastInterface(options, Vue);
  Vue.$toast = toast;
  Vue.prototype.$toast = toast;
};

export default VueToastificationPlugin;

export { POSITION, TYPE, createToastInterface };
