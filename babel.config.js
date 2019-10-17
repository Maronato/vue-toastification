module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        forceAllTransforms: true,
        targets: {
          browsers: ["defaults", "not ie > 0", "not ie_mob > 0"]
        }
      }
    ]
  ],
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current"
            }
          }
        ]
      ]
    }
  }
};
