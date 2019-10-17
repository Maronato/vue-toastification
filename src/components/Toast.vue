<template>
  <div
    :class="classes"
    :style="draggableStyle"
    @click="clickHandler"
    @mouseenter="hoverPause"
    @mouseleave="hoverPlay"
    @blur="focusPause"
    @focus="focusPlay"
  >
    <template v-if="typeof content === 'string'">
      <div :class="bodyClasses">{{ content }}</div>
    </template>
    <component
      :is="content.component || content"
      v-else
      v-bind="content.props"
      v-on="content.listeners"
    />
    <CloseButton @click.stop="closeToast" />
    <ProgressBar
      v-if="timeout"
      :is-running="isRunning"
      :hide="hideProgressBar"
      :timeout="timeout"
      @closeToast="timeoutHandler"
    />
  </div>
</template>

<script>
import ProgressBar from "./ProgressBar";
import CloseButton from "./CloseButton";
import events from "../js/events";
import Draggable from "./Draggable";
import { EVENTS, VT_NAMESPACE, TYPE, POSITION } from "../js/constants";
import {
  removeElement,
  isVueComponent,
  isPositiveInt,
  isString,
  isIn
} from "../js/utils";

export default {
  components: {
    ProgressBar,
    CloseButton
  },
  mixins: [Draggable],
  inheritAttrs: false,
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: value => isIn(value, Object.values(TYPE))
    },
    position: {
      type: String,
      required: true,
      validator: value => isIn(value, Object.values(POSITION))
    },
    content: {
      type: [String, Object],
      required: true,
      validator: value => isVueComponent(value.component) || isString(value)
    },
    pauseOnHover: Boolean,
    pauseOnFocusLoss: Boolean,
    closeOnClick: Boolean,
    onClick: {
      type: Function,
      default: () => {}
    },
    timeout: {
      type: [Number, Boolean],
      required: true,
      validator: value => isPositiveInt(value) || value === false
    },
    hideProgressBar: Boolean,
    toastClassName: {
      type: [Array, String],
      required: true,
      validator: value => isString(value) || value.every(v => isString(v))
    },
    bodyClassName: {
      type: [Array, String],
      required: true,
      validator: value => isString(value) || value.every(v => isString(v))
    }
  },
  data() {
    return {
      isRunning: true,
      disableTransitions: false,
      VT_NAMESPACE
    };
  },
  computed: {
    classes() {
      const classes = [
        `${VT_NAMESPACE}__toast`,
        `${VT_NAMESPACE}__toast--${this.type}`,
        `${this.position}`,
        ...(Array.isArray(this.toastClassName)
          ? this.toastClassName
          : [this.toastClassName])
      ];
      if (this.disableTransitions) {
        classes.push("disable-transition");
      }
      return classes;
    },
    bodyClasses() {
      const classes = [
        `${VT_NAMESPACE}__body`,
        ...(Array.isArray(this.bodyClassName)
          ? this.bodyClassName
          : [this.bodyClassName])
      ];
      return classes;
    }
  },
  destroyed() {
    setTimeout(() => {
      removeElement(this.$el);
    }, 1000);
  },
  methods: {
    closeToast() {
      events.$emit(EVENTS.DISMISS, this.id);
    },
    clickHandler() {
      if (this.onClick) {
        this.onClick(this.closeToast);
      }
      if (this.closeOnClick) {
        if (!this.beingDragged || this.dragStart === this.dragPos.x) {
          this.closeToast();
        }
      }
    },
    timeoutHandler() {
      this.closeToast();
    },
    hoverPause() {
      if (this.pauseOnHover) {
        this.isRunning = false;
      }
    },
    hoverPlay() {
      if (this.pauseOnHover) {
        this.isRunning = true;
      }
    },
    focusPause() {
      if (this.pauseOnFocusLoss) {
        this.isRunning = false;
      }
    },
    focusPlay() {
      if (this.pauseOnFocusLoss) {
        this.isRunning = true;
      }
    }
  }
};
</script>
