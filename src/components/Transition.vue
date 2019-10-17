<template>
  <transition-group
    tag="div"
    :enter-active-class="`${name}-enter-active`"
    :move-class="`${name}-move`"
    :leave-active-class="`${name}-leave-active`"
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
export default {
  name: "Transition",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    },
    duration: {
      type: [Number, Object],
      default: 750
    }
  },
  methods: {
    beforeEnter(el) {
      const enterDuration = this.duration.enter
        ? this.duration.enter
        : this.duration;
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
      const leaveDuration = this.duration.leave
        ? this.duration.leave
        : this.duration;
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
