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
        @closeToast="closeToast"
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

import { EVENTS, VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"
import { getVueComponentFromObj, isString, getProp } from "../ts/utils"

import ProgressBar from "./VtProgressBar.vue"
import CloseButton from "./VtCloseButton.vue"
import Icon from "./VtIcon.vue"
import { useHoverable } from "../ts/composables/useHoverable"
import { useFocusable } from "../ts/composables/useFocusable"
import { useDraggable } from "../ts/composables/useDraggable"

export default defineComponent({
  name: "VtToast",

  components: { ProgressBar, CloseButton, Icon },
  inheritAttrs: false,

  props: Object.assign({}, PROPS.CORE_TOAST, PROPS.TOAST),

  setup(props) {
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

    return {
      isRunning,
      classes,
      bodyClasses,
      clickHandler,
      getVueComponentFromObj,
      closeToast,
      getProp,
      el,
    }
  },
})
</script>
