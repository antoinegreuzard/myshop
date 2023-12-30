<template>
  <div class="container">
    <div v-if="isLoading">
      <p>Chargement en cours...</p>
    </div>
    <div v-else>
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>Prix : {{ product.price }} €</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoading = ref(false);
const product = ref({});

const fetchProduct = async () => {
  isLoading.value = true;
  const productId = route.params.id;
  try {
    const response = await fetch(`http://localhost/api/products/${productId}`);
    if (!response.ok) throw new Error('Erreur de chargement du produit');

    product.value = await response.json();
  } catch (error) {
    throw new Error(error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchProduct();
});
</script>
