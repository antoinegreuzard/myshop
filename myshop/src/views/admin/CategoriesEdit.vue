<template>
  <div class="category-management container">
    <h1>Gestion des Catégories</h1>

    <!-- Loading Indicator for Fetching Categories -->
    <div v-if="isLoading" class="loading">Chargement des catégories...</div>

    <!-- List Categories -->
    <div v-else class="categories-list">
      <h2>Categories</h2>
      <ul>
        <li v-for="category in categories" :key="category.id">
          {{ category.name }}
          <button @click="editCategory(category)">Modifier</button>
          <button @click="deleteCategory(category.id)">Supprimer</button>
        </li>
      </ul>
    </div>

    <!-- Add/Edit Category Form -->
    <div class="category-form">
      <h2>{{ isEditMode ? 'Modifier la Catégorie' : 'Ajouter une Catégorie' }}</h2>
      <form @submit.prevent="isEditMode ? updateCategory() : addCategory()">
        <label for="name">Nom de la Catégorie</label>
        <input id="name" v-model="currentCategory.name" required>
        <input
        type="submit"
        :value="isEditMode ? 'Enregistrer les modifications' : 'Ajouter une Catégorie'">
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import getAuthenticationToken from '../../api/getApiKey';

const categories = ref([]);
const currentCategory = reactive({ id: null, name: '' });
const isEditMode = ref(false);
const isLoading = ref(false);

const apiBaseUrl = 'http://localhost/api/categories';
let headers = {};

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(apiBaseUrl, { headers });
    const data = await response.json();
    categories.value = data['hydra:member'];
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    isLoading.value = false;
  }
};
const initialize = async () => {
  isLoading.value = true;
  const token = await getAuthenticationToken();
  headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  await fetchCategories();
  isLoading.value = false;
};

const resetForm = () => {
  currentCategory.id = null;
  currentCategory.name = '';
  isEditMode.value = false;
};
const addCategory = async () => {
  try {
    await fetch(apiBaseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(currentCategory),
    });
    await fetchCategories();
    resetForm();
  } catch (error) {
    console.error('Error adding category:', error);
  }
};

const editCategory = (category) => {
  isEditMode.value = true;
  currentCategory.id = category.id;
  currentCategory.name = category.name;
};

const updateCategory = async () => {
  try {
    await fetch(`${apiBaseUrl}/${currentCategory.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(currentCategory),
    });
    await fetchCategories();
    resetForm();
  } catch (error) {
    console.error('Error updating category:', error);
  }
};

const deleteCategory = async (id) => {
  try {
    await fetch(`${apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });
    await fetchCategories();
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};

onMounted(initialize);
</script>

<style lang="scss">
.category-management {
  margin: 3rem auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  h1 {
    text-align: center;
    color: #333;
  }

  .categories-list, .category-form {
    margin-top: 20px;

    h2 {
      color: #555;
    }

    ul {
      list-style-type: none;
      padding: 0;

      li {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        button {
          margin-left: 10px;
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
    }

    form {
      display: flex;
      flex-direction: column;

      label {
        margin-bottom: 5px;
      }

      input[type="text"], input[type="submit"] {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
      }

      input[type="submit"] {
        background-color: #28a745;
        color: white;
        cursor: pointer;

        &:hover {
          background-color: #218838;
        }
      }
    }
  }

  .loading {
    text-align: center;
    font-size: 1.2em;
    color: #666;
  }
}
</style>
