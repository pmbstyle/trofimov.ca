import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import App from './App.vue'
import router from './router'

import './assets/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PerfectScrollbar)
app.component('QuillEditor', QuillEditor)

app.mount('#app')
