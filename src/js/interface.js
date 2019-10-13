import ToastContainer from '../components/ToastContainer.vue';
import events from './events';
import { TYPE, EVENTS } from './constants';
import defaults from './defaults';
import { getId } from './utils';

const ToastInterface = (Vue, globalOptions = {}) => {
    const containerProps = { ...defaults, ...globalOptions }

    new (Vue.extend(ToastContainer))({
        el: document.createElement('div'),
        propsData: containerProps
    })
    const toast = (content, options) => {
        const props = { id: getId(), ...options, content }
        return events.$emit(EVENTS.ADD, props)
    }
    toast.clear = () => events.$emit(EVENTS.CLEAR)
    toast.dismiss = (id) => events.$emit(EVENTS.DISMISS, id)
    toast.success = (content, options) => toast(content, { ...options, type: TYPE.SUCCESS })
    toast.info = (content, options) => toast(content, { ...options, type: TYPE.INFO })
    toast.error = (content, options) => toast(content, { ...options, type: TYPE.ERROR })
    toast.warning = (content, options) => toast(content, { ...options, type: TYPE.WARNING })
    return toast
}
export default ToastInterface;
