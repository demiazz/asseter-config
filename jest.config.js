module.exports = {
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testMatch: [
    "<rootDir>/tests/**/*.test.ts"
  ],
  moduleFileExtensions: ["ts", "js", "json", "node"]
};
