import "./scss/index.scss"
import { VueToastificationPlugin } from "./ts/composables/useToast"

export {
  createToastInstance,
  provideToast,
  useToast,
} from "./ts/composables/useToast"

export { EventBus } from "./ts/eventBus"

export { POSITION, TYPE } from "./ts/constants"

export type { PluginOptions } from "./types"
export type { ToastInterface } from "./ts/interface"

export default VueToastificationPlugin
