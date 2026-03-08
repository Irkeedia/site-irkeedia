import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        orion: resolve(__dirname, 'orion.html'),
        survivalCodex: resolve(__dirname, 'survival-codex.html'),
        nexusnas: resolve(__dirname, 'nexusnas.html'),
        sunoPlayer: resolve(__dirname, 'suno-player.html'),
        mentionsLegales: resolve(__dirname, 'mentions-legales.html'),
        serviceIaLocale: resolve(__dirname, 'service-ia-locale.html'),
        serviceRobotique: resolve(__dirname, 'service-robotique.html'),
        serviceLogicielsIa: resolve(__dirname, 'service-logiciels-ia.html'),
        serviceInfrastructure: resolve(__dirname, 'service-infrastructure.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
