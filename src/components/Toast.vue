<template>
    <div
        @click="clickHandler"
        @mouseenter="hoverPause"
        @mouseleave="hoverPlay"
        @blur="focusPause"
        @focus="focusPlay"
        :class="classes"
        :style="draggableStyle"
    >
        <template v-if="typeof content === 'string'">{{ content }}</template>
        <component v-else :is="content" v-bind="contentProps" v-on="contentListeners" />
        <ProgressBar
            v-if="timeout"
            :is-running="isRunning"
            @closeToast="timeoutHandler"
            :hide="hideProgressBar"
            :timeout="timeout"
        />
    </div>
</template>

<script>
    import ProgressBar from "./ProgressBar";
    import events from "../js/events";
    import Draggable from "./Draggable";
    import { EVENTS } from "../js/constants";

    export default {
        inheritAttrs: false,
        mixins: [Draggable],
        components: {
            ProgressBar,
        },
        props: {
            id: {
                type: [String, Number],
                default: 0
            },
            type: String,
            position: String,
            content: [String, Object],
            contentProps: Object,
            contentListeners: Object,
            pauseOnHover: Boolean,
            pauseOnFocusLoss: Boolean,
            closeOnClick: Boolean,
            onClick: {
                type: Function,
                default: () => {}
            },
            timeout: [Number, Boolean],
            hideProgressBar: Boolean,
            transition: [String, Object]
        },
        data() {
            return {
                isRunning: true,
                disableTransitions: false
            };
        },
        computed: {
            exitTransition() {
                return this.enableExitTransition
                    ? `${this.transition}-leave-active`
                    : undefined;
            },
            classes() {
                const classes = [
                    'vue-toast',
                    this.type,
                    this.position
                ];
                if (this.disableTransitions) {
                    classes.push('disable-transition');
                }
                return classes;
            }
        },
        methods: {
            closeToast() {
                events.$emit(EVENTS.DISMISS, this.id);
            },
            clickHandler() {
                if (this.onClick) {
                    this.onClick(this.closeToast);
                }
                if (this.closeOnClick) {
                    if (!this.beingDragged || this.dragStart === this.dragPos.x) {
                        this.closeToast();
                    }
                }
            },
            timeoutHandler() {
                this.closeToast();
            },
            hoverPause() {
                if (this.pauseOnHover) {
                    this.isRunning = false;
                }
            },
            hoverPlay() {
                if (this.pauseOnHover) {
                    this.isRunning = true;
                }
            },
            focusPause() {
                if (this.pauseOnFocusLoss) {
                    this.isRunning = false;
                }
            },
            focusPlay() {
                if (this.pauseOnFocusLoss) {
                    this.isRunning = true;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .vue-toast.disable-transition {
        transition: none;
        animation: none;
    }
</style>

<style lang="scss">
    .vue-toasts {
        .vue-toast {
            display: inline-block;
            position: relative;
            max-height: 300px;
            min-height: 64px;
            box-sizing: border-box;
            margin-bottom: 1rem;
            padding: 22px 24px;
            border-radius: 8px;
            box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1),
                0 2px 15px 0 rgba(0, 0, 0, 0.05);
            justify-content: space-between;
            overflow: hidden;
            font-family: 'Lato', Helvetica, 'Roboto', Arial, sans-serif;
            cursor: pointer;
            direction: ltr;
            max-width: 500px;
            min-width: 326px;

            &.default {
                background-color: cyan;
            }
            &.info {
                background-color: lightblue;
            }
            &.success {
                background-color: green;
            }
            &.error {
                background-color: red;
            }
            &.warning {
                background-color: yellow;
            }

            @media only screen and (max-width: 480px) {
                border-radius: 0px;
                margin-bottom: 0.5rem;
            }
        }
    }
</style>
