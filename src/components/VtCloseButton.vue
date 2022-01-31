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

<script lang="ts" setup>
import { computed } from "vue"

import { VT_NAMESPACE } from "../ts/constants"
import { TOAST_DEFAULTS } from "../ts/propValidators"
import { getVueComponentFromObj } from "../ts/utils"

import type { ClassNames, Button } from "../types/common"

interface CloseButtonProps {
  component?: Button
  classNames?: ClassNames
  showOnHover?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<CloseButtonProps>(), {
  component: TOAST_DEFAULTS.closeButton,
  classNames: TOAST_DEFAULTS.closeButtonClassName,
  ariaLabel: TOAST_DEFAULTS.accessibility()["closeButtonLabel"],
  showOnHover: TOAST_DEFAULTS.showCloseButtonOnHover,
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
