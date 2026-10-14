import type { Ref } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { easedScrollTop } from '@/lib/easedScroll'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const SCROLL_DURATION = 450

export function useMenuScroll(el: Ref<HTMLElement | null>) {
  const scrollTop = ref(0)
  let scrollbar: PerfectScrollbar | null = null
  let frame = 0

  function cancelScroll() {
    if (!frame)
      return
    cancelAnimationFrame(frame)
    frame = 0
  }

  function onScroll(event: Event) {
    scrollTop.value = (event.target as HTMLElement).scrollTop
  }

  function resetScroll() {
    const node = el.value
    if (!node)
      return
    cancelScroll()
    node.scrollTop = 0
    scrollTop.value = 0
    scrollbar?.update()
  }

  // perfect-scrollbar forces overflow:hidden, so scrollTo({ behavior: 'smooth' })
  // never moves the list. Assigning scrollTop does, and each assignment fires scroll.
  function scrollToTop(event?: Event) {
    event?.preventDefault()
    const node = el.value
    if (!node)
      return
    cancelScroll()
    const start = node.scrollTop
    const startedAt = performance.now()

    const step = (now: number) => {
      const current = el.value
      if (!current) {
        frame = 0
        return
      }
      const next = easedScrollTop(start, now - startedAt, SCROLL_DURATION)
      current.scrollTop = next
      if (next > 0) {
        frame = requestAnimationFrame(step)
        return
      }
      frame = 0
      current.scrollTop = 0
      scrollTop.value = 0
      scrollbar?.update()
    }

    frame = requestAnimationFrame(step)
  }

  function update() {
    scrollbar?.update()
  }

  onMounted(() => {
    if (!el.value)
      return
    scrollbar = new PerfectScrollbar(el.value, { minScrollbarLength: 30 })
  })

  onBeforeUnmount(() => {
    cancelScroll()
    scrollbar?.destroy()
    scrollbar = null
  })

  return { scrollTop, onScroll, resetScroll, scrollToTop, update }
}
