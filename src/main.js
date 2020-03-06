import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// Map
import VueLayers from 'vuelayers'
// CSS
import 'vuelayers/lib/style.css' // needs css-loader

import vuetify from './plugins/vuetify'

// Vue Use
Vue.use(VueLayers)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
