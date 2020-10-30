import Plausible from "plausible-tracker";

export const { enableAutoPageviews, trackEvent } = Plausible({
  domain: "maronato.github.io/vue-toastification",
  apiHost: "https://plausible.maronato.dev",
});
