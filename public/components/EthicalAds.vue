<template>
  <div
    :id="adId"
    :data-ea-type="type"
    data-ea-publisher="maronato-github-iovue-toastification"
    data-ea-keywords="vue|frontend|design|javascript|typescript"
  />
</template>

<script>
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
};
</script>
