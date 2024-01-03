import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import NotFound from '../views/NotFoundPage.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProductView from '../views/ProductView.vue';
import AccountView from '../views/AccountView.vue';
import ProductsEdit from '../views/admin/ProductsEdit.vue';
import CategoriesEdit from '../views/admin/CategoriesEdit.vue';
import UsersEdit from '../views/admin/UsersEdit.vue';

function userIsAuthenticated() {
  const token = localStorage.getItem('myshop_userToken');
  const id = localStorage.getItem('myshop_userId');
  if (!token && !id) return Promise.resolve({ isAuthenticated: false });

  return fetch('http://localhost/api/users', {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
  })
    .then((response) => {
      if (response.ok) {
        return { isAuthenticated: true };
      }
      throw new Error('Non-authenticated');
    })
    .catch(() => ({ isAuthenticated: false }));
}

function clearAuthenticationData() {
  localStorage.removeItem('myshop_userToken');
  localStorage.removeItem('myshop_userId');
  window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: false } }));
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
    meta: { title: 'Produit', description: 'Découvrez notre produit.' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page non trouvée', description: 'Page introuvable.' },
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountView,
    meta: { requiresAuth: true, title: 'Mon compte', description: 'Gérez votre compte.' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Se connecter', description: 'Connectez-vous à votre compte.' },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { title: 'Créer un compte', description: 'Créez un nouveau compte.' },
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      localStorage.removeItem('myshop_userToken');
      localStorage.removeItem('myshop_userId');
      window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: false } }));
      next({ name: 'Login' });
    },
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: ProductsEdit,
    meta: { requiresAuth: true, title: 'Gestion des produits' },
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: CategoriesEdit,
    meta: { requiresAuth: true, title: 'Gestion des catégories' },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: UsersEdit,
    meta: { requiresAuth: true, title: 'Gestion des utilisateurs' },
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const pageTitle = to.meta.title || to.name || 'MyShop';
  const pageDescription = to.meta.description || 'Description par défaut de la page.';
  document.title = `${pageTitle} - MyShop`;
  document.querySelector('meta[name="description"]').content = pageDescription;

  const authStatus = await userIsAuthenticated();

  if (!authStatus.isAuthenticated) {
    clearAuthenticationData();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: true } }));

    if (to.name === 'Login' || to.name === 'Register') {
      next({ name: 'Account' });
    } else {
      next();
    }
  }
});

export default router;
