import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const commonConfig = defineConfig({
  plugins: [vue()],
})

const libConfig = defineConfig({
  ...commonConfig,
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VueToastification",
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
        // Use `index.css` for css
        assetFileNames: assetInfo => {
          if (assetInfo.name == "style.css") return "index.css"
          return assetInfo.name
        },
      },
    },
  },
})

const demoConfig = defineConfig({
  ...commonConfig,
  root: "./demo",
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "demo") {
    return { ...demoConfig }
  }
  return { ...libConfig }
})
