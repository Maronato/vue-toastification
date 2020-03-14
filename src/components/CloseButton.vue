<template>
  <component :is="buttonComponet" :class="classes" v-on="$listeners">
    ✖
  </component>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { VT_NAMESPACE } from "../ts/constants";
import PROPS from "../ts/propValidators";
import { getVueComponentFromObj, isVueComponent } from "../ts/utils";

const CloseButtonProps = Vue.extend({
  props: PROPS.CLOSE_BUTTON
});

@Component
export default class CloseButton extends CloseButtonProps {
  get buttonComponet() {
    if (isVueComponent(this.component)) {
      return getVueComponentFromObj(this.component);
    }
    return this.component;
  }

  get classes() {
    const classes = [`${VT_NAMESPACE}__close-button`];
    if (this.showOnHover) {
      classes.push("show-on-hover");
    }
    return classes.concat(this.classNames);
  }
}
</script>
