<template>
  <div :style="style" :class="cpClass" />
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"

export default defineComponent({
  name: "VtProgressBar",

  props: PROPS.PROGRESS_BAR,

  // TODO: The typescript compiler is not playing nice with emit types
  // Rollback this change once ts is able to infer emit types
  // emits: ["close-toast"],

  data() {
    return {
      hasClass: true,
    }
  },

  computed: {
    style(): {
      animationDuration: string
      animationPlayState: string
      opacity: number
    } {
      return {
        animationDuration: `${this.timeout}ms`,
        animationPlayState: this.isRunning ? "running" : "paused",
        opacity: this.hideProgressBar ? 0 : 1,
      }
    },

    cpClass(): string {
      return this.hasClass ? `${VT_NAMESPACE}__progress-bar` : ""
    },
  },

  watch: {
    timeout() {
      this.hasClass = false
      this.$nextTick(() => (this.hasClass = true))
    },
  },

  mounted() {
    this.$el.addEventListener("animationend", this.animationEnded)
  },

  beforeUnmount() {
    this.$el.removeEventListener("animationend", this.animationEnded)
  },

  methods: {
    animationEnded() {
      // See TODO on line 16
      // eslint-disable-next-line vue/require-explicit-emits
      this.$emit("close-toast")
    },
  },
})
</script>
