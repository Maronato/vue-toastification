<template>
  <component :is="buttonComponet" :class="classes" v-on="$listeners"
    >✖
  </component>
</template>
<script>
import { VT_NAMESPACE } from "../js/constants";
import PROPS from "../js/propValidators";
import { getVueComponentFromObj, isVueComponent } from "../js/utils";
export default {
  props: PROPS.CLOSE_BUTTON,
  data() {
    return {
      VT_NAMESPACE
    };
  },
  computed: {
    buttonComponet() {
      if (isVueComponent(this.component)) {
        return getVueComponentFromObj(this.component);
      }
      return this.component;
    },
    classes() {
      const classes = [`${VT_NAMESPACE}__close-button`];
      if (this.classNames) {
        return classes.concat(this.classNames);
      }
      return classes;
    }
  }
};
</script>
