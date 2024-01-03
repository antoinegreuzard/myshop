<template>
  <div class="product-management container">
    <h1>Gestion des Produits</h1>

    <!-- Indicateur de chargement -->
    <div v-if="isLoading" class="loading">Chargement des produits...</div>
    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Liste des produits -->
    <div v-else class="products-list">
      <h2>Produits</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          {{ product.name }} - {{ product.description }} - {{ product.price }}€
          <button @click="editProduct(product)">Modifier</button>
          <button @click="deleteProduct(product.id)">Supprimer</button>
        </li>
      </ul>
    </div>

    <!-- Formulaire d'ajout/modification de produit -->
    <div class="product-form">
      <h2>{{ isEditMode ? 'Modifier le Produit' : 'Ajouter un Produit' }}</h2>
      <form @submit.prevent="isEditMode ? updateProduct() : addProduct()">
        <label for="name">Nom du Produit</label>
        <input id="name" type="text" v-model="currentProduct.name" required>

        <label for="description">Description</label>
        <input id="description" type="text" v-model="currentProduct.description" required>

        <label for="price">Prix</label>
        <input id="price" type="number" v-model="currentProduct.price" required>

        <label for="categories">Catégories</label>
        <select id="categories" v-model="currentProduct.categories" multiple>
          <option v-for="category in categories" :key="category.id" :value="category['@id']">
            {{ category.name }}
          </option>
        </select>

        <label for="image">Image</label>
        <select id="image" v-model="currentProduct.image">
          <option v-for="image in images" :key="image['@id']" :value="image['@id']">
            {{ image.contentUrl }}
          </option>
        </select>

        <div class="image-preview" v-if="currentProduct.image">
          <img :src="getImageUrl(currentProduct.image)" alt="Aperçu de l'image" />
        </div>

        <div class="image-upload">
          <input type="file" @change="handleFileChange" accept="image/*">
          <button @click="uploadImage" type="button">Upload Image</button>
        </div>

        <input
          type="submit"
          :value="isEditMode ? 'Enregistrer les modifications' : 'Ajouter un Produit'"
        >
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import getAuthenticationToken from '../../api/getApiKey';

const products = ref([]);
const categories = ref([]);
const images = ref([]);
const selectedFile = ref(null);
const currentProduct = reactive({
  id: null, name: '', description: '', price: 0, categories: [], image: null,
});
const isEditMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const error = ref('');

const apiBaseUrl = 'http://localhost/api/products';
const categoryApiUrl = 'http://localhost/api/categories';
const imageApiUrl = 'http://localhost/api/media_objects';
let headers = {};

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(apiBaseUrl, { headers });
    const data = await response.json();
    products.value = data['hydra:member'];
  } catch (e) {
    error.value = `Error fetching products: ${e.message}`;
  } finally {
    isLoading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch(categoryApiUrl, { headers });
    const data = await response.json();
    categories.value = data['hydra:member'];
  } catch (e) {
    error.value = `Error fetching categories: ${e.message}`;
  }
};

const fetchImages = async () => {
  try {
    const response = await fetch(imageApiUrl, { headers });
    const data = await response.json();
    images.value = data['hydra:member'];
  } catch (e) {
    error.value = `Error fetching images: ${e.message}`;
  }
};

const initialize = async () => {
  isLoading.value = true;
  const token = await getAuthenticationToken();
  headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  await fetchProducts();
  await fetchCategories();
  await fetchImages();
  isLoading.value = false;
};

const resetForm = () => {
  currentProduct.id = null;
  currentProduct.name = '';
  currentProduct.description = '';
  currentProduct.price = 0;
  currentProduct.categories = [];
  currentProduct.image = null;
  isEditMode.value = false;
};

const addProduct = async () => {
  try {
    await fetch(apiBaseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(currentProduct),
    });
    await fetchProducts();
    resetForm();
    message.value = 'Produit ajouté avec succès.';
  } catch (e) {
    error.value = `Error adding product: ${e.message}`;
  }
};

const editProduct = (product) => {
  isEditMode.value = true;
  currentProduct.id = product.id;
  currentProduct.name = product.name;
  currentProduct.description = product.description;
  currentProduct.price = product.price;
  currentProduct.categories = product.categories;
  currentProduct.image = product.image;
};

const updateProduct = async () => {
  try {
    await fetch(`${apiBaseUrl}/${currentProduct.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(currentProduct),
    });
    await fetchProducts();
    resetForm();
    message.value = 'Produit mis à jour avec succès.';
  } catch (e) {
    error.value = `Error updating product: ${e.message}`;
  }
};

const deleteProduct = async (id) => {
  try {
    await fetch(`${apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });
    await fetchProducts();
    message.value = 'Produit supprimé avec succès.';
  } catch (e) {
    error.value = `Error deleting product: ${e.message}`;
  }
};

const handleFileChange = (event) => {
  [selectedFile.value] = event.target.files;
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    error.value = 'Veuillez sélectionner un fichier.';
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  const token = await getAuthenticationToken();

  try {
    const response = await fetch(imageApiUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      images.value.push(data);
      message.value = 'Image uploadée avec succès !';
    } else {
      error.value = "Erreur lors de l'upload de l'image.";
    }
  } catch (e) {
    error.value = `Erreur lors de l'upload: ${e.message}`;
  }
};

const getImageUrl = (imageId) => {
  const image = images.value.find((img) => img['@id'] === imageId);
  return image ? `http://localhost${image.contentUrl}` : '';
};

onMounted(initialize);
</script>

<style scoped lang="scss">
.product-management {
  margin: 3rem auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
  }

  .products-list, .product-form {
    margin-top: 20px;

    h2 {
      color: #555;
      margin-bottom: 1rem;
    }

    ul {
      list-style-type: none;
      padding: 0;

      li {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 4px;

        button {
          margin-left: 10px;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #0056b3;
          }
        }
      }
    }

    form {
      display: flex;
      flex-direction: column;
      max-width: 500px;

      label {
        margin-bottom: 5px;
      }

      input[type="text"], input[type="number"], select {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        width: 100%;
      }

      input[type="submit"] {
        margin-top: 10px;
        background-color: #4caf50;
        color: white;
        padding: 10px 15px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        &:hover {
          background-color: #45a049;
        }
      }
    }
  }

  .image-upload {
    margin-top: 10px;
    display: flex;
    align-items: center;

    input[type="file"] {
      margin-right: 10px;
    }

    button {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }

  .image-preview img {
    max-width: 100%;
    max-height: 200px;
    margin-top: 10px;
    border-radius: 4px;
  }

  .loading, .message, .error {
    text-align: center;
    font-size: 1.2em;
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
  }

  .message {
    color: #3c763d;
    background-color: #dff0d8;
    border: 1px solid #3c763d;
  }

  .error {
    color: #d9534f;
    background-color: #f2dede;
    border: 1px solid #d9534f;
  }
}
</style>
