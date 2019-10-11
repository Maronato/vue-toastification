const Toast = {
    install(Vue, options) {
        if (!options) {
            options = {};
        }

        const Toast = console.log('works');
        Vue.component('toast', Toast);
        Vue.toasted = Vue.prototype.$toast = Toast;
    }
};

// register plugin if it is used via cdn or directly as a script tag
if (typeof window !== 'undefined' && window.Vue) {
    window.Toast = Toast;
}

export default Toast;
