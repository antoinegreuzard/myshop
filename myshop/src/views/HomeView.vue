<template>
  <div class="home container">
    <h1>Bienvenue sur MyShop</h1>
    <div class="search-container">
      <input type="text" placeholder="Rechercher des produits..." class="search-input"/>
      <button type="submit" class="search-button">Recherche</button>
    </div>
    <div v-if="isLoading">
      <p>Chargement en cours...</p>
    </div>
    <div v-else>
      <div v-if="paginatedProducts.length" class="products">
        <ProductItem v-for="product in paginatedProducts" :key="product.id" :product="product" />
      </div>
      <div v-else>
        <p>Aucun produit à afficher.</p>
      </div>
    </div>
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @change-page="changePage"></Pagination>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ProductItem from '../components/Products/ProductItem.vue';
import Pagination from '../components/Products/PaginationPage.vue';
import getAuthenticationToken from '../api/getApiKey';

const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 9;
const isLoading = ref(false);

const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return products.value.slice(startIndex, startIndex + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));

const fetchProductDetails = async (product) => {
  const token = await getAuthenticationToken();
  if (!token) return product;

  let categories = [];
  let imageUrl = '';

  if (product.categories) {
    categories = await Promise.all(product.categories.map(async (categoryUrl) => {
      const categoryId = categoryUrl.split('/').pop();
      try {
        const response = await fetch(`http://localhost/api/categories/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) return false;
        return await response.json();
      } catch (error) {
        throw new Error(error.message);
      }
    }));
  }

  if (product.image) {
    const mediaObjectId = product.image.split('/').pop();
    try {
      const response = await fetch(`http://localhost/api/media_objects/${mediaObjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) return false;
      const imageData = await response.json();
      imageUrl = `http://localhost/${imageData.contentUrl}`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { ...product, categories, imageUrl };
};

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost/api/products');
    if (!response.ok) return;

    const data = await response.json();
    const allProducts = data['hydra:member'];

    products.value = await Promise.all(
      allProducts.map(
        async (product) => fetchProductDetails(product),
      ),
    );
  } catch (error) {
    throw new Error(error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchProducts();
});

const changePage = (newPage) => {
  currentPage.value = newPage;
  fetchProducts();
};
</script>

<style scoped lang="scss">
.home {
  text-align: center;
  padding: 2rem;

  h1 {
      margin-bottom: 3rem;
  }

  .products {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .search-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;

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
  }
}
</style>
