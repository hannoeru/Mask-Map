import { createApp } from 'vue'
import { installAnalytics } from '@/lib/analytics'
import App from './App.vue'
import 'virtual:uno.css'
import '@/styles/markers.css'

installAnalytics()
createApp(App).mount('#app')
