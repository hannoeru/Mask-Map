import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  // Keep the Vue CLI env name so VUE_APP_MASK_API is still inlined.
  envPrefix: 'VUE_APP_',
  build: {
    outDir: 'dist',
  },
})
