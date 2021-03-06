import Vue from 'vue'
import App from './App.vue'
// import axios from 'axios'

Vue.config.productionTip = false

// 导入less
import '@/styles/base.less'

import '@/plugins/element.js'

import '@/utils/request.js'

import router from '@/router'

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
