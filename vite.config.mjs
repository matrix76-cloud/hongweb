import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reviewNotes from './vite-plugin-review-notes.mjs';

export default defineConfig({
  plugins: [react(), reviewNotes()],

  server: {
    port: 3001,
    strictPort: true,
    open: false,
  },

  build: {
    outDir: 'build',   // firebase.json hosting target 이 build 를 본다
    sourcemap: false,
  },
});
