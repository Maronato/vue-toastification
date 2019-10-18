<template>
  <div class="t-container">
    <span>So easy!</span>
    <button class="action" @click.stop="clicked">CLICK ME</button>
  </div>
</template>
<script>
export default {
  methods: {
    clicked() {
      alert("Clicked!");
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
