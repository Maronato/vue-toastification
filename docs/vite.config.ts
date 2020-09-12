import type { UserConfig } from "vite"

const config: UserConfig = {
  alias: {
    vue: "vue/dist/vue.esm-bundler.js",
  },
  optimizeDeps: {
    include: ["../src/index.ts"],
  },
}
export default config
