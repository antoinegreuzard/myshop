<template>
    <header class="header">
        <div class="logo-container">
            <router-link :to="{ name: 'Home' }">
                <img :src="logo" alt="MyShop Logo" class="logo"/>
            </router-link>
        </div>
        <div class="search-container">
            <input type="text" placeholder="Rechercher des produits..." class="search-input"/>
            <button class="search-button">Recherche</button>
        </div>
        <nav class="navigation">
            <ul>
                <li><router-link to="/">Accueil</router-link></li>
                <li><router-link :to="{ name: 'Categories' }">Catégories</router-link></li>
            </ul>
        </nav>
        <div class="user-actions">
            <router-link :to="{ name: 'Account' }" class="account-link">Mon Compte</router-link>
        </div>
    </header>
</template>

<script setup>
import logo from '../../assets/images/logo.png';
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-container {
    .logo {
        height: 50px;
    }
}

.search-container {
    display: flex;
}

.search-input {
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px 0 0 4px;
}

.search-button {
    padding: 0.5em 1em;
    border: none;
    border-radius: 0 4px 4px 0;
    background-color: #646cff;
    color: white;
    cursor: pointer;
}

.navigation {
    ul {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
    }

    li a {
        padding: 0.5em 1em;
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
