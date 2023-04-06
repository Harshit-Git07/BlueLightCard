const { resolve } = require("path");

module.exports = {
  "stories": [
    "../src/common/components/**/*.stories.mdx",
    "../src/common/components/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-scss",
    "@storybook/addon-a11y",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async(config) => {
    config.resolve.alias = {
      "@/components": resolve(__dirname, "../src/common/components"),
      "@/hooks": resolve(__dirname, "../src/common/hooks"),
      "@/utils": resolve(__dirname, "../src/common/utils"),
    };
    return config;
  },
}