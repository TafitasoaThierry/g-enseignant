import { createRouter, createWebHistory } from 'vue-router'
import Enseignant from '../views/Enseignant.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'enseignants',
      component: Enseignant,
    },
    {
      path: '/ajout',
      name: 'ajout',
      component: () => import('../views/Ajout.vue'),
    },
    {
      path: '/:object/edit',
      name: 'edit',
      component: () => import('../views/Edit.vue'),
    },
  ],
})

export default router
