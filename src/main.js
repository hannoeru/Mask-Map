import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnalytics from 'vue-analytics'

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: 'UA-55184798-7',
  autoTracking: {
    screenview: true
  }
})
// Vue Use
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
