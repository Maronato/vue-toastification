<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld
      msg="Welcome to the Vue Toastification + Typescript + Composition API example"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

import { provideToast } from "vue-toastification/composition";
import "vue-toastification/dist/index.css";

import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld
  },
  setup() {
    provideToast({ maxToasts: 5 });
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
