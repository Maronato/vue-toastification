<template>
  <component :is="component" :class="iconClasses" />
</template>

<script>
import { TYPE, VT_NAMESPACE } from "../js/constants";
import { isString } from "../js/utils";
import SuccessIcon from "./icons/SuccessIcon";
import InfoIcon from "./icons/InfoIcon";
import WarningIcon from "./icons/WarningIcon";
import ErrorIcon from "./icons/ErrorIcon";
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    customIcon: {
      type: [String, Boolean],
      required: true
    }
  },
  computed: {
    trimmedCustomIcon() {
      return isString(this.customIcon) ? this.customIcon.trim() : "";
    },
    hasCustomIcon() {
      return this.trimmedCustomIcon.length > 0;
    },
    component() {
      if (this.hasCustomIcon) {
        return "i";
      }
      return this.iconTypeComponent;
    },
    iconTypeComponent() {
      const types = {
        [TYPE.DEFAULT]: InfoIcon,
        [TYPE.INFO]: InfoIcon,
        [TYPE.SUCCESS]: SuccessIcon,
        [TYPE.ERROR]: ErrorIcon,
        [TYPE.WARNING]: WarningIcon
      };
      return types[this.type];
    },
    iconClasses() {
      const classes = [`${VT_NAMESPACE}__icon`];
      if (this.hasCustomIcon) {
        classes.push(this.trimmedCustomIcon);
      }
      return classes;
    }
  }
};
</script>
