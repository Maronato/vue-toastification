<template>
  <div :style="style" :class="cpClass" />
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
