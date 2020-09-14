<template>
  <h1>{{ msg }}</h1>
  <button @click="increment">count is: {{ count }}</button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script lang="ts">
import { ref } from "vue"
import { useToast } from "../vue-toastification"

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

    const toast = useToast()

    const increment = () => {
      count.value += 1
      toast.info(
        "hey dsa dsadsa d asf ds a ag fdsg df gsdf gs fdg sdf g sd fg sdf gsdf g fdg sdf gsd fg df gdf g dfg df gdf g dfg sdf g fdg df gdf g g "
      )
    }

    return { count, increment }
  },
}
</script>
