const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      USER_EMAIL: 'test.feihub@example.com',     // Mis à jour pour correspondre à .env.test
      USER_PASSWORD: 'TestFeiHub123!'            // Mis à jour pour correspondre à .env.test
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000
  }
}) 