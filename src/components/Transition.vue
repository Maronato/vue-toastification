<template>
  <transition-group
    tag="div"
    :enter-active-class="`${name}-enter-active`"
    :move-class="`${name}-move`"
    :leave-active-class="`${name}-leave-active`"
    @leave="leave"
  >
    <slot></slot>
  </transition-group>
</template>
<script>
export default {
  name: "Transition",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    leave(el, done) {
      this.setAbsolutePosition(el);
      this.$emit("leave", el, done);
    },
    setAbsolutePosition(el) {
      el.style.left = el.offsetLeft + "px";
      el.style.top = el.offsetTop + "px";
      el.style.position = "absolute";
      return this;
    }
  }
};
</script>
