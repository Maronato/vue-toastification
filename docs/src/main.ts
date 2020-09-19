import { createApp } from "vue"
import App from "./App.vue"
import Toast, { PluginOptions } from "./vue-toastification"
import "./index.css"

const app = createApp(App)

const options: PluginOptions = {}
app.use(Toast, options)

app.mount("#app")
