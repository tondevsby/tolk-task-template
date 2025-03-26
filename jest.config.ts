export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  globalSetup: "./jest.setup.ts",
  globalTeardown: "./jest.teardown.ts",
};
