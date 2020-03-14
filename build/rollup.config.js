import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import vue from "rollup-plugin-vue";
import scss from "rollup-plugin-scss";
import filesize from "rollup-plugin-filesize";
import configs from "./config";

const externals = ["vue-property-decorator", "vue", "vue-class-component"];

const genTsPlugin = configOpts =>
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        target: configOpts.target,
        declaration: configOpts.genDts
      }
    }
  });

const genCommonJsPlugin = () => commonjs();

const genVuePlugin = () =>
  vue({
    css: false
  });

const genScssPlugin = () => scss({ output: "dist/index.css" });

const genFileSizePlugin = () => filesize();

const genPlugins = configOpts => {
  const plugins = [];
  if (configOpts.plugins && configOpts.plugins.pre) {
    plugins.push(...configOpts.plugins.pre);
  }

  plugins.push(genTsPlugin(configOpts));
  plugins.push(genCommonJsPlugin(configOpts));
  plugins.push(genScssPlugin(configOpts));
  plugins.push(genVuePlugin(configOpts));
  plugins.push(filesize(configOpts));

  if (configOpts.plugins && configOpts.plugins.post) {
    plugins.push(...configOpts.plugins.post);
  }
  return plugins;
};

const genConfig = configOpts => ({
  input: "src/index.ts",
  output: {
    file: configOpts.output,
    format: configOpts.format,
    name: "VueToastification",
    sourcemap: true,
    exports: "named",
    globals: configOpts.globals
  },
  external: externals,
  plugins: genPlugins(configOpts)
});

const genAllConfigs = configs =>
  Object.keys(configs).map(key => genConfig(configs[key]));

export default genAllConfigs(configs);
