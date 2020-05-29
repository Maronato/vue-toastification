<template>
  <transition-group
    tag="div"
    :enter-active-class="
      transition.enter ? transition.enter : `${transition}-enter-active`
    "
    :move-class="transition.move ? transition.move : `${transition}-move`"
    :leave-active-class="
      transition.leave ? transition.leave : `${transition}-leave-active`
    "
    @leave="leave"
    @before-enter="beforeEnter"
    @before-leave="beforeLeave"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition-group>
</template>
<script lang="ts">
// Transition methods taken from https://github.com/BinarCode/vue2-transitions
import Vue from "vue";

import PROPS from "../ts/propValidators";

export default Vue.extend({
  inheritAttrs: false,
  props: PROPS.TRANSITION,
  methods: {
    beforeEnter(el: HTMLElement) {
      const enterDuration =
        typeof this.transitionDuration === "number"
          ? this.transitionDuration
          : this.transitionDuration.enter;
      el.style.animationDuration = `${enterDuration}ms`;
      el.style.animationFillMode = "both";
      this.$emit("before-enter", el);
    },
    afterEnter(el: HTMLElement) {
      this.cleanUpStyles(el);
      this.$emit("after-enter", el);
    },
    afterLeave(el: HTMLElement) {
      this.cleanUpStyles(el);
      this.$emit("after-leave", el);
    },
    beforeLeave(el: HTMLElement) {
      const leaveDuration =
        typeof this.transitionDuration === "number"
          ? this.transitionDuration
          : this.transitionDuration.leave;
      el.style.animationDuration = `${leaveDuration}ms`;
      el.style.animationFillMode = "both";
      this.$emit("before-leave", el);
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    leave(el: HTMLElement, done: Function) {
      this.setAbsolutePosition(el);
      this.$emit("leave", el, done);
    },
    setAbsolutePosition(el: HTMLElement) {
      el.style.left = el.offsetLeft + "px";
      el.style.top = el.offsetTop + "px";
      el.style.width = getComputedStyle(el).width;
      el.style.height = getComputedStyle(el).height;
      el.style.position = "absolute";
    },
    cleanUpStyles(el: HTMLElement) {
      el.style.animationFillMode = "";
      el.style.animationDuration = "";
    },
  },
});
</script>
