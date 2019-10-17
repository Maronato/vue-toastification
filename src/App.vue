<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" @click="click" />
  </div>
</template>

<script>
import Icon from "./components/Icon";
export default {
  name: "App",
  data() {
    return {
      counter: 2
    };
  },
  methods: {
    click() {
      this.$toast("default");
      this.$toast(Icon, { position: "bottom-left" });
      const x = Icon;
      console.log(x);
      this.$toast.success("success", { position: "top-center" });
      this.$toast.info("info", { position: "top-left" });
      this.$toast.warning("success", { position: "bottom-center" });
      this.$toast.error(
        "success fd fds fds f a fsd fasdfdsfsdfhksdkfksd    fsahfjdshfksjdhf ksdjfhksjfdhsdkjhjf",
        { position: "bottom-right" }
      );
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
