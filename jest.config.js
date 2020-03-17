module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  snapshotSerializers: ["jest-serializer-vue"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
