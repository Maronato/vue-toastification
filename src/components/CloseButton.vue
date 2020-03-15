<template>
  <component :is="buttonComponet" :class="classes" v-on="$listeners">
    ✖
  </component>
</template>
<script lang="ts">
import Vue from "vue";

import { VT_NAMESPACE } from "../ts/constants";
import PROPS from "../ts/propValidators";
import { getVueComponentFromObj, isVueComponent } from "../ts/utils";
import { RenderableToastContent } from "../types";

export default Vue.extend({
  props: PROPS.CLOSE_BUTTON,

  computed: {
    buttonComponet(): RenderableToastContent {
      if (isVueComponent(this.component)) {
        return getVueComponentFromObj(this.component);
      }
      return this.component;
    },
    classes(): string[] {
      const classes = [`${VT_NAMESPACE}__close-button`];
      if (this.showOnHover) {
        classes.push("show-on-hover");
      }
      return classes.concat(this.classNames);
    }
  }
});
</script>
