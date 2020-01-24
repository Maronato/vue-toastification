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
    <div :class="bodyClasses">
      <template v-if="typeof content === 'string'">
        {{ content }}
      </template>
      <component
        :is="getVueComponentFromObj(content)"
        v-else
        :toast-id="id"
        v-bind="content.props"
        v-on="content.listeners"
        @close-toast="closeToast"
      />
    </div>
    <CloseButton
      v-if="!hideCloseButton"
      :component="closeButton"
      :class-names="closeButtonClassName"
      @click.stop="closeToast"
    />
    <ProgressBar
      v-if="timeout"
      :is-running="isRunning"
      :hide-progress-bar="hideProgressBar"
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
import { EVENTS, VT_NAMESPACE } from "../js/constants";
import PROPS from "../js/propValidators";
import { removeElement, getVueComponentFromObj, isString } from "../js/utils";

export default {
  components: {
    ProgressBar,
    CloseButton,
    Icon
  },
  mixins: [Draggable],
  inheritAttrs: false,
  props: PROPS.TOAST,
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
        `${this.position}`
      ].concat(
        Array.isArray(this.toastClassName)
          ? this.toastClassName
          : [this.toastClassName]
      );
      if (this.disableTransitions) {
        classes.push("disable-transition");
      }
      return classes;
    },
    bodyClasses() {
      const classes = [
        `${VT_NAMESPACE}__toast-${
          isString(this.content) ? "body" : "component-body"
        }`
      ].concat(
        Array.isArray(this.bodyClassName)
          ? this.bodyClassName
          : [this.bodyClassName]
      );
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
