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
import logo from '../../assets/images/logo.png';
</script>

<style scoped lang="scss">
.header {
    padding: 1em;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

      > .column-right {
        display: flex;
        flex-direction: row;
        gap: 1rem;
      }
    }
}

.logo-container {
    .logo {
        height: 50px;
    }
}

.navigation {
    height: fit-content;
    ul {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
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

.user-actions {
    display: flex;
    align-items: center;
}
</style>
