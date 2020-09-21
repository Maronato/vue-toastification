<template>
  <div class="text-center m-64">
    <v-switch v-model="myData" name="switch">My switch</v-switch>
    <div class="my-4"></div>
    <v-radio v-model="choice" :choices="choices" name="myradio" />
    <div class="my-4"></div>
    <div class="w-1/2 ml-5">
      <v-slider v-model="slider" :range="[0, 100]" :disabled="disable" />
      <div class="my-4">
        <v-button @click="disable = !disable">Disable slider</v-button>
      </div>
    </div>
    <div class="my-4"></div>
    <v-input v-model="input" />
    <div class="my-4"></div>
    <div class="w-64"><v-select v-model="choice" :choices="choices" /></div>
    <div class="my-4"></div>
    <v-button @click="showToast">Show toast</v-button>
    <v-button @click="myData = true">set slider</v-button>
    <div class="my-4"></div>
    <v-code lang="vue"
      >{{ `

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
            const choices = ref([
              { text: "hey", value: "1" },
              { text: "oh", value: "2" },
            ])

            const choice = ref(choices.value[0])
            return { toast, myData, choices, choice, slider, input }
          },
          methods: {
            showToast() {
              this.toast.success("Worked!")
            },
          },
        }
      </script>
      ` }}
    </v-code>
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

    return { toast, myData, choices, choice, slider, input, disable }
  },
  methods: {
    showToast() {
      this.toast.success("Worked!")
    },
  },
}
</script>
