import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/umd.ts'),
      name: 'WysiwygEditor',
      formats: ['umd'],
      fileName: () => 'wysiwyg-editor.umd.js',
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
    cssCodeSplit: false,
  },
  define: { 'process.env.NODE_ENV': '"production"' },
});
