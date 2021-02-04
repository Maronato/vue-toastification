<template>
  <component :is="component" :class="iconClasses">{{
    customIconChildren
  }}</component>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { VtIcon } from "../vue-toastification"

export default defineComponent({
  name: "TwVtIcon",
  extends: VtIcon,
  created() {
    this.nsExtension = "_tw"
  },
})
</script>
