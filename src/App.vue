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
                this.$toast("messagefsdfd fdsf ds fsdf sdfa dg fdg sdf g d gfd g  df g sdf g dfgfdgsdfgshfg h fg h gfhdfghfgdhhd fghgfdhgfhfg hdfgh", { timeout: false });
                this.$toast.info("message", { timeout: false });
                this.$toast.success("message", { timeout: false });
                this.$toast.error("message", { timeout: false });
                this.$toast.warning("message", { timeout: false });
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
