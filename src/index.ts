import _Vue, { PluginFunction } from "vue";
import { VueConstructor } from "vue/types/vue";
import ToastInterface from "./ts/interface";
import { POSITION, TYPE } from "./ts/constants";
import { PluginOptions } from "./types";
import "./scss/index.scss";

function createToastInterface(
  eventBus: InstanceType<VueConstructor>
): ReturnType<typeof ToastInterface>;
function createToastInterface(
  options?: PluginOptions,
  Vue?: VueConstructor
): ReturnType<typeof ToastInterface>;
function createToastInterface(
  optionsOrEventBus?: PluginOptions | InstanceType<VueConstructor>,
  Vue = _Vue
) {
  const isVueInstance = (obj: unknown): obj is InstanceType<VueConstructor> =>
    obj instanceof Vue;
  if (isVueInstance(optionsOrEventBus)) {
    return ToastInterface(Vue, { eventBus: optionsOrEventBus }, false);
  }
  return ToastInterface(Vue, optionsOrEventBus, true);
}

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
