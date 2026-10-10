import { defineConfig } from 'vite';
import missingPlugin from './missing-vite-plugin.mjs';
export default defineConfig({plugins:[missingPlugin()]});
