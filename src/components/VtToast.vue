<template>
  <div
    :class="classes"
    :style="draggableStyle"
    @click="clickHandler"
    @mouseenter="hoverPause"
    @mouseleave="hoverPlay"
  >
    <Icon v-if="icon" :custom-icon="icon" :type="type" />
    <div :role="accessibility.toastRole || 'alert'" :class="bodyClasses">
      <template v-if="typeof content === 'string'">{{ content }}</template>
      <component
        :is="getVueComponentFromObj(content)"
        v-else
        :toast-id="id"
        v-bind="hasProp(content, 'props') ? content.props : {}"
        v-on="hasProp(content, 'listeners') ? content.listeners : {}"
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
      @closeToast="timeoutHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { EVENTS, VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"
import {
  getVueComponentFromObj,
  isString,
  getX,
  getY,
  isDOMRect,
  hasProp,
} from "../ts/utils"

import ProgressBar from "./VtProgressBar.vue"
import CloseButton from "./VtCloseButton.vue"
import Icon from "./VtIcon.vue"

export default defineComponent({
  name: "VtToast",

  components: { ProgressBar, CloseButton, Icon },
  inheritAttrs: false,

  props: Object.assign({}, PROPS.CORE_TOAST, PROPS.TOAST),

  data() {
    const data: {
      dragRect: DOMRect | Record<string, unknown>
      isRunning: boolean
      disableTransitions: boolean
      beingDragged: boolean
      dragStart: number
      dragPos: { x: number; y: number }
    } = {
      isRunning: true,
      disableTransitions: false,

      beingDragged: false,
      dragStart: 0,
      dragPos: { x: 0, y: 0 },
      dragRect: {},
    }
    return data
  },

  computed: {
    classes(): string[] {
      const classes = [
        `${VT_NAMESPACE}__toast`,
        `${VT_NAMESPACE}__toast--${this.type}`,
        `${this.position}`,
      ].concat(this.toastClassName)
      if (this.disableTransitions) {
        classes.push("disable-transition")
      }
      if (this.rtl) {
        classes.push(`${VT_NAMESPACE}__toast--rtl`)
      }
      return classes
    },
    bodyClasses(): string[] {
      const classes = [
        `${VT_NAMESPACE}__toast-${
          isString(this.content) ? "body" : "component-body"
        }`,
      ].concat(this.bodyClassName)
      return classes
    },
    draggableStyle(): {
      transition?: string
      opacity?: number
      transform?: string
    } {
      if (this.dragStart === this.dragPos.x) {
        return {}
      } else if (this.beingDragged) {
        return {
          transform: `translateX(${this.dragDelta}px)`,
          opacity: 1 - Math.abs(this.dragDelta / this.removalDistance),
        }
      } else {
        return {
          transition: "transform 0.2s, opacity 0.2s",
          transform: "translateX(0)",
          opacity: 1,
        }
      }
    },
    dragDelta(): number {
      return this.beingDragged ? this.dragPos.x - this.dragStart : 0
    },
    removalDistance(): number {
      if (isDOMRect(this.dragRect)) {
        return (
          (this.dragRect.right - this.dragRect.left) * this.draggablePercent
        )
      }
      return 0
    },
  },

  mounted() {
    if (this.draggable) {
      this.draggableSetup()
    }
    if (this.pauseOnFocusLoss) {
      this.focusSetup()
    }
  },
  beforeUnmount() {
    if (this.draggable) {
      this.draggableCleanup()
    }
    if (this.pauseOnFocusLoss) {
      this.focusCleanup()
    }
  },

  methods: {
    hasProp,
    getVueComponentFromObj,
    closeToast() {
      this.eventBus.emit(EVENTS.DISMISS, this.id)
    },
    clickHandler() {
      if (this.onClick) {
        this.onClick(this.closeToast)
      }
      if (this.closeOnClick) {
        if (!this.beingDragged || this.dragStart === this.dragPos.x) {
          this.closeToast()
        }
      }
    },
    timeoutHandler() {
      this.closeToast()
    },
    hoverPause() {
      if (this.pauseOnHover) {
        this.isRunning = false
      }
    },
    hoverPlay() {
      if (this.pauseOnHover) {
        this.isRunning = true
      }
    },
    focusPause() {
      this.isRunning = false
    },
    focusPlay() {
      this.isRunning = true
    },

    focusSetup() {
      addEventListener("blur", this.focusPause)
      addEventListener("focus", this.focusPlay)
    },
    focusCleanup() {
      removeEventListener("blur", this.focusPause)
      removeEventListener("focus", this.focusPlay)
    },

    draggableSetup() {
      const element = this.$el as HTMLElement
      element.addEventListener("touchstart", this.onDragStart, {
        passive: true,
      })
      element.addEventListener("mousedown", this.onDragStart)
      addEventListener("touchmove", this.onDragMove, { passive: false })
      addEventListener("mousemove", this.onDragMove)
      addEventListener("touchend", this.onDragEnd)
      addEventListener("mouseup", this.onDragEnd)
    },
    draggableCleanup() {
      const element = this.$el as HTMLElement
      element.removeEventListener("touchstart", this.onDragStart)
      element.removeEventListener("mousedown", this.onDragStart)
      removeEventListener("touchmove", this.onDragMove)
      removeEventListener("mousemove", this.onDragMove)
      removeEventListener("touchend", this.onDragEnd)
      removeEventListener("mouseup", this.onDragEnd)
    },

    onDragStart(event: TouchEvent | MouseEvent) {
      this.beingDragged = true
      this.dragPos = { x: getX(event), y: getY(event) }
      this.dragStart = getX(event)
      this.dragRect = this.$el.getBoundingClientRect()
    },
    onDragMove(event: TouchEvent | MouseEvent) {
      if (this.beingDragged) {
        event.preventDefault()
        if (this.isRunning) {
          this.isRunning = false
        }
        this.dragPos = { x: getX(event), y: getY(event) }
      }
    },
    onDragEnd() {
      if (this.beingDragged) {
        if (Math.abs(this.dragDelta) >= this.removalDistance) {
          this.disableTransitions = true
          this.$nextTick(() => this.closeToast())
        } else {
          setTimeout(() => {
            this.beingDragged = false
            if (
              isDOMRect(this.dragRect) &&
              this.pauseOnHover &&
              this.dragRect.bottom >= this.dragPos.y &&
              this.dragPos.y >= this.dragRect.top &&
              this.dragRect.left <= this.dragPos.x &&
              this.dragPos.x <= this.dragRect.right
            ) {
              this.isRunning = false
            } else {
              this.isRunning = true
            }
          })
        }
      }
    },
  },
})
</script>
