const GA_ID = 'UA-55184798-7'

export function installAnalytics() {
  if (typeof window === 'undefined' || window.ga) return
  window.ga = function ga() {
    ;(window.ga.q = window.ga.q || []).push(arguments)
  }
  window.ga.l = Date.now()
  window.ga('create', GA_ID, 'auto')
  window.ga('send', 'pageview')
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.google-analytics.com/analytics.js'
  document.head.appendChild(script)
}
