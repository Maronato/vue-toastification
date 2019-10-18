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
    <Icon v-if="icon" :custom-icon="icon" :type="type" />
    <template v-if="typeof content === 'string'">
      <div :class="bodyClasses">{{ content }}</div>
    </template>
    <component
      :is="getVueComponentFromObj(content)"
      v-else
      v-bind="content.props"
      v-on="content.listeners"
      @close-toast="closeToast"
    />
    <CloseButton v-if="!hideCloseButton" @click.stop="closeToast" />
    <ProgressBar
      v-if="timeout"
      :is-running="isRunning"
      :hide="hideProgressBar"
      :timeout="timeout"
      @close-toast="timeoutHandler"
    />
  </div>
</template>

<script>
import ProgressBar from "./ProgressBar";
import CloseButton from "./CloseButton";
import Icon from "./Icon";
import events from "../js/events";
import Draggable from "./Draggable";
import { EVENTS, VT_NAMESPACE, TYPE, POSITION } from "../js/constants";
import {
  removeElement,
  isVueComponent,
  isPositiveInt,
  isString,
  isIn,
  getVueComponentFromObj
} from "../js/utils";

export default {
  components: {
    ProgressBar,
    CloseButton,
    Icon
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
      validator: value => isString(value) || isVueComponent(value)
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
    hideCloseButton: Boolean,
    toastClassName: {
      type: [Array, String],
      required: true,
      validator: value => isString(value) || value.every(v => isString(v))
    },
    bodyClassName: {
      type: [Array, String],
      required: true,
      validator: value => isString(value) || value.every(v => isString(v))
    },
    icon: {
      type: [String, Boolean],
      default: true
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
        `${VT_NAMESPACE}__toast-body`,
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
    getVueComponentFromObj,
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
