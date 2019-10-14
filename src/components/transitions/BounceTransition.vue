<template>
    <component
        :is="componentType"
        :tag="tag"
        @leave="leave"
        enter-active-class="bounce-enter-active"
        move-class="bounce-move"
        leave-active-class="bounce-leave-active"
    >
        <slot></slot>
    </component>
</template>
<script>
    export default {
        name: "transition",
        inheritAttrs: false,
        props: {
            group: Boolean,
            tag: {
                type: String,
                default: "div"
            }
        },
        computed: {
            componentType() {
                return this.group ? "transition-group" : "transition";
            }
        },
        methods: {
            leave(el, done) {
                this.setAbsolutePosition(el);
                this.$emit("leave", el, done);
            },
            setAbsolutePosition(el) {
                if (this.group) {
                    el.style.left = el.offsetLeft + "px";
                    el.style.top = el.offsetTop + "px";
                    el.style.position = "absolute";
                }
                return this;
            }
        }
    };
</script>
<style lang="scss">
    $trans-cubic-bezier: cubic-bezier(0.215, 0.61, 0.355, 1);
    @mixin timing-function {
        animation-timing-function: $trans-cubic-bezier;
    }

    @keyframes bounceInRight {
        from,
        60%,
        75%,
        90%,
        to {
            @include timing-function;
        }
        from {
            opacity: 0;
            transform: translate3d(3000px, 0, 0);
        }
        60% {
            opacity: 1;
            transform: translate3d(-25px, 0, 0);
        }
        75% {
            transform: translate3d(10px, 0, 0);
        }
        90% {
            transform: translate3d(-5px, 0, 0);
        }
        to {
            transform: none;
        }
    }

    @keyframes bounceOutRight {
        40% {
            opacity: 1;
            transform: translate3d(-20px, 0, 0);
        }
        to {
            opacity: 0;
            transform: translate3d(1000px, 0, 0);
        }
    }

    @keyframes bounceInLeft {
        from,
        60%,
        75%,
        90%,
        to {
            @include timing-function;
        }
        0% {
            opacity: 0;
            transform: translate3d(-3000px, 0, 0);
        }
        60% {
            opacity: 1;
            transform: translate3d(25px, 0, 0);
        }
        75% {
            transform: translate3d(-10px, 0, 0);
        }
        90% {
            transform: translate3d(5px, 0, 0);
        }
        to {
            transform: none;
        }
    }

    @keyframes bounceOutLeft {
        20% {
            opacity: 1;
            transform: translate3d(20px, 0, 0);
        }
        to {
            opacity: 0;
            transform: translate3d(-2000px, 0, 0);
        }
    }

    @keyframes bounceInUp {
        from,
        60%,
        75%,
        90%,
        to {
            @include timing-function;
        }
        from {
            opacity: 0;
            transform: translate3d(0, 3000px, 0);
        }
        60% {
            opacity: 1;
            transform: translate3d(0, -20px, 0);
        }
        75% {
            transform: translate3d(0, 10px, 0);
        }
        90% {
            transform: translate3d(0, -5px, 0);
        }
        to {
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes bounceOutUp {
        20% {
            transform: translate3d(0, -10px, 0);
        }
        40%,
        45% {
            opacity: 1;
            transform: translate3d(0, 20px, 0);
        }
        to {
            opacity: 0;
            transform: translate3d(0, -2000px, 0);
        }
    }

    @keyframes bounceInDown {
        from,
        60%,
        75%,
        90%,
        to {
            @include timing-function;
        }
        0% {
            opacity: 0;
            transform: translate3d(0, -3000px, 0);
        }
        60% {
            opacity: 1;
            transform: translate3d(0, 25px, 0);
        }
        75% {
            transform: translate3d(0, -10px, 0);
        }
        90% {
            transform: translate3d(0, 5px, 0);
        }
        to {
            transform: none;
        }
    }

    @keyframes bounceOutDown {
        20% {
            transform: translate3d(0, 10px, 0);
        }
        40%,
        45% {
            opacity: 1;
            transform: translate3d(0, -20px, 0);
        }
        to {
            opacity: 0;
            transform: translate3d(0, 2000px, 0);
        }
    }

    @keyframes bounceOutDown {
        20% {
            transform: translate3d(0, 10px, 0);
        }
        40%,
        45% {
            opacity: 1;
            transform: translate3d(0, -20px, 0);
        }
        to {
            opacity: 0;
            transform: translate3d(0, 2000px, 0);
        }
    }

    .bounce-enter-active {
        &.top-left,
        &.bottom-left {
            animation: bounceInLeft 500ms forwards;
        }
        &.top-right,
        &.bottom-right {
            animation: bounceInRight 500ms forwards;
        }
        &.top-center {
            animation: bounceInDown 500ms forwards;
        }
        &.bottom-center {
            animation: bounceInUp 500ms forwards;
        }
    }

    .bounce-leave-active {
        &.top-left,
        &.bottom-left {
            animation: bounceOutLeft 500ms forwards;
        }
        &.top-right,
        &.bottom-right {
            animation: bounceOutRight 500ms forwards;
        }
        &.top-center {
            animation: bounceOutUp 500ms forwards;
        }
        &.bottom-center {
            animation: bounceOutDown 500ms forwards;
        }
    }

    .bounce-leave {
        position: absolute;
    }

    .bounce-move {
        transition-timing-function: ease-in-out;
        transition-property: all;
        transition-duration: 400ms;
    }
</style>
