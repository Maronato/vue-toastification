<template>
    <div :style="style" class="vue-toast-progress-bar" />
</template>

<script>
    export default {
        props: {
            timeout: {
                type: Number,
                default: 5000
            },
            hide: Boolean,
            isRunning: Boolean
        },
        mounted() {
            this.$el.addEventListener('animationend', this.animationEnded)
        },
        beforeDestroy() {
            this.$el.removeEventListener('animationend', this.animationEnded)
        },
        computed: {
            style() {
                return {
                    animationDuration: `${this.timeout}ms`,
                    animationPlayState: this.isRunning ? "running" : "paused",
                    opacity: this.hide ? 0 : 1
                };
            }
        },
        methods: {
            animationEnded() {
                this.$emit('closeToast')
            }
        },
    };
</script>

<style lang="scss">
    @keyframes scale-x-frames {
        0% {
            transform: scaleX(1);
        }
        100% {
            transform: scaleX(0);
        }
    }

    .vue-toasts .vue-toast-progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        z-index: 5000;
        background-color: rgba(255, 255, 255, 0.7);
        transform-origin: left;
        animation: scale-x-frames linear 1 forwards;
    }
</style>
