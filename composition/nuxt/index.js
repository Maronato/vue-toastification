const { useContext } = require("@nuxtjs/composition-api"); // eslint-disable-line @typescript-eslint/no-var-requires

const useToast = () => useContext().app.$toast;

module.exports = { useToast };
