<template>
  <div class="product-item">
    <h3>{{ product.name }}</h3>
    <p v-if="product.description">{{ product.description }}</p>
    <p v-if="typeof product.price === 'number'">Prix : {{ product.price }} €</p>

    <div v-if="categories.length">
      <h4>Catégories:</h4>
      <ul>
        <li v-for="category in categories" :key="category.id">{{ category.name }}</li>
      </ul>
    </div>

    <!-- Exemple d'image avec v-if -->
    <img v-if="product.image" :src="product.image" alt="Image du produit" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const categories = ref([]);

onMounted(async () => {
  if (props.product.categories && props.product.categories.length) {
    const token = localStorage.getItem('userToken');

    await Promise.all(props.product.categories.map(async (categoryUrl) => {
      const categoryId = categoryUrl.split('/').pop();

      try {
        const response = await fetch(`http://localhost/api/categories/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur de réponse de l\'API');
        }

        const data = await response.json();
        categories.value.push(data);
      } catch (error) {
        throw new Error(error.message);
      }
    }));
  }
});
</script>

<style scoped>
.product-item {
  border: 1px solid #ddd;
  padding: 1em;
  margin: 1em;
  border-radius: 8px;
}

.product-item h3 {
  margin-top: 0;
}
</style>
