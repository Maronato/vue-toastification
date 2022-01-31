import "./scss/index.scss"
import { VueToastificationPlugin } from "./ts/plugin"

import {
  createToastInstance,
  provideToast,
  useToast,
} from "./ts/composables/useToast"

import { EventBus } from "./ts/eventBus"

import { POSITION, TYPE } from "./ts/constants"

import type { PluginOptions } from "./types/plugin"
import type { ToastInterface } from "./ts/interface"

export default VueToastificationPlugin

export {
  createToastInstance,
  provideToast,
  useToast,
  EventBus,
  POSITION,
  TYPE,
  PluginOptions,
  ToastInterface,
}
