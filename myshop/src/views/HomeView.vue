<template>
  <div class="home">
    <h1>Bienvenue sur MyShop</h1>
    <div v-if="products.length">
      <h2>Produits Disponibles</h2>
      <ProductItem v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div v-else>
      <p>Chargement des produits...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductItem from '../components/Products/ProductItem.vue';

const products = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost/api/products');
    if (!response.ok) throw new Error('Erreur de chargement des produits');

    const data = await response.json();
    products.value = data['hydra:member'];
  } catch (error) {
    throw new Error(error.message);
  }
});
</script>

<style scoped>
.home {
    text-align: center;
    padding: 2rem;

    h1, h2 {
        margin-bottom: 1rem;
    }
}
</style>
