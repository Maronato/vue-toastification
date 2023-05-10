import Plausible from "plausible-tracker";

export const {
  enableAutoPageviews,
  trackEvent,
  enableAutoOutboundTracking,
} = Plausible({
  domain: "vue-toastification.maronato.dev",
  apiHost: "https://stats.maronato.dev",
});
