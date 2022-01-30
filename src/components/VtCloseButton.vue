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
import { computed, defineComponent } from "vue"

import { VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"
import { getVueComponentFromObj } from "../ts/utils"

export default defineComponent({
  name: "VtCloseButton",

  props: PROPS.CLOSE_BUTTON,

  setup(props) {
    const buttonComponent = computed(() => {
      if (props.component !== false) {
        return getVueComponentFromObj(props.component)
      }
      return "button"
    })
    const classes = computed(() => {
      const classes = [`${VT_NAMESPACE}__close-button`]
      if (props.showOnHover) {
        classes.push("show-on-hover")
      }
      return classes.concat(props.classNames)
    })
    return {
      buttonComponent,
      classes,
    }
  },
})
</script>
