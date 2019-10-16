<template>
  <component
    :is="componentType"
    :tag="tag"
    enter-active-class="bounce-enter-active"
    move-class="bounce-move"
    leave-active-class="bounce-leave-active"
    @leave="leave"
  >
    <slot></slot>
  </component>
</template>
<script>
export default {
  name: "Transition",
  inheritAttrs: false,
  props: {
    group: Boolean,
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    componentType() {
      return this.group ? "transition-group" : "transition";
    }
  },
  methods: {
    leave(el, done) {
      this.setAbsolutePosition(el);
      this.$emit("leave", el, done);
    },
    setAbsolutePosition(el) {
      if (this.group) {
        el.style.left = el.offsetLeft + "px";
        el.style.top = el.offsetTop + "px";
        el.style.position = "absolute";
      }
      return this;
    }
  }
};
</script>
