module.exports = {
  collectCoverageFrom: [
    'index.js',
    'lib/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageProvider: 'babel',
  coverageReporters: [
    'clover',
    'json',
    'lcov',
    'text-summary',
    'text'
  ],
  coverageThreshold: {
    global: {
      branches: 0, // TODO: improve branch coverage
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  globals: {},
  moduleDirectories: [
    'node_modules'
  ],
  moduleFileExtensions: [
    'js'
  ],
  rootDir: __dirname,
  silent: true,
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  testLocationInResults: true,
  testMatch: [
    '**/tests/**/?(*.)+(spec|test).js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true
}
