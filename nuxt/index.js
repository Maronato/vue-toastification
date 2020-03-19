// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @type {import("@nuxt/types").Module<import("../src/types/index").NuxtModuleOptions>} */
const toastModule = function(moduleOptions) {
  /** @type {import("../src/types/index").NuxtModuleOptions} */
  const toastOptions = this.options.toast;
  const cssFile = path.resolve(__dirname, "../dist/index.css");
  const options = Object.assign({ cssFile }, toastOptions, moduleOptions);

  // Add the plugin
  this.addPlugin({
    src: path.resolve(__dirname, "plugin.js"),
    fileName: "toast.js",
    ssr: false,
    options
  });

  // Add the CSS file if cssFile is a valid string
  if (options.cssFile) {
    if (typeof this.options.css === undefined) {
      this.options.css = [];
    }
    if (Array.isArray(this.options.css)) {
      this.options.css.push(options.cssFile);
    }
  }
};

module.exports = toastModule;
module.exports.meta = require(path.resolve(__dirname, "../package.json"));
