<template>
  <div :style="style" :class="cpClass" />
</template>

<script lang="ts">
import Vue from "vue";

import { VT_NAMESPACE } from "../ts/constants";
import PROPS from "../ts/propValidators";

export default Vue.extend({
  props: PROPS.PROGRESS_BAR,

  data() {
    return {
      hasClass: true,
    };
  },

  computed: {
    style(): {
      animationDuration: string;
      animationPlayState: string;
      opacity: number;
    } {
      return {
        animationDuration: `${this.timeout}ms`,
        animationPlayState: this.isRunning ? "running" : "paused",
        opacity: this.hideProgressBar ? 0 : 1,
      };
    },

    cpClass(): string {
      return this.hasClass ? `${VT_NAMESPACE}__progress-bar` : "";
    },
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
    },
  },

  watch: {
    timeout() {
      this.hasClass = false;
      this.$nextTick(() => (this.hasClass = true));
    },
  },
});
</script>
