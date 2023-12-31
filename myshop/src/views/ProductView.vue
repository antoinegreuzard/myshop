<template>
  <div class="container product">
    <div v-if="isLoading">
      <p>Chargement en cours...</p>
    </div>
    <div class="columns" v-else>
      <div class="column image-column" v-if="product.imageUrl">
        <img :src="product.imageUrl" alt="Image du produit">
      </div>
      <div class="column content-column">
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
        <p>Prix : {{ product.price }} €</p>
        <ul v-if="product.categories">
          <li v-for="category in product.categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import getAuthenticationToken from '../api/getApiKey';

const route = useRoute();
const isLoading = ref(false);
const product = ref({});

const fetchCategory = async (categoryUrl, token) => {
  const categoryId = categoryUrl.split('/').pop();
  try {
    const response = await fetch(`http://localhost/api/categories/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchImage = async (imageUrl, token) => {
  const mediaObjectId = imageUrl.split('/').pop();
  try {
    const response = await fetch(`http://localhost/api/media_objects/${mediaObjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return null;
    const imageData = await response.json();
    return `http://localhost/${imageData.contentUrl}`;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchProductDetails = async (productData, token) => {
  let categories = [];
  let imageUrl = '';

  if (productData.categories) {
    categories = await Promise.all(
      productData.categories.map(
        (categoryUrl) => fetchCategory(categoryUrl, token),
      ),
    );
  }

  if (productData.image) {
    imageUrl = await fetchImage(productData.image, token);
  }

  return { ...productData, categories: categories.filter(Boolean), imageUrl };
};

const fetchProduct = async () => {
  isLoading.value = true;
  const productId = route.params.id;
  try {
    const token = await getAuthenticationToken();
    if (!token) return;

    const response = await fetch(`http://localhost/api/products/${productId}`);
    if (!response.ok) return;

    const productData = await response.json();
    product.value = await fetchProductDetails(productData, token);
  } catch (error) {
    throw new Error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const updatePageSEO = () => {
  const productName = product.value.name || 'MyShop';
  document.title = `${productName} - ${route.meta.title || 'MyShop'}`;
  document.querySelector('meta[name="description"]').content = product.value.description;
};

onMounted(async () => {
  await fetchProduct();
  updatePageSEO();
});
</script>

<style scoped lang="scss">

.product {
  margin-block: 3rem;
}

.columns {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.column {
  flex: 1;
  padding: 0;
}

.image-column {
  max-width: 50%;
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.content-column {
  max-width: 50%;
}
</style>
