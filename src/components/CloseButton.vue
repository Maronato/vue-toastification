<template>
  <button :class="`${VT_NAMESPACE}__close-button`" v-on="$listeners">✖</button>
</template>
<script>
import { VT_NAMESPACE } from "../js/constants";
export default {
  data() {
    return {
      VT_NAMESPACE
    };
  }
};
</script>
