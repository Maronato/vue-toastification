<template>
  <div :style="style" :class="cpClass" />
</template>

<script>
import { VT_NAMESPACE } from "../js/constants";
import PROPS from "../js/propValidators";
export default {
  props: PROPS.PROGRESS_BAR,
  data() {
    return {
      hasClass: true
    };
  },
  computed: {
    style() {
      return {
        animationDuration: `${this.timeout}ms`,
        animationPlayState: this.isRunning ? "running" : "paused",
        opacity: this.hideProgressBar ? 0 : 1
      };
    },
    cpClass() {
      return this.hasClass ? `${VT_NAMESPACE}__progress-bar` : "";
    }
  },
  watch: {
    timeout() {
      this.hasClass = false;
      this.$nextTick(() => (this.hasClass = true));
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
