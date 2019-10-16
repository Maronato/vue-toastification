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
      <div :class="`${VT_NAMESPACE}__body`">{{ content }}</div>
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
import { EVENTS, VT_NAMESPACE } from "../js/constants";
import { removeElement } from "../js/utils";

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
      required: true
    },
    position: {
      type: String,
      required: true
    },
    content: {
      type: [String, Object],
      required: true
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
      required: true
    },
    hideProgressBar: Boolean
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
        `${this.position}`
      ];
      if (this.disableTransitions) {
        classes.push("disable-transition");
      }
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
