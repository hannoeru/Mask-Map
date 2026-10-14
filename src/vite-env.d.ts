/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_MASK_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:uno.css'

declare module 'perfect-scrollbar' {
  export default class PerfectScrollbar {
    constructor(element: HTMLElement, options?: { minScrollbarLength?: number })
    update: () => void
    destroy: () => void
  }
}

interface Window {
  L: typeof import('leaflet').default
  ga?: {
    (...args: unknown[]): void
    q?: unknown[][]
    l?: number
  }
}
