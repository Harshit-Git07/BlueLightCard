import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    target: 'es2020',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
});
