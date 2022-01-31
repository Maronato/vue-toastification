<template>
  <img alt="Vue logo" src="./assets/logo.png" /><br />
  <button @click="showToast">Show toast</button>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { POSITION, TYPE, useToast } from "../../src"

const toast = useToast()

const getRandom = <T>(list: T[]) =>
  list[Math.floor((Math.random() * 10) % list.length)]

const randomType = () => getRandom(Object.values(TYPE))

const randomPosition = () => getRandom(Object.values(POSITION))

const randomMessage = () =>
  getRandom(["Hello", "I'm a toast!", "Oops!", "Hi :)"])

const showToast = () =>
  toast(randomMessage(), { type: randomType(), position: randomPosition() })
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
