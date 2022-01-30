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
import { defineComponent, computed } from "vue"

export default defineComponent({
  name: "VtCloseButton",
})
</script>

<script lang="ts" setup>
import { PluginOptions } from ".."

import { VT_NAMESPACE } from "../ts/constants"
import { PLUGIN_DEFAULTS } from "../ts/propValidators"
import { getVueComponentFromObj } from "../ts/utils"
import { ClassNames } from "../types"

interface CloseButtonProps {
  component?: NonNullable<PluginOptions["closeButton"]>
  classNames?: ClassNames
  showOnHover?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<CloseButtonProps>(), {
  component: PLUGIN_DEFAULTS.closeButton,
  classNames: PLUGIN_DEFAULTS.closeButtonClassName,
  ariaLabel: PLUGIN_DEFAULTS.accessibility()["closeButtonLabel"],
  showOnHover: PLUGIN_DEFAULTS.showCloseButtonOnHover,
})

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
</script>
