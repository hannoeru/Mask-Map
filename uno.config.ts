import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    fontFamily: {
      sans: '"Noto Sans TC", sans-serif',
    },
  },
  preflights: [
    {
      getCSS: () => `
        html, body, #app { height: 100%; }
        html, body { overflow: hidden; }
        body {
          margin: 0;
          font-family: "Noto Sans TC", sans-serif;
          font-style: italic;
        }
        button { outline: none; }
        p { margin: 0; }
        @keyframes mask-spin {
          to { transform: rotate(360deg); }
        }
      `,
    },
  ],
})
