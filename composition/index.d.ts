import { VueConstructor } from "vue/types/umd";
import { PluginOptions } from "vue-toastification/dist/types/src/types";
import ToastInterface from "vue-toastification/dist/types/src/ts/interface";
declare let provideToast: (options?: PluginOptions) => void;
declare let useToast: (
  eventBus?: InstanceType<VueConstructor>
) => ReturnType<typeof ToastInterface>;
export { provideToast, useToast };
