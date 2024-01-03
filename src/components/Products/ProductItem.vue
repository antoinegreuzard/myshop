<template>
  <!-- Lien de navigation pour chaque produit avec des informations détaillées -->
  <router-link class="product-item" :to="{ name: 'Product', params: { id: product.id }}">
    <!-- Nom du produit -->
    <h3>{{ product.name }}</h3>
    <!-- Description du produit, affichée seulement si elle existe -->
    <p v-if="product.description">{{ product.description }}</p>
    <!-- Affiche le prix si c'est un nombre -->
    <p v-if="typeof product.price === 'number'">Prix : {{ product.price }} €</p>

    <!-- Liste des catégories, affichée seulement si le produit en a -->
    <div v-if="product.categories.length">
      <h4>Catégories:</h4>
      <ul>
        <!-- Énumération des catégories -->
        <li v-for="category in product.categories" :key="category.id">{{ category.name }}</li>
      </ul>
    </div>

    <!-- Image du produit, affichée seulement si l'URL de l'image existe -->
    <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

// Réception de l'objet 'product' comme propriété
const { product } = defineProps(['product']);
</script>

<style scoped lang="scss">
.product-item {
    margin: 1rem;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    flex: 0 1 calc(33.333% - 2rem);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        flex: 0 1 100%;
    }

    h3 {
        margin-top: 0;
        color: #333;
    }

    h4 {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

    p {
        color: #666;
    }

    img {
        aspect-ratio: 4/3;
        object-fit: cover;
        width: 100%;
        height: auto;
        border-radius: 4px;
    }

    ul {
        padding-left: 20px;
    }
}
</style>
