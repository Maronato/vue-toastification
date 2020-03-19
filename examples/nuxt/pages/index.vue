<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        nuxt-example
      </h1>
      <h2 class="subtitle">
        Nuxt with Vue Toastification
      </h2>
      <div class="links">
        <a href="#" @click="showToast" class="button--green">
          Show toast
        </a>
        <a
          href="https://github.com/Maronato/vue-toastification"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  },
  methods: {
    showToast() {
      this.$toast.success("I'm a toast!");
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
