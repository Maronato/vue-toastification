<template>
  <component :is="component" :class="iconClasses">{{
    customIconChildren
  }}</component>
</template>

<script lang="ts">
import Vue, { Component as VueComponent } from "vue";

import { RenderableToastContent } from "../types";
import { TYPE, VT_NAMESPACE } from "../ts/constants";
import {
  isNonEmptyString,
  isToastContent,
  getVueComponentFromObj,
  hasProp
} from "../ts/utils";
import PROPS from "../ts/propValidators";
import SuccessIcon from "./icons/VtSuccessIcon.vue";
import InfoIcon from "./icons/VtInfoIcon.vue";
import WarningIcon from "./icons/VtWarningIcon.vue";
import ErrorIcon from "./icons/VtErrorIcon.vue";

export default Vue.extend({
  props: PROPS.ICON,

  computed: {
    customIconChildren(): string {
      return hasProp(this.customIcon, "children")
        ? this.trimValue(this.customIcon.children)
        : "";
    },
    customIconClass(): string {
      if (typeof this.customIcon === "string") {
        return this.trimValue(this.customIcon);
      } else if (hasProp(this.customIcon, "class")) {
        return this.trimValue(this.customIcon.class);
      }
      return "";
    },
    customIconTag(): string {
      if (hasProp(this.customIcon, "tag")) {
        return this.trimValue(this.customIcon.tag, "i");
      }
      return "i";
    },
    hasCustomIcon(): boolean {
      return this.customIconClass.length > 0;
    },
    component(): RenderableToastContent {
      if (this.hasCustomIcon) {
        return this.customIconTag;
      }
      if (isToastContent(this.customIcon)) {
        return getVueComponentFromObj(this.customIcon);
      }
      return this.iconTypeComponent;
    },
    iconTypeComponent(): VueComponent {
      const types = {
        [TYPE.DEFAULT]: InfoIcon,
        [TYPE.INFO]: InfoIcon,
        [TYPE.SUCCESS]: SuccessIcon,
        [TYPE.ERROR]: ErrorIcon,
        [TYPE.WARNING]: WarningIcon
      };
      return types[this.type];
    },
    iconClasses(): string[] {
      const classes = [`${VT_NAMESPACE}__icon`];
      if (this.hasCustomIcon) {
        return classes.concat(this.customIconClass);
      }
      return classes;
    }
  },

  methods: {
    trimValue(value: unknown, empty = "") {
      return isNonEmptyString(value) ? value.trim() : empty;
    }
  }
});
</script>
