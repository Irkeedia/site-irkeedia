import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        orion: resolve(__dirname, 'orion.html'),
        survivalCodex: resolve(__dirname, 'survival-codex.html'),
        nexusnas: resolve(__dirname, 'nexusnas.html'),
        sunoPlayer: resolve(__dirname, 'suno-player.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
