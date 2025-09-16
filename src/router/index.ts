import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import { requireAuth, requireGuest } from '../../lib/authentication'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: requireGuest
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
