import type { Ref } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

export function useMenuScroll(el: Ref<HTMLElement | null>) {
  const scrollTop = ref(0)
  let scrollbar: PerfectScrollbar | null = null

  function onScroll(event: Event) {
    scrollTop.value = (event.target as HTMLElement).scrollTop
  }

  function resetScroll() {
    const node = el.value
    if (!node)
      return
    node.scrollTop = 0
    scrollTop.value = 0
    scrollbar?.update()
  }

  function scrollToTop() {
    el.value?.scrollTo({ top: 0, behavior: 'smooth' })
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
    scrollbar?.destroy()
    scrollbar = null
  })

  return { scrollTop, onScroll, resetScroll, scrollToTop, update }
}
