import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'
import { findCodeBySourceMap } from './utils'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
// 捕获错误
app.config.errorHandler = (error, vm) => {
  //   console.error(error)
  //   console.error(vm)
  const errorStack = ErrorStackParser.parse(error as Error)
  console.log('errorStack', errorStack)
  findCodeBySourceMap(errorStack[0])
}

app.mount('#app')
