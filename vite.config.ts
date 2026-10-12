import {defineConfig} from 'vitest/config';
import path from 'node:path';
export default defineConfig({resolve: {alias: {'@': path.resolve(__dirname, 'src')}}, build: { outDir: 'dist' }, test: {environment: 'jsdom', maxWorkers: 1, minWorkers: 1, pool: 'forks'}});
