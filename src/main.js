import { createApp } from 'vue'
import App from './App.vue'
import { installAnalytics } from './analytics'

installAnalytics()
createApp(App).mount('#app')
