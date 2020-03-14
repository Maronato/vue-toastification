<template>
  <component :is="component" :class="iconClasses">
    {{ customIconChildren }}
  </component>
</template>

<script lang="ts">
import Vue, { Component as VueComponent } from "vue";
import Component from "vue-class-component";

import { TYPE, VT_NAMESPACE } from "../ts/constants";
import {
  isNonEmptyString,
  isVueComponent,
  getVueComponentFromObj
} from "../ts/utils";
import PROPS from "../ts/propValidators";
import SuccessIcon from "./icons/SuccessIcon.vue";
import InfoIcon from "./icons/InfoIcon.vue";
import WarningIcon from "./icons/WarningIcon.vue";
import ErrorIcon from "./icons/ErrorIcon.vue";

const IconProps = Vue.extend({
  props: PROPS.ICON
});

@Component
export default class Icon extends IconProps {
  get customIconChildren() {
    return typeof this.customIcon === "object" && "children" in this.customIcon
      ? this.trimValue(this.customIcon.children)
      : "";
  }
  get customIconClass() {
    if (typeof this.customIcon === "string") {
      return this.trimValue(this.customIcon);
    } else if (
      typeof this.customIcon === "object" &&
      "class" in this.customIcon
    ) {
      return this.trimValue(this.customIcon.class);
    }
    return "";
  }
  get customIconTag() {
    if (typeof this.customIcon === "object" && "tag" in this.customIcon) {
      this.trimValue(this.customIcon.tag, "i");
    }
    return "i";
  }
  get hasCustomIcon() {
    return this.customIconClass.length > 0;
  }
  get component() {
    if (this.hasCustomIcon) {
      return this.customIconTag;
    }
    if (isVueComponent(this.customIcon)) {
      return getVueComponentFromObj(this.customIcon);
    }
    return this.iconTypeComponent;
  }
  get iconTypeComponent(): VueComponent {
    const types = {
      [TYPE.DEFAULT]: InfoIcon,
      [TYPE.INFO]: InfoIcon,
      [TYPE.SUCCESS]: SuccessIcon,
      [TYPE.ERROR]: ErrorIcon,
      [TYPE.WARNING]: WarningIcon
    };
    return types[this.type];
  }
  get iconClasses() {
    const classes = [`${VT_NAMESPACE}__icon`];
    if (this.hasCustomIcon) {
      return classes.concat(this.customIconClass);
    }
    return classes;
  }

  trimValue(value: unknown, empty = ""): string {
    return isNonEmptyString(value) ? value.trim() : empty;
  }
}
</script>
