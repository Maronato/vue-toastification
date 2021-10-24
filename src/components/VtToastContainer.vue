<template>
  <div ref="el">
    <div v-for="pos in positions" :key="pos">
      <VtTransition :transition="defaults.transition" :class="getClasses(pos)">
        <Toast
          v-for="toast in getPositionToasts(pos)"
          :key="toast.id"
          v-bind="toast"
        />
      </VtTransition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeMount,
} from "vue"

import { EVENTS, POSITION, VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"
import {
  ContainerOptions,
  ToastID,
  ToastOptions,
  ToastOptionsAndRequiredContent,
} from "../types"
import {
  removeElement,
  isUndefined,
  isFunction,
  normalizeToastComponent,
  getProp,
} from "../ts/utils"

import Toast from "./VtToast.vue"
import VtTransition from "./VtTransition.vue"
import { useEventBus } from "../ts/composables/useEventBus"

interface ToastRecord {
  [id: ToastID]: ToastOptionsAndRequiredContent
}

export default defineComponent({
  name: "VueToastification",
  devtools: {
    hide: true,
  },
  components: { Toast, VtTransition },

  props: Object.assign({}, PROPS.CORE_TOAST, PROPS.CONTAINER, PROPS.TRANSITION),

  setup(_props) {
    const toastRecord = reactive<ToastRecord>({})
    const el = ref<HTMLElement | null>(null)
    const props = { ..._props } as Required<ContainerOptions>

    const toastArray = computed(() =>
      Object.values(toastRecord).filter(
        (toast): toast is ToastOptionsAndRequiredContent => !isUndefined(toast)
      )
    )
    const filteredToasts = computed(() => props.filterToasts(toastArray.value))

    const setupContainer = async (
      providedContainer: ContainerOptions["container"]
    ) => {
      const container = isFunction(providedContainer)
        ? await providedContainer()
        : providedContainer
      if (el.value && container) {
        removeElement(el.value)
        container.appendChild(el.value)
      }
    }

    const setToast = (toast: ToastOptionsAndRequiredContent) =>
      !isUndefined(toast.id) && (toastRecord[toast.id] = toast)
    const addToast = (toast: ToastOptionsAndRequiredContent) => {
      toast.content = normalizeToastComponent(toast.content)
      const typeDefaults = getProp(props.toastDefaults, toast.type || "", {})
      const toastProps = { ...props, ...typeDefaults, ...toast }
      const filteredToast = props.filterBeforeCreate(
        toastProps,
        toastArray.value
      )
      if (filteredToast) {
        setToast(filteredToast)
      }
    }

    const dismissToast = (toastID?: ToastID) => {
      if (toastID) {
        const toast = toastRecord[toastID]
        if (toast && toast.onClose) {
          toast.onClose()
        }
        delete toastRecord[toastID]
      }
    }

    const clearToasts = () => toastArray.value.forEach(t => dismissToast(t.id))

    const getPositionToasts = (position: POSITION) => {
      const toasts = filteredToasts.value
        .filter(t => t.position === position)
        .slice(0, props.maxToasts)
      return props.newestOnTop ? toasts.reverse() : toasts
    }

    const updateDefaults = (update: ContainerOptions) => {
      if (update.container) {
        setupContainer(update.container)
      }
      Object.assign(props, update)
    }

    const updateToast: (update: {
      id: ToastID
      options: ToastOptions
      create: boolean
    }) => void = ({ id, options, create }) => {
      if (toastRecord[id]) {
        if (options.timeout && options.timeout === toastRecord[id].timeout) {
          options.timeout++
        }
        setToast({ ...toastRecord[id], ...options })
      } else if (create) {
        // @ts-expect-error Options may not actually have ID
        addToast({ id, ...options })
      }
    }

    const getClasses = (position: POSITION) =>
      [`${VT_NAMESPACE}__container`, position].concat(props.containerClassName)

    const events = useEventBus()
    onBeforeMount(() => {
      events.on(EVENTS.ADD, addToast)
      events.on(EVENTS.CLEAR, clearToasts)
      events.on(EVENTS.DISMISS, dismissToast)
      events.on(EVENTS.UPDATE, updateToast)
      events.on(EVENTS.UPDATE_DEFAULTS, updateDefaults)
    })
    onMounted(() => {
      setupContainer(props.container)
    })

    return {
      positions: POSITION,
      defaults: props,
      getClasses,
      getPositionToasts,
      el,
    }
  },
})
</script>
