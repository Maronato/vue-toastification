import * as esbuild from "esbuild"
import { sassPlugin } from "esbuild-sass-plugin"
import vuePlugin from "esbuild-plugin-vue"

build("cjs")
build("esm")
build("iife")
build("iife", true)

async function build(format, minify = false) {
  const withMin = ext => (minify ? `.min.${ext}` : `.${ext}`)
  const extMap = {
    cjs: withMin("cjs"),
    esm: withMin("mjs"),
    iife: `.iife${withMin("js")}`,
  }
  const ext = extMap[format]

  const result = await esbuild.build({
    format,
    minify,
    bundle: true,
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    external: ["vue"],
    metafile: true,
    plugins: [sassPlugin(), vuePlugin()],
    outExtension: {
      ".js": ext,
    },
    target: ["es2017"],
  })

  const report = await esbuild.analyzeMetafile(result.metafile || "")
  console.log(report)
}
