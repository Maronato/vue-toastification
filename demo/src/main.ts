import { createApp } from "vue"
import Toast from "./vue-toastification"
import TwToast from "./tailwind/TwVtToast.vue"
import App from "./App.vue"
import "./index.css"

const app = createApp(App)
const options = {
  rootToastComponent: TwToast,
  classNameExtension: "_tw",
}
app.use(Toast, options)

app.mount("#app")
