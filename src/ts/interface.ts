import _Vue from "vue";
import ToastContainer from "../components/VtToastContainer.vue";
import events from "./events";
import { TYPE, EVENTS } from "./constants";
import { getId } from "./utils";
import { ToastContent, ToastOptions, ToastID, PluginOptions } from "../types";

const ToastInterface = (Vue: typeof _Vue, globalOptions?: PluginOptions) => {
  new (Vue.extend(ToastContainer))({
    el: document.createElement("div"),
    propsData: globalOptions
  });
  const toast = (content: ToastContent, options?: ToastOptions): ToastID => {
    const props = Object.assign(
      {},
      { id: getId(), type: TYPE.DEFAULT },
      options,
      { content }
    );
    events.$emit(EVENTS.ADD, props);
    return props.id;
  };
  toast.clear = () => events.$emit(EVENTS.CLEAR);
  toast.updateDefaults = (update: PluginOptions) => {
    events.$emit(EVENTS.UPDATE_DEFAULTS, update);
  };
  toast.dismiss = (id: ToastID) => {
    events.$emit(EVENTS.DISMISS, id);
  };
  toast.update = (
    id: ToastID,
    { content, options }: { content?: ToastContent; options?: ToastOptions },
    create = false
  ) => {
    events.$emit(EVENTS.UPDATE, {
      id,
      options: Object.assign({}, options, { content }),
      create
    });
  };
  toast.success = (
    content: ToastContent,
    options?: ToastOptions & { type?: TYPE.SUCCESS }
  ) => toast(content, Object.assign({}, options, { type: TYPE.SUCCESS }));

  toast.info = (
    content: ToastContent,
    options?: ToastOptions & { type?: TYPE.INFO }
  ) => toast(content, Object.assign({}, options, { type: TYPE.INFO }));

  toast.error = (
    content: ToastContent,
    options?: ToastOptions & { type?: TYPE.ERROR }
  ) => toast(content, Object.assign({}, options, { type: TYPE.ERROR }));

  toast.warning = (
    content: ToastContent,
    options?: ToastOptions & { type?: TYPE.WARNING }
  ) => toast(content, Object.assign({}, options, { type: TYPE.WARNING }));

  return toast;
};

export default ToastInterface;
