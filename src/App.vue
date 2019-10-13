<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" @click="click" />
    </div>
</template>

<script>
    export default {
        name: "app",
        data() {
            return {
                counter: 2,
            }
        },
        methods: {
            click() {
              // eslint-disable-next-line no-console
                console.log("clicking", { timeout: false });
                // eslint-disable-next-line no-console
                this.$toast("messagefsdfd fdsf ds", { timeout: 2000 });
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
