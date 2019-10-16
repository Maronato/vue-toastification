<template>
  <button class="vue-toast__close-button" v-on="$listeners">✖</button>
</template>

<style lang="scss" scoped>
.vue-toast__close-button {
  font-weight: bold;
  font-size: 16px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  padding-left: 10px;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  align-items: center;
  color: #fff;
  opacity: 0.3;
  &:hover,
  &:focus {
    opacity: 1;
  }
}
</style>
