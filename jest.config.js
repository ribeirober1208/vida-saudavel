module.exports = {
  testEnvironment: "jsdom",
  verbose: true,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
};
