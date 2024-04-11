import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import nodeExtrernals from 'rollup-plugin-node-externals';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const extensions = ['.js', '.ts', '.tsx'];

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.tsx',
  output: {
    entryFileNames: '[name].js',
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src',
    format: 'esm',
  },
  plugins: [
    nodeExtrernals(),
    nodeResolve({
      extensions,
    }),
    typescript({
      declaration: true,
      declarationDir: './dist/types',
      emitDeclarationOnly: true,
      exclude: ['node_modules/**', '**/*.spec.ts'],
    }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'bundled',
      exclude: ['node_modules/**', '**/*.spec.ts'],
      presets: ['@babel/preset-typescript'],
    }),
    postcss({
      config: {
        path: './postcss.config.js',
      },
    }),
  ],
};

export default config;
