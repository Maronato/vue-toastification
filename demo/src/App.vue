<template>
  <div class="text-center m-64">
    <button @click="showToast">Show toast</button>
  </div>
</template>

<script lang="ts">
import { ref } from "vue"
import { useToast } from "./vue-toastification"
import HelloWorld from "./components/HelloWorld.vue"

import VRadio from "./components/ui/Radio/index"
import VSwitch from "./components/ui/Switch/index"
import VSlider from "./components/ui/Slider/index"
import VInput from "./components/ui/Input"
import VSelect from "./components/ui/Select"
import VButton from "./components/ui/Button"
import VCode from "./components/ui/Code"

export default {
  name: "App",
  components: {
    HelloWorld,
    VRadio,
    VSlider,
    VSwitch,
    VInput,
    VSelect,
    VButton,
    VCode,
  },
  setup() {
    const toast = useToast()

    const myData = ref(true)

    const slider = ref(0)

    const input = ref("hey")

    const disable = ref(false)

    const choices = ref([
      { text: "hey", value: "1" },
      { text: "oh", value: "2" },
    ])

    const choice = ref(choices.value[0])

    const showToast = () => toast.success("hey")

    return { toast, myData, choices, choice, slider, input, disable, showToast }
  },
}
</script>
