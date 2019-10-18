<template>
  <div class="t-container">
    <span>What about events?</span>
    <button class="action" @click.stop="clicked">SEND!</button>
  </div>
</template>
<script>
export default {
  methods: {
    clicked() {
      this.$emit("click");
    }
  }
};
</script>
<style>
.t-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.action {
  height: 40px;
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  border: thin solid currentColor;
}
</style>
