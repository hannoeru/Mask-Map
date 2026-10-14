import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  // The original app has its own reset. Tailwind preflight changes
  // images, headings, and buttons enough to shift the layout.
  presets: [presetWind3({ preflight: false })],
})
