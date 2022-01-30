/* eslint-disable @typescript-eslint/no-empty-function */
import type { PluginOptions } from "../types"
import { EventBus } from "./eventBus"
import { POSITION, VT_NAMESPACE } from "./constants"
import { InferDefaults } from "../types/vue-helper"

// This wraps a method to be returned as a factory function
const asFactory = <T>(f: T) => (() => f) as unknown as T

export const PLUGIN_DEFAULTS: Required<InferDefaults<Readonly<PluginOptions>>> =
  {
    accessibility: () => ({
      toastRole: "alert",
      closeButtonLabel: "close",
    }),
    bodyClassName: () => [],
    closeButton: () => "button",
    closeButtonClassName: () => [],
    closeOnClick: true,
    container: () => document.body,
    containerClassName: () => [],
    draggable: true,
    draggablePercent: 0.6,
    eventBus: /* istanbul ignore next */ () => new EventBus(),
    filterBeforeCreate: asFactory(toast => toast),
    filterToasts: asFactory(toasts => toasts),
    hideProgressBar: false,
    icon: () => true,
    maxToasts: 20,
    newestOnTop: true,
    onMounted: () => {},
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    position: POSITION.TOP_RIGHT,
    rtl: false,
    shareAppContext: false,
    showCloseButtonOnHover: false,
    timeout: 5000,
    toastClassName: () => [],
    toastDefaults: () => ({}),
    transition: `${VT_NAMESPACE}__bounce`,
  }
