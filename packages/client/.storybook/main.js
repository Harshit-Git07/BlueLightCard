const {
  resolve
} = require("path");
module.exports = {
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/preset-scss", "@storybook/addon-a11y", "@storybook/addon-mdx-gfm"],
  "framework": {
    name: "@storybook/nextjs",
    options: {}
  },
  staticDirs: [{
    from: '../assets',
    to: '/assets'
  }],
  webpackFinal: async config => {
    config.resolve.alias = {
      "@/components": resolve(__dirname, "../src/common/components"),
      "@/hooks": resolve(__dirname, "../src/common/hooks"),
      "@/utils": resolve(__dirname, "../src/common/utils"),
      "@/types": resolve(__dirname, "../src/common/types")
    };
    return config;
  },
  docs: {
    autodocs: true
  }
};