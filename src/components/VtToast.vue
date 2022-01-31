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

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue"

import { useDraggable } from "../ts/composables/useDraggable"
import { useFocusable } from "../ts/composables/useFocusable"
import { useHoverable } from "../ts/composables/useHoverable"
import { EVENTS, VT_NAMESPACE, TYPE } from "../ts/constants"
import { TOAST_DEFAULTS } from "../ts/propValidators"
import { getVueComponentFromObj, isString, getProp } from "../ts/utils"

import type { ToastOptionsAndContent } from "../types/toast"

import CloseButton from "./VtCloseButton.vue"
import Icon from "./VtIcon.vue"
import ProgressBar from "./VtProgressBar.vue"

interface ToastProps {
  content: ToastOptionsAndContent["content"]
  id?: ToastOptionsAndContent["id"]
  accessibility?: ToastOptionsAndContent["accessibility"]
  bodyClassName?: ToastOptionsAndContent["bodyClassName"]
  closeButton?: ToastOptionsAndContent["closeButton"]
  closeButtonClassName?: ToastOptionsAndContent["closeButtonClassName"]
  closeOnClick?: ToastOptionsAndContent["closeOnClick"]
  draggable?: ToastOptionsAndContent["draggable"]
  draggablePercent?: ToastOptionsAndContent["draggablePercent"]
  eventBus?: ToastOptionsAndContent["eventBus"]
  hideProgressBar?: ToastOptionsAndContent["hideProgressBar"]
  icon?: ToastOptionsAndContent["icon"]
  //?  PluginOptions[ToastOptionsAndContent
  onClick?: ToastOptionsAndContent["onClick"]
  //?  PluginOptions[ToastOptionsAndContent
  onClose?: ToastOptionsAndContent["onClose"]
  pauseOnFocusLoss?: ToastOptionsAndContent["pauseOnFocusLoss"]
  pauseOnHover?: ToastOptionsAndContent["pauseOnHover"]
  position?: ToastOptionsAndContent["position"]
  rtl?: ToastOptionsAndContent["rtl"]
  showCloseButtonOnHover?: ToastOptionsAndContent["showCloseButtonOnHover"]
  timeout?: ToastOptionsAndContent["timeout"]
  toastClassName?: ToastOptionsAndContent["toastClassName"]
  type?: ToastOptionsAndContent["type"]
}

const props = withDefaults(defineProps<ToastProps>(), {
  id: 0,
  accessibility: TOAST_DEFAULTS.accessibility,
  bodyClassName: TOAST_DEFAULTS.bodyClassName,
  closeButton: TOAST_DEFAULTS.closeButton,
  closeButtonClassName: TOAST_DEFAULTS.closeButtonClassName,
  closeOnClick: TOAST_DEFAULTS.closeOnClick,
  draggable: TOAST_DEFAULTS.draggable,
  draggablePercent: TOAST_DEFAULTS.draggablePercent,
  eventBus: TOAST_DEFAULTS.eventBus,
  hideProgressBar: TOAST_DEFAULTS.hideProgressBar,
  icon: TOAST_DEFAULTS.icon,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  pauseOnFocusLoss: TOAST_DEFAULTS.pauseOnFocusLoss,
  pauseOnHover: TOAST_DEFAULTS.pauseOnHover,
  position: TOAST_DEFAULTS.position,
  rtl: TOAST_DEFAULTS.rtl,
  showCloseButtonOnHover: TOAST_DEFAULTS.showCloseButtonOnHover,
  timeout: TOAST_DEFAULTS.timeout,
  toastClassName: TOAST_DEFAULTS.toastClassName,
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
