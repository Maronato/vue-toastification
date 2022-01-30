<template>
  <div ref="el">
    <div v-for="pos in positions" :key="pos">
      <VtTransition
        :transition="defaults.transition"
        :class="toastClasses[pos]"
      >
        <Toast
          v-for="toast in positionToasts[pos]"
          :key="toast.id"
          v-bind="toast"
        />
      </VtTransition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
} from "vue"

import Toast from "./VtToast.vue"
import VtTransition from "./VtTransition.vue"

export default defineComponent({
  name: "VueToastification",
  devtools: {
    hide: true,
  },
  components: { Toast, VtTransition },
})
</script>

<script lang="ts" setup>
import { EVENTS, POSITION, VT_NAMESPACE } from "../ts/constants"
import { PLUGIN_DEFAULTS } from "../ts/propValidators"
import {
  PluginOptions,
  ToastID,
  ToastOptionsAndContent,
  ToastOptionsAndRequiredContent,
} from "../types"
import {
  removeElement,
  isFunction,
  normalizeToastComponent,
  isUndefined,
} from "../ts/utils"

import { ToastInterface } from ".."

interface ToastContainerProps {
  accessibility?: PluginOptions["accessibility"]
  bodyClassName?: PluginOptions["bodyClassName"]
  closeButton?: PluginOptions["closeButton"]
  closeButtonClassName?: PluginOptions["closeButtonClassName"]
  closeOnClick?: PluginOptions["closeOnClick"]
  container?: PluginOptions["container"]
  containerClassName?: PluginOptions["containerClassName"]
  draggable?: PluginOptions["draggable"]
  draggablePercent?: PluginOptions["draggablePercent"]
  eventBus?: PluginOptions["eventBus"]
  filterBeforeCreate?: PluginOptions["filterBeforeCreate"]
  filterToasts?: PluginOptions["filterToasts"]
  hideProgressBar?: PluginOptions["hideProgressBar"]
  icon?: PluginOptions["icon"]
  maxToasts?: PluginOptions["maxToasts"]
  newestOnTop?: PluginOptions["newestOnTop"]
  onMounted?: PluginOptions["onMounted"]
  pauseOnFocusLoss?: PluginOptions["pauseOnFocusLoss"]
  pauseOnHover?: PluginOptions["pauseOnHover"]
  position?: PluginOptions["position"]
  rtl?: PluginOptions["rtl"]
  shareAppContext?: PluginOptions["shareAppContext"]
  showCloseButtonOnHover?: PluginOptions["showCloseButtonOnHover"]
  timeout?: PluginOptions["timeout"]
  toastClassName?: PluginOptions["toastClassName"]
  toastDefaults?: PluginOptions["toastDefaults"]
  transition?: PluginOptions["transition"]
}

const props = withDefaults(defineProps<ToastContainerProps>(), {
  accessibility: PLUGIN_DEFAULTS.accessibility,
  bodyClassName: PLUGIN_DEFAULTS.bodyClassName,
  closeButton: PLUGIN_DEFAULTS.closeButton,
  closeButtonClassName: PLUGIN_DEFAULTS.closeButtonClassName,
  closeOnClick: PLUGIN_DEFAULTS.closeOnClick,
  container: PLUGIN_DEFAULTS.container,
  containerClassName: PLUGIN_DEFAULTS.containerClassName,
  draggable: PLUGIN_DEFAULTS.draggable,
  draggablePercent: PLUGIN_DEFAULTS.draggablePercent,
  eventBus: PLUGIN_DEFAULTS.eventBus,
  filterBeforeCreate: PLUGIN_DEFAULTS.filterBeforeCreate,
  filterToasts: PLUGIN_DEFAULTS.filterToasts,
  hideProgressBar: PLUGIN_DEFAULTS.hideProgressBar,
  icon: PLUGIN_DEFAULTS.icon,
  maxToasts: PLUGIN_DEFAULTS.maxToasts,
  newestOnTop: PLUGIN_DEFAULTS.newestOnTop,
  onMounted: PLUGIN_DEFAULTS.onMounted,
  pauseOnFocusLoss: PLUGIN_DEFAULTS.pauseOnFocusLoss,
  pauseOnHover: PLUGIN_DEFAULTS.pauseOnHover,
  position: PLUGIN_DEFAULTS.position,
  rtl: PLUGIN_DEFAULTS.rtl,
  shareAppContext: PLUGIN_DEFAULTS.shareAppContext,
  showCloseButtonOnHover: PLUGIN_DEFAULTS.showCloseButtonOnHover,
  timeout: PLUGIN_DEFAULTS.timeout,
  toastClassName: PLUGIN_DEFAULTS.toastClassName,
  toastDefaults: PLUGIN_DEFAULTS.toastDefaults,
  transition: PLUGIN_DEFAULTS.transition,
})

