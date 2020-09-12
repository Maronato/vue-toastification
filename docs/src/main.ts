import { createApp } from "vue"
import App from "./App.vue"
import Toast, { PluginOptions, POSITION } from "./vue-toastification"
import "./index.css"

const app = createApp(App)

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
}

app.use(Toast, options)

app.mount("#app")
