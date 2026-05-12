import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.',
  server: { open: '/demo/index.html' },
  plugins: [
    react(),
    dts({
      include: [path.resolve(__dirname, 'src')],
      outDir: path.resolve(__dirname, 'dist'),
      insertTypesEntry: false,
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        react: path.resolve(__dirname, 'src/react.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) =>
        format === 'es' ? `${name}.js` : `${name}.cjs`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
    cssCodeSplit: false,
  },
});
