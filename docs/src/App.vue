<template>
  <div class="text-center">
    <img alt="Vue logo" src="./assets/logo.png" />
    <button @click="showToast">Show toast</button>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
import { useToast, provideToast } from "./vue-toastification"
import HelloWorld from "./components/HelloWorld.vue"

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  setup() {
    const toast = useToast()
    provideToast()

    return {
      toast,
    }
  },
  methods: {
    showToast() {
      this.toast("worked!")
    },
  },
}
</script>
