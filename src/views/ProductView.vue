<template>
  <!-- Conteneur principal pour l'affichage des détails du produit -->
  <div class="container product">
    <!-- Affichage du message de chargement -->
    <div v-if="isLoading">
      <p>Chargement en cours...</p>
    </div>
    <!-- Contenu principal affiché une fois le chargement terminé -->
    <div class="columns" v-else>
      <!-- Colonne pour l'image du produit -->
      <div class="column image-column" v-if="product.imageUrl">
        <img :src="product.imageUrl" alt="Image du produit">
      </div>
      <!-- Colonne pour le contenu textuel du produit -->
      <div class="column content-column">
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
        <p>Prix : {{ product.price }} €</p>
        <!-- Liste des catégories du produit -->
        <ul v-if="product.categories">
          <li v-for="category in product.categories" :key="category.id">
            {{ category.name }}
          </li>
        </ul>
        <ShareProduct :productUrl="productUrl" :productName="product.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import getAuthenticationToken from '../api/getApiKey';
import ShareProduct from '../components/Products/ShareProduct.vue';

// Utilisation du routeur Vue pour accéder aux paramètres de la route
const route = useRoute();
const isLoading = ref(false);
const product = ref({});

// Création de la constante productUrl
const productUrl = computed(() => `${window.location.origin}${route.fullPath}`);

// Fonctions pour récupérer les détails des catégories et de l'image du produit
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

  // Enregistrement de l'historique des produits visités
  const visitedProducts = JSON.parse(localStorage.getItem('visitedProducts') || '[]');
  if (!visitedProducts.some((p) => p.id === productData.id)) {
    visitedProducts.push({ id: productData.id, name: productData.name });
    localStorage.setItem('visitedProducts', JSON.stringify(visitedProducts));
  }

  return { ...productData, categories: categories.filter(Boolean), imageUrl };
};

// Fonction pour récupérer les détails complets du produit
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

// Fonction pour mettre à jour les informations SEO de la page
const updatePageSEO = () => {
  const productName = product.value.name || 'MyShop';
  document.title = `${productName} - ${route.meta.title || 'MyShop'}`;
  document.querySelector('meta[name="description"]').content = product.value.description;
};

// Récupération des détails du produit lors du montage du composant
onMounted(async () => {
  await fetchProduct();
  updatePageSEO();
});
</script>

<style scoped lang="scss">
.product {
  margin-block: 3rem;

  .columns {
    display: flex;
    flex-direction: row;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .column {
      flex: 1;
      padding: 0;

      &.image-column {
        max-width: 100%;
        img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          border-radius: 8px;
        }
      }

      &.content-column {
        max-width: 100%;
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        ul {
          list-style: none;
          padding: 0;

          li {
            margin-bottom: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
