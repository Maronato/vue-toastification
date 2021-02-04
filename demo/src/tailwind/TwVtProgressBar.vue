<template>
  <div
    :style="style"
    :class="cpClass"
    class="absolute w-full h-1 origin-left bg-white b-0 l-0 bg-opacity-70"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { VtProgressBar } from "../vue-toastification"

export default defineComponent({
  name: "TwVtProgressBar",
  extends: VtProgressBar,
  created() {
    this.nsExtension = "_tw"
  },
})
</script>

<style lang="scss">
.Vue-Toastification_tw__progress-bar {
  //  z-index: (1000);
  animation: scale-x-frames linear 1 forwards;
  .Vue-Toastification_tw__toast--rtl & {
    right: 0;
    left: unset;
    transform-origin: right;
  }
}
</style>
