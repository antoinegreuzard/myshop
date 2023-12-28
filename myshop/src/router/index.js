import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import NotFound from '../views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: NotFound,
  },
  {
    path: '/account',
    name: 'Account',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
