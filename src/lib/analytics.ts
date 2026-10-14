const GA_ID = 'UA-55184798-7'

export function installAnalytics() {
  if (typeof window === 'undefined' || window.ga)
    return

  const ga: NonNullable<Window['ga']> = (...args) => {
    ga.q = ga.q || []
    ga.q.push(args)
  }
  ga.l = Date.now()
  window.ga = ga
  ga('create', GA_ID, 'auto')
  ga('send', 'pageview')

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.google-analytics.com/analytics.js'
  document.head.appendChild(script)
}
