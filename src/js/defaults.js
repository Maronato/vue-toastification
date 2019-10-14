import { TYPE, POSITION } from './constants'

export default {
    type: TYPE.DEFAULT,
    position: POSITION.TOP_RIGHT,
    newestOnTop: true,
    maxToasts: Infinity,

    transition: "bounce",

    draggable: true,
    draggablePercent: 0.6,

    pauseOnFocusLoss: true,
    pauseOnHover: true,

    closeOnClick: true,

    timeout: 5000,
    hideProgressBar: false
}
