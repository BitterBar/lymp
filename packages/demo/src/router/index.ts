import { createRouter, createWebHistory } from 'vue-router'
import Overlay from '../views/Overlay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overlay',
      component: Overlay
    },
    {
      path: '/marker',
      name: 'marker',
      component: () => import('../views/Marker.vue')
    },
    {
      path: '/ps',
      name: 'ps',
      component: () => import('../views/Ps.vue')
    },
    {
      path: '/per-marker',
      name: 'perMarker',
      component: () => import('../views/PerMarker.vue')
    },
    {
      path: '/marker-cluster',
      name: 'markerCluster',
      component: () => import('../views/MarkerCluster.vue')
    }
  ]
})

export default router
