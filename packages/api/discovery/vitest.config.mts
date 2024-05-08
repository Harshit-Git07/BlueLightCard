import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['./e2e/**/*.test.ts'],
  },
  esbuild: {
    target: 'es2020',
    include: /\.(m?[jt]s|[jt]sx)$/,
    exclude: [],
  },
});
