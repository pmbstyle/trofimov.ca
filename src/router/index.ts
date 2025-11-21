import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import App from '../App.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: App,
  },
  {
    path: '/blog',
    name: 'blog',
    component: App,
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: App,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
