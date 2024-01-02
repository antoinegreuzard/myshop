<template>
  <div class="home container">
    <h1>Bienvenue sur MyShop</h1>
    <div class="filters-container">
      <input v-model.number="minPrice" type="number" placeholder="Prix min" />
      <input v-model.number="maxPrice" type="number" placeholder="Prix max" />

      <select v-model="sortOrder">
        <option value="" selected>Ordre par titre des produits</option>
        <option value="asc">Croissant</option>
        <option value="desc">Décroissant</option>
      </select>
    </div>
    <div class="search-and-filter-container">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Mots clés..."
          class="search-input"/>
      </div>
      <div class="category-filter">
        <select v-model="selectedCategory">
          <option value="">Toutes les catégories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    <button @click="searchProducts" class="search-button">Recherche</button>
    <div v-if="isLoading">
      <p>Chargement en cours...</p>
    </div>
    <div v-else>
      <div v-if="paginatedProducts.length" class="products">
        <ProductItem v-for="product in paginatedProducts" :key="product.id" :product="product"/>
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
const searchQuery = ref('');
const minPrice = ref();
const maxPrice = ref();
const sortOrder = ref('');
const categories = ref([]);
const selectedCategory = ref('');

const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return products.value.slice(startIndex, startIndex + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage));

const fetchProductDetails = async (product) => {
  const token = await getAuthenticationToken();
  if (!token) return product;

  const productCategories = [];
  let imageUrl = '';

  if (product.categories) {
    productCategories.value = await Promise.all(product.categories.map(async (categoryUrl) => {
      const categoryId = categoryUrl.split('/')
        .pop();
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
    const mediaObjectId = product.image.split('/')
      .pop();
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

  return {
    ...product,
    categories: productCategories,
    imageUrl,
  };
};

const fetchCategories = async () => {
  const token = await getAuthenticationToken();

  try {
    const response = await fetch('http://localhost/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      categories.value = data['hydra:member'];
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const searchParams = new URLSearchParams();

    if (searchQuery.value) {
      searchParams.append('name', searchQuery.value);
      searchParams.append('description', searchQuery.value);
    }

    if (minPrice.value && maxPrice.value) {
      searchParams.append('price[gte]', minPrice.value);
      searchParams.append('price[lte]', maxPrice.value);
    } else if (minPrice.value) {
      searchParams.append('price[gte]', minPrice.value);
    } else if (maxPrice.value) {
      searchParams.append('price[lte]', maxPrice.value);
    }

    if (sortOrder.value) {
      searchParams.append('order[name]', sortOrder.value);
    }

    if (selectedCategory.value) {
      searchParams.append('category', selectedCategory.value);
    }

    const response = await fetch(`http://localhost/api/products?${searchParams.toString()}`);
    if (!response.ok) return;

    const data = await response.json();
    products.value = await Promise.all(
      data['hydra:member'].map(async (product) => fetchProductDetails(product)),
    );
  } catch (error) {
    throw new Error(error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchProducts();
});

const changePage = (newPage) => {
  currentPage.value = newPage;
  fetchProducts();
};

const searchProducts = () => {
  currentPage.value = 1;
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

  .search-and-filter-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .search-button {
    padding: 0.5em;
    border: none;
    border-radius: 4px;
    background-color: #646cff;
    color: white;
    cursor: pointer;
    margin-bottom: 3rem;
  }

  .filters-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    input[type="number"] {
      padding: 0.5em;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 150px;
    }

    select {
      padding: 0.5em;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
    }
  }
}
</style>
