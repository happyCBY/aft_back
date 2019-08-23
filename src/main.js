import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'
import DT from '../src/assets/dt-common.js'
import sha256 from 'js-sha256'
import constant from '../src/assets/constant.js'
import filter from '../src/assets/function.js'

import '@/icons' // icon
import '@/permission' // permission control
import './vendors/element/index.css'
/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.prototype.$sha256 = sha256
Vue.prototype.axios = axios
window.$filter = filter
window.$dt = DT
window.axios = axios
window.$constant = constant

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
