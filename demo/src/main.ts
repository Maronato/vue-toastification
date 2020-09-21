import { createApp } from "vue"
import Toast from "./vue-toastification"
import App from "./App.vue"
import "./index.css"

const app = createApp(App)

app.use(Toast)

app.mount("#app")
