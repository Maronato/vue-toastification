<template>
  <div :style="style" :class="`${VT_NAMESPACE}__progress-bar`" />
</template>

<script>
import { VT_NAMESPACE } from "../js/constants";
export default {
  props: {
    timeout: {
      type: Number,
      required: true
    },
    hide: Boolean,
    isRunning: Boolean
  },
  data() {
    return {
      VT_NAMESPACE
    };
  },
  computed: {
    style() {
      return {
        animationDuration: `${this.timeout}ms`,
        animationPlayState: this.isRunning ? "running" : "paused",
        opacity: this.hide ? 0 : 1
      };
    }
  },
  mounted() {
    this.$el.addEventListener("animationend", this.animationEnded);
  },
  beforeDestroy() {
    this.$el.removeEventListener("animationend", this.animationEnded);
  },
  methods: {
    animationEnded() {
      this.$emit("close-toast");
    }
  }
};
</script>
