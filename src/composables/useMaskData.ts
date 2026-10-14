import type { PharmacyFeature } from '@/types/pharmacy'
import axios from 'axios'
import { ref } from 'vue'
import { parseMaskFeatures } from '@/lib/pharmacies'

const features = ref<readonly PharmacyFeature[] | null>(null)
const selected = ref<PharmacyFeature | null>(null)
const focus = ref<PharmacyFeature | null>(null)
const isLoading = ref(true)
const loadError = ref('')

async function load() {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await axios.get(import.meta.env.VUE_APP_MASK_API, { timeout: 30_000 })
    features.value = Object.freeze(parseMaskFeatures(response.data))
  }
  catch {
    loadError.value = '口罩資料暫時無法載入，請再試一次'
  }
  finally {
    isLoading.value = false
  }
}

function select(item: PharmacyFeature | null) {
  selected.value = item
}

function focusOn(item: PharmacyFeature) {
  focus.value = item
  selected.value = item
}

export function useMaskData() {
  return {
    features,
    selected,
    focus,
    isLoading,
    loadError,
    load,
    select,
    focusOn,
  }
}
