<template>
  <div
    :id="adId"
    :data-ea-type="type"
    data-ea-publisher="maronato-github-iovue-toastification"
    data-ea-keywords="vue|frontend|design|javascript|typescript"
    @click="track()"
  />
</template>

<script>
import { trackEvent } from "../plausible";
export default {
  props: {
    adId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
  },
  methods: {
    track() {
      trackEvent("Ad click", {
        props: {
          placement: this.adId,
          type: this.type,
        },
      });
    },
  },
};
</script>
