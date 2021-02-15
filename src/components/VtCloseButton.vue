<template>
  <component
    :is="buttonComponent"
    :aria-label="ariaLabel"
    :class="classes"
    v-bind="$attrs"
  >
    &times;
  </component>
</template>
<script lang="ts">
import { defineComponent } from "vue"

import { VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"
import { getVueComponentFromObj } from "../ts/utils"
import { RenderableToastContent } from "../types"

export default defineComponent({
  name: "VtCloseButton",

  props: PROPS.CLOSE_BUTTON,

  computed: {
    buttonComponent(): RenderableToastContent {
      if (this.component !== false) {
        return getVueComponentFromObj(this.component)
      }
      return "button"
    },
    classes(): string[] {
      const classes = [`${VT_NAMESPACE}__close-button`]
      if (this.showOnHover) {
        classes.push("show-on-hover")
      }
      return classes.concat(this.classNames)
    },
  },
})
</script>
