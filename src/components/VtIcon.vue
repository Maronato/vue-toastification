<template>
  <component :is="component" :class="iconClasses">{{
    customIconChildren
  }}</component>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { TYPE, VT_NAMESPACE } from "../ts/constants"
import { TOAST_DEFAULTS } from "../ts/propValidators"
import {
  isNonEmptyString,
  isToastContent,
  hasProp,
  isString,
  getVueComponentFromObj,
} from "../ts/utils"

import type { Icon } from "../types/common"

import ErrorIcon from "./icons/VtErrorIcon.vue"
import InfoIcon from "./icons/VtInfoIcon.vue"
import SuccessIcon from "./icons/VtSuccessIcon.vue"
import WarningIcon from "./icons/VtWarningIcon.vue"

interface IconProps {
  type?: TYPE
  customIcon?: Icon
}

const props = withDefaults(defineProps<IconProps>(), {
  customIcon: TOAST_DEFAULTS.icon,
  type: TYPE.DEFAULT,
})

const trimValue = (value: unknown, empty = "") => {
  return isNonEmptyString(value) ? value.trim() : empty
}
const customIconChildren = computed(() => {
  return hasProp(props.customIcon, "iconChildren")
    ? trimValue(props.customIcon.iconChildren)
    : ""
})
const customIconClass = computed(() => {
  if (isString(props.customIcon)) {
    return trimValue(props.customIcon)
  } else if (hasProp(props.customIcon, "iconClass")) {
    return trimValue(props.customIcon.iconClass)
  }
  return ""
})
const customIconTag = computed(() => {
  if (hasProp(props.customIcon, "iconTag")) {
    return trimValue(props.customIcon.iconTag, "i")
  }
  return "i"
})
const hasCustomIcon = computed(() => {
  return customIconClass.value.length > 0
})
const component = computed(() => {
  if (hasCustomIcon.value) {
    return customIconTag.value
  }
  if (isToastContent(props.customIcon)) {
    return getVueComponentFromObj(props.customIcon)
  }
  return iconTypeComponent.value
})
const iconTypeComponent = computed(() => {
  const types = {
    [TYPE.DEFAULT]: InfoIcon,
    [TYPE.INFO]: InfoIcon,
    [TYPE.SUCCESS]: SuccessIcon,
    [TYPE.ERROR]: ErrorIcon,
    [TYPE.WARNING]: WarningIcon,
  }
  return types[props.type]
})
const iconClasses = computed(() => {
  const classes = [`${VT_NAMESPACE}__icon`]
  if (hasCustomIcon.value) {
    return classes.concat(customIconClass.value)
  }
  return classes
})
</script>
