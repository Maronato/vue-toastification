<template>
  <div class="t-container">
    <span>Update me!</span>
    <button class="action" @click.stop="clicked">CLICK ME</button>
  </div>
</template>
<script>
export default {
  props: {
    toastId: {
      type: Number,
      required: true
    }
  },
  methods: {
    clicked() {
      this.$toast.update(this.toastId, {
        content: "Updated!",
        options: { type: "success" }
      });
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
