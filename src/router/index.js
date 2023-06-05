import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Ratio from '../views/Ratio.vue'
import Order from '../views/Order.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blend-ratio',
      name: 'determine_ratio',
      component: Ratio
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    }
  ]
})

export default router
