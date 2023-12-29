import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import NotFound from '../views/NotFoundPage.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

function userIsAuthenticated() {
  const token = localStorage.getItem('userToken');
  if (!token) return Promise.resolve(false);

  return fetch('http://localhost/api/users', {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
  })
    .then((response) => {
      if (response.ok) {
        return true;
      }
      throw new Error('Non-authenticated');
    })
    .catch(() => false);
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
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('userToken');
      window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: false } }));
      next({ name: 'Login' });
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuthenticated = await userIsAuthenticated();
    if (!isAuthenticated) {
      localStorage.removeItem('userToken');
      window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: false } }));
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
