import ToastContainer from '../components/ToastContainer.vue';
import events from './events';
import { TYPE, EVENTS } from './constants';
import { getId } from './utils';

const ToastInterface = (Vue, globalOptions = {}) => {
    new (Vue.extend(ToastContainer))({
        el: document.createElement('div'),
        propsData: globalOptions
    })
    const toast = (content, options) => {
        const props = { id: getId(), type: TYPE.DEFAULT, ...options, content }
        events.$emit(EVENTS.ADD, props)
        return props.id;
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
