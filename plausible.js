import Plausible from "plausible-tracker";

export const {
  enableAutoPageviews,
  trackEvent,
  enableAutoOutboundTracking,
} = Plausible({
  domain: "maronato.github.io/vue-toastification",
  apiHost: "https://plausible.maronato.dev",
});
