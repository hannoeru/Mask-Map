import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    dedupe: ['vue', 'leaflet']
  },
  // Vue CLI exposed VUE_APP_* to the client. Keep that prefix so the
  // existing VUE_APP_MASK_API value is still inlined at build time.
  envPrefix: 'VUE_APP_',
  build: {
    outDir: 'dist'
  }
})
