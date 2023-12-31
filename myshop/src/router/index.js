import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import NotFound from '../views/NotFoundPage.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProductView from '../views/ProductView.vue';
import AccountView from '../views/AccountView.vue';

function userIsAuthenticated() {
  const token = localStorage.getItem('myshop_userToken');
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
    meta: { title: 'Accueil', description: 'Bienvenue sur notre site. Découvrez nos produits de haute qualité.' },
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: ProductView,
    meta: { title: 'Produit', description: 'Bienvenue sur notre site. Découvrez nos produits de haute qualité.' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page non trouvée', description: 'Bienvenue sur notre site. Découvrez nos produits de haute qualité.' },
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: { requiresAuth: true, title: 'Mon compte', description: 'Bienvenue sur notre site. Découvrez nos produits de haute qualité.' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Se connecter', description: 'Bienvenue sur notre site. Découvrez nos produits de haute qualité.' },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { title: 'Créer un compte', description: 'Bienvenue sur notre site. Découvrez nos produits de haute qualité.' },
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('myshop_userToken');
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
  let pageTitle = to.name || 'MyShop';
  let pageDescription = '';

  if (to.meta.title) {
    pageTitle = to.meta.title;
  }

  document.title = `${pageTitle} - MyShop`;

  if (to.meta.description) {
    pageDescription = to.meta.description;
  } else {
    pageDescription = 'Description par défaut de la page.';
  }

  document.querySelector('meta[name="description"]').content = pageDescription;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuthenticated = await userIsAuthenticated();
    if (!isAuthenticated) {
      localStorage.removeItem('myshop_userToken');
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
