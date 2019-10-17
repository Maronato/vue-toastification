module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/recommended", "@vue/prettier"],

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/array-bracket-spacing": "error",
    "vue/arrow-spacing": "error",
    "vue/block-spacing": "error",
    "vue/brace-style": "error",
    "vue/camelcase": "error",
    "vue/comma-dangle": "error",
    "vue/component-name-in-template-casing": "error",
    "vue/eqeqeq": "error",
    "vue/key-spacing": "error",
    "vue/match-component-file-name": "error",
    "vue/object-curly-spacing": "error",
    "vue/require-direct-export": "error",
    "vue/script-indent": "error",
    "vue/space-infix-ops": "error",
    "vue/space-unary-ops": "error",
    "vue/v-on-function-call": "error"
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true
      }
    }
  ]
};
