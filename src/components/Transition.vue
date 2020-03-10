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
<script>
// Transition methods taken from https://github.com/BinarCode/vue2-transitions
import PROPS from "../js/propValidators";

export default {
  name: "Transition",
  inheritAttrs: false,
  props: PROPS.TRANSITION,
  methods: {
    beforeEnter(el) {
      const enterDuration = this.transitionDuration.enter
        ? this.transitionDuration.enter
        : this.transitionDuration;
      el.style.animationDuration = `${enterDuration}ms`;
      el.style.animationFillMode = "both";
      this.$emit("before-enter", el);
    },
    afterEnter(el) {
      this.cleanUpStyles(el);
      this.$emit("after-enter", el);
    },
    afterLeave(el) {
      this.cleanUpStyles(el);
      this.$emit("after-leave", el);
    },
    beforeLeave(el) {
      const leaveDuration = this.transitionDuration.leave
        ? this.transitionDuration.leave
        : this.transitionDuration;
      el.style.animationDuration = `${leaveDuration}ms`;
      el.style.animationFillMode = "both";
      this.$emit("before-leave", el);
    },
    leave(el, done) {
      this.setAbsolutePosition(el);
      this.$emit("leave", el, done);
    },
    setAbsolutePosition(el) {
      el.style.left = el.offsetLeft + "px";
      el.style.top = el.offsetTop + "px";
      el.style.position = "absolute";
      return this;
    },
    cleanUpStyles(el) {
      el.style.animationFillMode = "";
      el.style.animationDuration = "";
    }
  }
};
</script>
