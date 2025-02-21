import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'
// import { findCodeBySourceMap } from './utils'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
// 捕获错误
app.config.errorHandler = (error: any, vm) => {
  console.log('errorHandler', error)
  const errorStack = ErrorStackParser.parse(error as Error)
  console.log('errorStack', errorStack)
  const jsError = {
    stack_frames: errorStack,
    message: error.message,
    stack: error.stack,
    error_name: error.name,
  }
  console.log('jsError', jsError)
  vm!.$message.error(`您触发了一个${error.name} 错误`)
  localStorage.setItem('jsErrorList', JSON.stringify(jsError))
  //   findCodeBySourceMap(errorStack[0])
}

app.mount('#app')
