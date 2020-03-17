module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  snapshotSerializers: ["jest-serializer-vue"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: -100
    }
  }
};
