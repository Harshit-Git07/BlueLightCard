const { join } = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, './tailwind.config.ts'),
    },
    autoprefixer: {},
    'postcss-remove-rules': {
      rulesToRemove: {
        'img,\nvideo': 'height',
      },
    },
  },
};
