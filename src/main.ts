import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { Dialog } from 'vant'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Dialog)

app.mount('#app')
