<template>
  <div @click="click">aaaa {{ value }}</div>
</template>

<script>
export default {
    props: {
        value: Number,
    },
    methods: {
        click() {
            this.$emit('input', this.value * 2)
        }
    },
}
</script>

<style>

</style>
