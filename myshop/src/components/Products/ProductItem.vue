<template>
  <router-link class="product-item" :to="{ name: 'Product', params: { id: product.id }}">
    <h3>{{ product.name }}</h3>
    <p v-if="product.description">{{ product.description }}</p>
    <p v-if="typeof product.price === 'number'">Prix : {{ product.price }} €</p>

    <div v-if="product.categories.length">
      <h4>Catégories:</h4>
      <ul>
        <li v-for="category in product.categories" :key="category.id">{{ category.name }}</li>
      </ul>
    </div>

    <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue';

const { product } = defineProps(['product']);
</script>

<style scoped lang="scss">
.product-item {
    margin: 0;
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    flex: 0 1 calc(33.333% - 2.8rem);

    @media (max-width: 768px) {
      flex: 0 1 100%;
    }

    h3 {
      margin-top: 0;
    }

    h4 {
      margin-top: 1rem;
      margin-bottom: 0;
    }

    img {
      aspect-ratio: 4/3;
      object-fit: cover;
      width: 80%;
      height: auto;
    }
}
</style>
