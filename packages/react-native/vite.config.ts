import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      name: 'TronReactNativeProvider',
      formats: ['cjs', 'es', 'umd'],
    },
  },
  envPrefix: ["PAGE_HOOK"]
});
