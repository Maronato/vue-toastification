<template>
    <div class="vue-toasts">
        <div
            v-for="position in positions"
            :class="`vue-toast-container ${position}`"
            :key="position"
        >
        <Transition tag="div" group>
            <Toast
                v-for="toast in getPositionToasts(position)"
                v-bind="toast"
                :key="toast.id"
            />
        </Transition>
        </div>
    </div>
</template>

<script>
    import Toast from "./Toast";
    import events from "../js/events";
    import { EVENTS, POSITION } from "../js/constants";
    import Transition from './transitions/BounceTransition';

    export default {
        components: {
            Toast,
            Transition
        },
        props: {
            contentProps: Object,
            contentListeners: Object,

            position: String,
            type: String,
            newestOnTop: Boolean,
            maxToasts: Number,
            transition: String,

            draggable: Boolean,
            draggablePercent: Number,

            pauseOnFocusLoss: Boolean,
            pauseOnHover: Boolean,

            closeOnClick: Boolean,
            onClick: Function,
            onClose: Function,

            timeout: [Number, Boolean],
            hideProgressBar: Boolean,
        },
        data() {
            return {
                parent: null,
                count: 0,
                positions: Object.values(POSITION),
                toasts: {}
            };
        },
        beforeMount() {
            this.setup();
        },
        mounted() {
            events.$on(EVENTS.ADD, this.addToast);
            events.$on(EVENTS.CLEAR, this.clearToasts);
            events.$on(EVENTS.DISMISS, this.dismissToast);
        },
        computed: {
            defaultParams() {
                return {
                    ...this.$props
                };
            }
        },
        methods: {
            setup() {
                const container = this.container || document.body;
                container.appendChild(this.$el);
            },
            addToast(params) {
                const props = Object.assign({}, this.defaultParams, params);
                this.$set(this.toasts, props.id, props);
            },
            dismissToast(id) {
                if (this.toasts[id].onClose) {
                    this.toasts[id].onClose();
                }
                this.$delete(this.toasts, id);
            },
            clearToasts() {
                Object.keys(this.toasts).forEach(id => this.dismissToast(id));
            },
            getPositionToasts(position) {
                const toasts = Object.values(this.toasts).filter(
                    toast => toast.position === position
                ).slice(0, this.maxToasts);
                return this.newestOnTop ? toasts.reverse() : toasts;
            }
        }
    };
</script>

<style>
</style>

<style lang="scss">
    .vue-toasts {
        .vue-toast-container {
            z-index: 5000;
            -webkit-transform: translate3d(0, 0, 5000px);
            position: fixed;
            padding: 4px;
            width: 500px;
            box-sizing: border-box;
            display: flex;
            height: 100%;
            color: #fff;
            flex-direction: column;
            pointer-events: none;
            .vue-toast {
                pointer-events:auto;
            }
            @media only screen and (min-width: 480px) {
                &.top-left,
                &.top-right,
                &.top-center {
                    top: 1em;
                }

                &.bottom-left,
                &.bottom-right,
                &.bottom-center {
                    bottom: 1em;
                    flex-direction: column-reverse;
                }

                &.top-left,
                &.bottom-left {
                    left: 1em;
                    .vue-toast {
                        float: left;
                    }
                }

                &.top-right,
                &.bottom-right {
                    right: 1em;
                    .vue-toast {
                        float: right;
                    }
                }

                &.top-center,
                &.bottom-center {
                    left: 50%;
                    margin-left: calc(-500px / 2);
                    .vue-toast {
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
            }

            @media only screen and (max-width: 480px) {
                width: 100vw;
                padding: 0;
                left: 0;
                margin: 0;
                &.top-left,
                &.top-right,
                &.top-center {
                    top: 0;
                }
                &.bottom-left,
                &.bottom-right,
                &.bottom-center {
                    bottom: 0;
                }
            }
        }
    }
</style>

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
            animation: bounceInLeft 750ms;
        }
        &.top-right,
        &.bottom-right {
            animation: bounceInRight 750ms;
        }
        &.top-center {
            animation: bounceInDown 750ms;
        }
        &.bottom-center {
            animation: bounceInUp 750ms;
        }
    }

    .bounce-leave-active {
        &.top-left,
        &.bottom-left {
            animation: bounceOutLeft 750ms;
        }
        &.top-right,
        &.bottom-right {
            animation: bounceOutRight 750ms;
        }
        &.top-center {
            animation: bounceOutUp 750ms;
        }
        &.bottom-center {
            animation: bounceOutDown 750ms;
        }
    }

    .bounce-leave {
        position: absolute;
    }

    .bounce-move {
        transition-timing-function: ease-in-out;
        transition-property: all;
        transition-duration: 600ms;
    }
</style>
