<template>
    <div class="vue-toasts">
        <div
            v-for="position in positions"
            :class="`vue-toast-container ${position}`"
            :key="position"
        >
        <BounceTransition tag="div" group>
            <Toast
                v-for="toast in getPositionToasts(position)"
                v-bind="toast"
                :key="toast.id"
            />
        </BounceTransition>
        </div>
    </div>
</template>

<script>
    import Toast from "./Toast";
    import events from "../js/events";
    import { EVENTS, POSITION } from "../js/constants";
    import BounceTransition from './transitions/BounceTransition';

    export default {
        components: {
            Toast,
            BounceTransition
        },
        props: {
            position: {
                type: String,
                default: POSITION.TOP_RIGHT
            },
            newestOnTop: {
                type: Boolean,
                default: true
            },
            maxToasts: {
                type: Number,
                default: Infinity
            },
            transition: {
                type: String,
                default: ''
            },
            draggable: {
                type: Boolean,
                default: true
            },
            draggablePercent: {
                type: Number,
                default: 0.6
            },
            pauseOnFocusLoss: {
                type: Boolean,
                default: true
            },
            pauseOnHover: {
                type: Boolean,
                default: true
            },
            closeOnClick: {
                type: Boolean,
                default: false
            },
            timeout: {
                type: [Number, Boolean],
                default: 5000
            },
            container: {
                type: Object,
                default: document.body
            },
            hideProgressBar: Boolean,
        },
        data() {
            return {
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
        methods: {
            setup() {
                this.container.appendChild(this.$el);
            },
            addToast(params) {
                const props = Object.assign({}, this.$props, params);
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
