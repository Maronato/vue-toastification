<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Toast msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Toast from './components/Toast.vue'

export default {
  name: 'app',
  components: {
    Toast
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
