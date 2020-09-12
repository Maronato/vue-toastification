<template>
  <h1>{{ msg }}</h1>
  <button @click="increment">count is: {{ count }}</button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script lang="ts">
import { ref, inject } from "vue"
import { useToast, toastInjectionKey } from "../vue-toastification"

export default {
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup() {
    const count = ref(0)

    const toast = inject(toastInjectionKey)

    const increment = () => {
      count.value += 1
      toast?.success("hey")
    }

    return { count, increment }
  },
}
</script>
