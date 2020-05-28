import { CombinedVueInstance } from "vue/types/vue";
import {
  createLocalVue,
  createWrapper,
  Wrapper,
  WrapperArray,
} from "@vue/test-utils";
import Toast, { POSITION } from "../../src/index";
import { PluginOptions } from "../../src/types";

const withGetToasts = <T extends Wrapper<Vue>>(wrapper: T) => {
  /* istanbul ignore next */
  (wrapper as T & { getToasts(): WrapperArray<Vue> }).getToasts = () =>
    wrapper.findAll(".Vue-Toastification__toast");
  return wrapper as T & { getToasts(): WrapperArray<Vue> };
};

const loadPlugin = (options?: PluginOptions) => {
  // Isolate vue and container
  const localVue = createLocalVue();
  const container = document.createElement("div");
  let containerComp;
  // Register the plugin and get the container component back
  localVue.use(Toast, {
    container,
    onMounted: (containerComponent) => (containerComp = containerComponent),
    ...options,
  });
  const containerWrapper = createWrapper(
    (containerComp as unknown) as CombinedVueInstance<
      Record<never, unknown> & Vue,
      unknown,
      unknown,
      unknown,
      Record<never, unknown>
    >
  );

  const positionContainers = {
    topLeft: withGetToasts(containerWrapper.find(`.${POSITION.TOP_LEFT}`)),
    topCenter: withGetToasts(containerWrapper.find(`.${POSITION.TOP_CENTER}`)),
    topRight: withGetToasts(containerWrapper.find(`.${POSITION.TOP_RIGHT}`)),
    bottomLeft: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_LEFT}`)
    ),
    bottomCenter: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_CENTER}`)
    ),
    bottomRight: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_RIGHT}`)
    ),
  };

  return { localVue, containerWrapper, ...positionContainers };
};

export { loadPlugin };
