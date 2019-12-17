<template>
  <component :is="component" :class="iconClasses">{{
    customIconChildren
  }}</component>
</template>

<script>
import { TYPE, VT_NAMESPACE } from "../js/constants";
import { isNonEmptyString, isDefined } from "../js/utils";
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
      type: [String, Boolean, Object],
      required: true,
      validator: value =>
        value === false ||
        isNonEmptyString(value) ||
        ["class", "children", "tag"].every(
          v => !isDefined(v) || isNonEmptyString(v)
        )
    }
  },
  computed: {
    customIconChildren() {
      return this.trimValue(this.customIcon.children);
    },
    customIconClass() {
      return this.trimValue(
        this.customIcon,
        this.trimValue(this.customIcon.class)
      );
    },
    customIconTag() {
      return this.trimValue(this.customIcon.tag, "i");
    },
    hasCustomIcon() {
      return this.customIconClass.length > 0;
    },
    component() {
      if (this.hasCustomIcon) {
        return this.customIconTag;
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
        classes.push(this.customIconClass);
      }
      return classes;
    }
  },
  methods: {
    trimValue(value, empty = "") {
      return isNonEmptyString(value) ? value.trim() : empty;
    }
  }
};
</script>
