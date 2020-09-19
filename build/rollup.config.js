import { DEFAULT_EXTENSIONS } from "@babel/core"
import typescript from "rollup-plugin-typescript2"
import vue from "rollup-plugin-vue"
import sass from "rollup-plugin-sass"
import filesize from "rollup-plugin-filesize"
import babel from "@rollup/plugin-babel"
import configs from "./config"

const externals = ["vue"]

const genTsPlugin = configOpts =>
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        target: configOpts.target,
        declaration: configOpts.genDts,
      },
    },
  })

const genBabelPlugin = () =>
  babel({
    babelHelpers: "bundled",
    extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx", ".vue"],
  })

const genVuePlugin = () =>
  vue({
    css: false,
  })

const genScssPlugin = () => sass({ output: "dist/index.css" })

const genFileSizePlugin = () => filesize()

const genPlugins = configOpts => {
  const plugins = []
  if (configOpts.plugins && configOpts.plugins.pre) {
    plugins.push(...configOpts.plugins.pre)
  }

  plugins.push(genTsPlugin(configOpts))
  plugins.push(genScssPlugin(configOpts))
  plugins.push(genVuePlugin(configOpts))
  plugins.push(genBabelPlugin(configOpts))
  plugins.push(genFileSizePlugin(configOpts))

  if (configOpts.plugins && configOpts.plugins.post) {
    plugins.push(...configOpts.plugins.post)
  }
  return plugins
}

const genConfig = configOpts => ({
  input: "src/index.ts",
  output: {
    file: configOpts.output,
    format: configOpts.format,
    name: "VueToastification",
    sourcemap: true,
    exports: "named",
    globals: configOpts.globals,
  },
  external: externals,
  plugins: genPlugins(configOpts),
})

const genAllConfigs = configs =>
  Object.keys(configs).map(key => genConfig(configs[key]))

export default genAllConfigs(configs)
