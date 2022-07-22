import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import App from './App.vue'

import './assets/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(PerfectScrollbar)

app.mount('#app')
