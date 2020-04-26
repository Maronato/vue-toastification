import { createToastInterface } from "vue-toastification";

export default function (ctx, inject) {
  const toast = createToastInterface(<%= serialize(options) %>);
  inject('toast', toast);
}
