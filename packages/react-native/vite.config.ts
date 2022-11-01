import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'tron-provider-core',
      name: 'TronProviderCore',
      formats: ['cjs', 'es', 'umd'],
    },
  }
});
