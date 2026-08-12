import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    open: false,
  },

  build: {
    outDir: 'build',   // firebase.json hosting target 이 build 를 본다
    sourcemap: false,
  },
});
