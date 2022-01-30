<template>
  <div ref="el" :class="classes" @click="clickHandler">
    <Icon v-if="icon" :custom-icon="icon" :type="type" />
    <div :role="accessibility.toastRole || 'alert'" :class="bodyClasses">
      <template v-if="typeof content === 'string'">{{ content }}</template>
      <component
        :is="getVueComponentFromObj(content)"
        v-else
        :toast-id="id"
        v-bind="getProp(content, 'props', {})"
        v-on="getProp(content, 'listeners', {})"
        @close-toast="closeToast"
      />
    </div>
    <CloseButton
      v-if="!!closeButton"
      :component="closeButton"
      :class-names="closeButtonClassName"
      :show-on-hover="showCloseButtonOnHover"
      :aria-label="accessibility.closeButtonLabel"
      @click.stop="closeToast"
    />
    <ProgressBar
      v-if="timeout"
      :is-running="isRunning"
      :hide-progress-bar="hideProgressBar"
      :timeout="timeout"
      @close-toast="closeToast"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from "vue"
import ProgressBar from "./VtProgressBar.vue"
import CloseButton from "./VtCloseButton.vue"
import Icon from "./VtIcon.vue"

export default defineComponent({
  name: "VtToast",
  components: { ProgressBar, CloseButton, Icon },
  inheritAttrs: false,
})
</script>

<script lang="ts" setup>
import { EVENTS, VT_NAMESPACE, TYPE } from "../ts/constants"
import { PLUGIN_DEFAULTS } from "../ts/propValidators"
import { getVueComponentFromObj, isString, getProp } from "../ts/utils"
import { useHoverable } from "../ts/composables/useHoverable"
import { useFocusable } from "../ts/composables/useFocusable"
import { useDraggable } from "../ts/composables/useDraggable"
import { ToastOptions, ToastOptionsAndRequiredContent } from "../types"

interface ToastProps {
  content: ToastOptionsAndRequiredContent["content"]
  id?: ToastOptions["id"]
  accessibility?: ToastOptions["accessibility"]
  bodyClassName?: ToastOptions["bodyClassName"]
  closeButton?: ToastOptions["closeButton"]
  closeButtonClassName?: ToastOptions["closeButtonClassName"]
  closeOnClick?: ToastOptions["closeOnClick"]
  draggable?: ToastOptions["draggable"]
  draggablePercent?: ToastOptions["draggablePercent"]
  eventBus?: ToastOptions["eventBus"]
  hideProgressBar?: ToastOptions["hideProgressBar"]
  icon?: ToastOptions["icon"]
  //?  PluginOptions[ToastOptions
  onClick?: ToastOptions["onClick"]
  //?  PluginOptions[ToastOptions
  onClose?: ToastOptions["onClose"]
  pauseOnFocusLoss?: ToastOptions["pauseOnFocusLoss"]
  pauseOnHover?: ToastOptions["pauseOnHover"]
  position?: ToastOptions["position"]
  rtl?: ToastOptions["rtl"]
  showCloseButtonOnHover?: ToastOptions["showCloseButtonOnHover"]
  timeout?: ToastOptions["timeout"]
  toastClassName?: ToastOptions["toastClassName"]
  type?: ToastOptions["type"]
}

const props = withDefaults(defineProps<ToastProps>(), {
  id: 0,
  accessibility: PLUGIN_DEFAULTS.accessibility,
  bodyClassName: PLUGIN_DEFAULTS.bodyClassName,
  closeButton: PLUGIN_DEFAULTS.closeButton,
  closeButtonClassName: PLUGIN_DEFAULTS.closeButtonClassName,
  closeOnClick: PLUGIN_DEFAULTS.closeOnClick,
  draggable: PLUGIN_DEFAULTS.draggable,
  draggablePercent: PLUGIN_DEFAULTS.draggablePercent,
  eventBus: PLUGIN_DEFAULTS.eventBus,
  hideProgressBar: PLUGIN_DEFAULTS.hideProgressBar,
  icon: PLUGIN_DEFAULTS.icon,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  pauseOnFocusLoss: PLUGIN_DEFAULTS.pauseOnFocusLoss,
  pauseOnHover: PLUGIN_DEFAULTS.pauseOnHover,
  position: PLUGIN_DEFAULTS.position,
  rtl: PLUGIN_DEFAULTS.rtl,
  showCloseButtonOnHover: PLUGIN_DEFAULTS.showCloseButtonOnHover,
  timeout: PLUGIN_DEFAULTS.timeout,
  toastClassName: PLUGIN_DEFAULTS.toastClassName,
  type: TYPE.DEFAULT,
})

const el = ref<HTMLElement>()

const { hovering } = useHoverable(el, props)
const { focused } = useFocusable(el, props)
const { beingDragged, dragComplete } = useDraggable(el, props)

const isRunning = computed(
  () => !hovering.value && focused.value && !beingDragged.value
)

const closeToast = () => {
  props.eventBus.emit(EVENTS.DISMISS, props.id)
}

const clickHandler = () => {
  if (!beingDragged.value) {
    if (props.onClick) {
      props.onClick(closeToast)
    }
    if (props.closeOnClick) {
      closeToast()
    }
  }
}

watch(dragComplete, v => {
  if (v) {
    nextTick(() => closeToast())
  }
})
const classes = computed(() => {
  const classes = [
    `${VT_NAMESPACE}__toast`,
    `${VT_NAMESPACE}__toast--${props.type}`,
    `${props.position}`,
  ].concat(props.toastClassName)
  if (dragComplete.value) {
    classes.push("disable-transition")
  }
  if (props.rtl) {
    classes.push(`${VT_NAMESPACE}__toast--rtl`)
  }
  return classes
})
const bodyClasses = computed(() =>
  [
    `${VT_NAMESPACE}__toast-${
      isString(props.content) ? "body" : "component-body"
    }`,
  ].concat(props.bodyClassName)
)
</script>
