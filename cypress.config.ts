import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1980,
  viewportHeight: 1024,
  defaultCommandTimeout: 8000,
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    baseUrl: 'http://localhost:5173'
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});