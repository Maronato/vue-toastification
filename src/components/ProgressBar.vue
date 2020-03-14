<template>
  <div :style="style" :class="cpClass" />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";

import { VT_NAMESPACE } from "../ts/constants";
import PROPS from "../ts/propValidators";

const ProgressBarProps = Vue.extend({
  props: PROPS.PROGRESS_BAR
});

@Component
export default class ProgressBar extends ProgressBarProps {
  hasClass = true;

  get style() {
    return {
      animationDuration: `${this.timeout}ms`,
      animationPlayState: this.isRunning ? "running" : "paused",
      opacity: this.hideProgressBar ? 0 : 1
    };
  }

  get cpClass() {
    return this.hasClass ? `${VT_NAMESPACE}__progress-bar` : "";
  }

  mounted() {
    this.$el.addEventListener("animationend", this.animationEnded);
  }

  beforeDestroy() {
    this.$el.removeEventListener("animationend", this.animationEnded);
  }

  animationEnded() {
    this.$emit("close-toast");
  }

  @Watch("timeout")
  onTimeoutChange() {
    this.hasClass = false;
    this.$nextTick(() => (this.hasClass = true));
  }
}
</script>
