module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "jsx-a11y"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "@typescript-eslint/no-empty-function": ["off"],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "object",
          "type",
          "sibling",
          "index",
        ],
        warnOnUnassignedImports: true,
        pathGroups: [
          {
            pattern: "vue",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "**/*.{css,scss}",
            group: "index",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin", "vue", "**/*.{css,scss}"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/newline-after-import": "error",
    "import/no-unassigned-import": [
      "error",
      { allow: ["**/*.css", "**/*.scss", "**/*.sass"] },
    ],
    "import/no-named-default": "error",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
}
