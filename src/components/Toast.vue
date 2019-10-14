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
        <template v-if="typeof content === 'string'">
            <div class="vue-toast__body">
                {{ content }}
            </div>
        </template>
        <component v-else :is="content.component || content" v-bind="content.props" v-on="content.listeners" />
        <CloseButton @click.stop="closeToast" />
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
    import CloseButton from "./CloseButton";
    import events from "../js/events";
    import Draggable from "./Draggable";
    import { EVENTS } from "../js/constants";
    import { removeElement } from "../js/utils";

    export default {
        inheritAttrs: false,
        mixins: [Draggable],
        components: {
            ProgressBar,
            CloseButton
        },
        props: {
            id: {
                type: [String, Number],
                required: true
            },
            type: {
                type: String,
                required: true
            },
            position: {
                type: String,
                required: true
            },
            content: {
                type: [String, Object],
                required: true
            },
            pauseOnHover: Boolean,
            pauseOnFocusLoss: Boolean,
            closeOnClick: Boolean,
            onClick: {
                type: Function,
                default: () => {}
            },
            timeout: {
                type: [Number, Boolean],
                required: true
            },
            hideProgressBar: Boolean
        },
        data() {
            return {
                isRunning: true,
                disableTransitions: false
            };
        },
        computed: {
            classes() {
                const classes = ["vue-toast", this.type, this.position];
                if (this.disableTransitions) {
                    classes.push("disable-transition");
                }
                return classes;
            }
        },
        destroyed() {
            setTimeout(() => {
                removeElement(this.$el);
            }, 1000);
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
            display: flex;
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
            font-family: "Lato", Helvetica, "Roboto", Arial, sans-serif;
            max-width: 500px;
            min-width: 326px;

            &.default {
                background-color: #1976D2;
            }
            &.info {
                background-color: #2196F3;
            }
            &.success {
                background-color: #4CAF50;
            }
            &.error {
                background-color: #FF5252;
            }
            &.warning {
                background-color: #FFC107;
            }

            @media only screen and (max-width: 480px) {
                border-radius: 0px;
                margin-bottom: 0.5rem;
            }

            .vue-toast__body {
                flex: 1;
                line-height: 24px;
                font-size: 16px;
                word-break: break-word;
            }
        }
    }
</style>
