<template>
  <div ref="el">
    <div v-for="pos in positions" :key="pos">
      <VtTransition
        :transition="containerProps.transition"
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

<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue"

import { EVENTS, POSITION, VT_NAMESPACE } from "../ts/constants"
import { ToastInterface } from "../ts/interface"
import { TOAST_CONTAINER_DEFAULTS } from "../ts/propValidators"
import {
  removeElement,
  isFunction,
  normalizeToastComponent,
  isUndefined,
} from "../ts/utils"

import type { ToastID } from "../types/common"
import type { ToastOptionsAndContent } from "../types/toast"
import type { ToastContainerOptions } from "../types/toastContainer"

import Toast from "./VtToast.vue"
import VtTransition from "./VtTransition.vue"

interface ToastContainerProps {
  position?: ToastContainerOptions["position"]
  container?: ToastContainerOptions["container"]
  containerClassName?: ToastContainerOptions["containerClassName"]
  defaultToastProps?: ToastContainerOptions["defaultToastProps"]
  eventBus?: ToastContainerOptions["eventBus"]
  filterBeforeCreate?: ToastContainerOptions["filterBeforeCreate"]
  filterToasts?: ToastContainerOptions["filterToasts"]
  maxToasts?: ToastContainerOptions["maxToasts"]
  newestOnTop?: ToastContainerOptions["newestOnTop"]
  toastDefaults?: ToastContainerOptions["toastDefaults"]
  transition?: ToastContainerOptions["transition"]
}

const props = withDefaults(defineProps<ToastContainerProps>(), {
  position: TOAST_CONTAINER_DEFAULTS.position,
  container: TOAST_CONTAINER_DEFAULTS.container,
  containerClassName: TOAST_CONTAINER_DEFAULTS.containerClassName,
  defaultToastProps: () => ({}),
  eventBus: TOAST_CONTAINER_DEFAULTS.eventBus,
  filterBeforeCreate: TOAST_CONTAINER_DEFAULTS.filterBeforeCreate,
  filterToasts: TOAST_CONTAINER_DEFAULTS.filterToasts,
  maxToasts: TOAST_CONTAINER_DEFAULTS.maxToasts,
  newestOnTop: TOAST_CONTAINER_DEFAULTS.newestOnTop,
  toastDefaults: TOAST_CONTAINER_DEFAULTS.toastDefaults,
  transition: TOAST_CONTAINER_DEFAULTS.transition,
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

const overrideContainerProps = reactive<ToastContainerProps>({})
const containerProps = computed(() => ({
  ...props,
  ...overrideContainerProps,
}))
const defaultToastProps = computed(() => ({
  eventBus: containerProps.value.eventBus,
  position: containerProps.value.position,
  ...containerProps.value.defaultToastProps,
}))
const defaultToastTypeProps = computed(() => containerProps.value.toastDefaults)

const toasts = reactive<{
  [toastID: ToastID]: ToastOptionsAndContent
}>({})

const toastArray = computed(() => Object.values(toasts))
const filteredToasts = computed(() => {
  const filter = containerProps.value.filterToasts as NonNullable<
    ToastContainerOptions["filterToasts"]
  >

  return filter(toastArray.value)
})

const setup = async (
  container: NonNullable<ToastContainerOptions["container"]>
) => {
  if (isFunction(container)) {
    container = await container()
  }
  /* istanbul ignore else  */
  if (el.value) {
    removeElement(el.value)
    container.appendChild(el.value)
  }
}

const setToast = (props: ToastOptionsAndContent) => {
  if (!isUndefined(props.id)) {
    toasts[props.id] = props
  }
}

const addToast = (toastProps: ToastOptionsAndContent) => {
  toastProps.content = normalizeToastComponent(toastProps.content)
  const typeProps =
    (toastProps.type && defaultToastTypeProps.value[toastProps.type]) || {}
  let toast: ToastOptionsAndContent | false = {
    ...defaultToastProps.value,
    ...typeProps,
    ...toastProps,
  }
  const filterBeforeCreate = containerProps.value
    .filterBeforeCreate as NonNullable<
    ToastContainerOptions["filterBeforeCreate"]
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
      .slice(0, containerProps.value.maxToasts as number)
    return containerProps.value.newestOnTop ? toasts.reverse() : toasts
  }
  return asPositionRecord(getPositionToasts)
})

const updateDefaults: ToastInterface["updateDefaults"] = update => {
  if (update.container) {
    setup(update.container)
  }
  Object.assign(overrideContainerProps, update)
}

const updateToast = (params: {
  id: ToastID
  options: Partial<ToastOptionsAndContent>
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
    addToast({ id, ...(options as ToastOptionsAndContent) })
  }
}

const toastClasses = computed(() => {
  const getClasses = (position: POSITION) => {
    const classes = [`${VT_NAMESPACE}__container`, position]
    return classes.concat(
      containerProps.value.containerClassName as string | string[]
    )
  }
  return asPositionRecord(getClasses)
})

onBeforeMount(() => {
  props.eventBus.on(EVENTS.ADD, addToast)
  props.eventBus.on(EVENTS.CLEAR, clearToasts)
  props.eventBus.on(EVENTS.DISMISS, dismissToast)
  props.eventBus.on(EVENTS.UPDATE, updateToast)
  props.eventBus.on(EVENTS.UPDATE_DEFAULTS, updateDefaults)
})

onMounted(() => {
  const container = containerProps.value
    .container as ToastContainerOptions["container"]
  /* istanbul ignore else  */
  if (container) {
    setup(container)
  }
})
</script>

<script lang="ts">
export default {
  devtools: {
    hide: true,
  },
}
</script>
