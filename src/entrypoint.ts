import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuth } from '../lib/authentication'

const app = createApp(App)

// Initialize authentication before mounting
const { initAuth } = useAuth()
initAuth().then(() => {
  app.use(router).mount('#app')
})
