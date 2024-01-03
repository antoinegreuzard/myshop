<template>
    <header class="header">
        <div class="container">
            <div class="logo-container">
                <router-link :to="{ name: 'Home' }">
                    <img :src="logo" alt="MyShop Logo" class="logo"/>
                </router-link>
            </div>
            <div class="column-right">
              <nav class="navigation">
                  <ul>
                      <li><router-link :to="{ name: 'Home' }">Produits</router-link></li>
                      <li v-if="isAuthenticated">
                        <router-link :to="{ name: 'AdminProducts' }">
                          Gérer les Produits
                        </router-link>
                      </li>
                      <li v-if="isAuthenticated">
                        <router-link :to="{ name: 'AdminCategories' }">
                          Gérer les Catégories
                        </router-link>
                      </li>
                      <li v-if="isAuthenticated">
                        <router-link :to="{ name: 'AdminUsers' }">
                          Gérer les Utilisateurs
                        </router-link>
                      </li>
                  </ul>
              </nav>
              <div class="user-actions">
                  <router-link :to="{ name: 'Account' }" class="account-link">
                  Mon Compte
                  </router-link>
              </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import logo from '../../assets/images/logo.png';

const isAuthenticated = ref(false);

const updateAuthStatus = (event) => {
  isAuthenticated.value = event.detail.isLoggedIn;
};

onMounted(() => {
  window.addEventListener('auth-change', updateAuthStatus);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', updateAuthStatus);
});
</script>

<style scoped lang="scss">
.header {
    padding: 1em;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    > div.container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        @media only screen and (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
        }

        > .column-right {
            display: flex;
            flex-direction: row;
            gap: 1rem;

            @media only screen and (max-width: 768px) {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    }
}

.logo-container {
    .logo {
        height: 50px;
        @media only screen and (max-width: 768px) {
            height: 40px;
        }
    }
}

.navigation {
    ul {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;

        @media only screen and (max-width: 768px) {
            flex-direction: column;
            width: 100%;
        }

        li a {
            padding: 0 1em;
            text-decoration: none;
            color: #333;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}

.user-actions {
    display: flex;
    align-items: center;
}
</style>
