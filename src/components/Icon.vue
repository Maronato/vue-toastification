<template>
  <div>
    <h1>Aaaa</h1>
    <div>teste</div>
    <button @click="aaa">Test</button>
  </div>
</template>

<script>
export default {
  methods: {
    aaa() {
      this.$emit("click");
      this.$emit("close-toast");
    }
  }
};
</script>

<style></style>
