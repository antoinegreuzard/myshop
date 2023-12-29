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

    <img v-if="productImageUrl" :src="productImageUrl" :alt="product.name" />
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
const productImageUrl = ref('');

onMounted(async () => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    return;
  }

  if (props.product.image) {
    try {
      const mediaObjectId = props.product.image.split('/').pop();
      const response = await fetch(`http://localhost/api/media_objects/${mediaObjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur de réponse de l\'API pour l\'image');
      }

      const data = await response.json();
      productImageUrl.value = `http://localhost/${data.contentUrl}`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  if (props.product.categories && props.product.categories.length) {
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

    h3 {
        margin-top: 0;
    }
}
</style>