const positions = Object.values(POSITION)
const asPositionRecord = <T>(getValues: (position: POSITION) => T) =>
  positions.reduce(
    (agg, position) => ({
      ...agg,
      [position]: getValues(position),
    }),
    {} as Record<POSITION, T>
  )

const el = ref<HTMLElement>()
const defaults = reactive({ ...props })
const toasts = reactive<{
  [toastID: ToastID]: ToastOptionsAndRequiredContent
}>({})

const toastArray = computed(() => Object.values(toasts))
const filteredToasts = computed(() => {
  const filter = defaults.filterToasts as NonNullable<
    PluginOptions["filterToasts"]
  >

  return filter(toastArray.value)
})

const setup = async (container: NonNullable<PluginOptions["container"]>) => {
  if (isFunction(container)) {
    container = await container()
  }
  /* istanbul ignore else  */
  if (el.value) {
    removeElement(el.value)
    container.appendChild(el.value)
  }
}

const setToast = (props: ToastOptionsAndRequiredContent) => {
  if (!isUndefined(props.id)) {
    toasts[props.id] = props
  }
}

const addToast = (toastProps: ToastOptionsAndRequiredContent) => {
  toastProps.content = normalizeToastComponent(toastProps.content)
  const typeProps =
    (toastProps.type &&
      defaults.toastDefaults &&
      (defaults.toastDefaults as NonNullable<PluginOptions["toastDefaults"]>)[
        toastProps.type
      ]) ||
    {}
  let toast: ToastOptionsAndRequiredContent | false = {
    ...defaults,
    ...typeProps,
    ...toastProps,
  }
  const filterBeforeCreate = defaults.filterBeforeCreate as NonNullable<
    PluginOptions["filterBeforeCreate"]
  >

  toast = filterBeforeCreate(toast, toastArray.value)
  toast && setToast(toast)
}

const dismissToast: ToastInterface["dismiss"] = id => {
  const toast = toasts[id]
  if (toast && toast.onClose) {
    toast.onClose()
  }
  delete toasts[id]
}

const clearToasts: ToastInterface["clear"] = () => {
  Object.keys(toasts).forEach(dismissToast)
}

const positionToasts = computed(() => {
  const getPositionToasts = (position: POSITION) => {
    const toasts = filteredToasts.value
      .filter(toast => toast.position === position)
      .slice(0, defaults.maxToasts as number)
    return defaults.newestOnTop ? toasts.reverse() : toasts
  }
  return asPositionRecord(getPositionToasts)
})

const updateDefaults: ToastInterface["updateDefaults"] = update => {
  if (update.container) {
    setup(update.container)
  }
  Object.assign(defaults, update)
}

const updateToast = (params: {
  id: ToastID
  options: ToastOptionsAndContent
  create: boolean
}) => {
  const { id, create, options } = params
  if (toasts[id]) {
    // If a timeout is defined, and is equal to the one before, change it
    // a little so the progressBar is reset
    if (options.timeout && options.timeout === toasts[id].timeout) {
      options.timeout++
    }
    setToast({ ...toasts[id], ...options })
  } else if (create) {
    addToast({ id, ...(options as ToastOptionsAndRequiredContent) })
  }
}

const toastClasses = computed(() => {
  const getClasses = (position: POSITION) => {
    const classes = [`${VT_NAMESPACE}__container`, position]
    return classes.concat(defaults.containerClassName as string | string[])
  }
  return asPositionRecord(getClasses)
})

onBeforeMount(() => {
  props.eventBus.on(EVENTS.ADD, addToast)
  props.eventBus.on(EVENTS.CLEAR, clearToasts)
  props.eventBus.on(EVENTS.DISMISS, dismissToast)
  props.eventBus.on(EVENTS.UPDATE, updateToast)
  props.eventBus.on(EVENTS.UPDATE_DEFAULTS, updateDefaults)
  Object.assign(defaults, props)
})

onMounted(() => {
  const container = defaults.container as PluginOptions["container"]
  /* istanbul ignore else  */
  if (container) {
    setup(container)
  }
})
</script>
