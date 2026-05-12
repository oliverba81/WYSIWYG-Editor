import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname, 'react-demo'),
  server: { port: 3001, open: true },
  plugins: [react()],
  resolve: {
    alias: {
      'wysiwyg-editor': path.resolve(__dirname, '../src/index.ts'),
    },
  },
});
