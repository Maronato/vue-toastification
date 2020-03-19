import Vue from 'vue'
import App from './App.vue'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

const options = {
  draggable: false
}

Vue.use(Toast, options);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
