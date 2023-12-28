import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import NotFound from '../views/NotFoundPage.vue';
import LoginView from '../views/LoginView.vue';

function userIsAuthenticated() {
  return localStorage.getItem('userToken') !== null;
}

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
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('userToken'); // Supprimez le token JWT
      next({ name: 'Login' }); // Redirigez vers la page de connexion
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!userIsAuthenticated()) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
