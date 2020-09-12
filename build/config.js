import { terser } from "rollup-plugin-terser"

export default {
  umd: {
    output: "dist/umd/index.js",
    format: "umd",
    target: "es5",
    globals: {
      vue: "Vue",
    },
    env: "development",
  },
  umdMin: {
    output: "dist/umd/index.min.js",
    format: "umd",
    target: "es5",
    globals: {
      vue: "Vue",
    },
    plugins: {
      post: [
        terser({
          output: {
            comments: false,
          },
        }),
      ],
    },
    env: "production",
  },
  esm: {
    output: "dist/esm/index.js",
    format: "esm",
    target: "es2015",
    genDts: true,
  },
  cjs: {
    output: "dist/cjs/index.js",
    format: "cjs",
    target: "es2015",
  },
}
