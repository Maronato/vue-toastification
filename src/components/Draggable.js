/* eslint-disable no-console */
import { getX, getY } from "../js/utils";

export default {
    props: {
        draggable: Boolean,
        draggablePercent: {
            type: Number,
            default: 0.6
        }
    },
    data() {
        return {
            beingDragged: false,
            dragStart: 0,
            dragEnded: false,
            dragPos: {},
            dragRect: {},
        };
    },
    computed: {
        draggableStyle() {
            if (this.isRunning) {
                return {}
            }
            if (this.beingDragged) {
                return {
                    transform: `translateX(${this.dragDelta}px)`,
                    opacity: 1 - Math.abs(this.dragDelta / this.removalDistance),
                };
            }
            return {
                transition: "transform 0.2s, opacity 0.2s",
                transform: "translateX(0)",
                opacity: 1
            };
        },
        dragDelta() {
            return this.beingDragged ? this.dragPos.x - this.dragStart : 0;
        },
        removalDistance() {
            return (this.dragRect.right - this.dragRect.left) * this.draggablePercent
        }
    },
    mounted() {
        if (this.draggable) {
            this.draggableSetup();
        }
    },
    beforeDestroy() {
        if (this.draggable) {
            this.draggableCleanup();
        }
    },
    methods: {
        draggableSetup() {
            this.$el.addEventListener("touchstart", this.onDragStart);
            this.$el.addEventListener("mousedown", this.onDragStart);
            addEventListener("touchmove", this.onDragMove);
            addEventListener("mousemove", this.onDragMove);
            addEventListener("touchend", this.onDragEnd);
            addEventListener("mouseup", this.onDragEnd);
        },
        draggableCleanup() {
            this.$el.removeEventListener("touchstart", this.onDragStart);
            this.$el.removeEventListener("mousedown", this.onDragStart);
            removeEventListener("touchmove", this.onDragMove);
            removeEventListener("mousemove", this.onDragMove);
            removeEventListener("touchend", this.onDragEnd);
            removeEventListener("mouseup", this.onDragEnd);
        },

        onDragStart(event) {
            this.beingDragged = true;
            this.dragPos = { x: getX(event), y: getY(event) };
            this.dragStart = getX(event);
            this.dragRect = this.$el.getBoundingClientRect();
        },
        onDragMove(event) {
            if (this.beingDragged) {

                if (this.isRunning) {
                    this.isRunning = false;
                }
                this.dragPos = { x: getX(event), y: getY(event) };
            }
        },
        onDragEnd() {
            if (this.beingDragged) {
                if (Math.abs(this.dragDelta) >= Math.abs(this.removalDistance)) {
                    this.closeToast()
                } else {
                    setTimeout(() => {
                        this.beingDragged = false;
                        if (
                            this.pauseOnHover &&
                            this.dragRect.bottom >= this.dragPos.y &&
                            this.dragPos.y >= this.dragRect.top &&
                            this.dragRect.left <= this.dragPos.x &&
                            this.dragPos.x <= this.dragRect.right
                        ) {

                            this.isRunning = false;
                        } else {
                            this.isRunning = true;
                        }
                    });
                }
            }
        }
    }
}
