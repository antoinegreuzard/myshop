<template>
  <!-- Conteneur principal pour la gestion des catégories -->
  <div class="category-management container">
    <h1>Gestion des Catégories</h1>

    <!-- Affichage des indicateurs de chargement et des messages d'erreur ou de succès -->
    <div v-if="isLoading" class="loading">Chargement des catégories...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="message">{{ message }}</div>

    <!-- Affichage de la liste des catégories -->
    <div v-else class="categories-list">
      <h2>Catégories</h2>
      <ul>
        <!-- Boucle sur chaque catégorie pour affichage -->
        <li v-for="category in categories" :key="category.id">
          {{ category.name }}
          <!-- Boutons pour modifier et supprimer une catégorie -->
          <button @click="editCategory(category)">Modifier</button>
          <button @click="deleteCategory(category.id)">Supprimer</button>
        </li>
      </ul>
    </div>

    <!-- Formulaire pour ajouter ou modifier une catégorie -->
    <div class="category-form">
      <h2>{{ isEditMode ? 'Modifier la Catégorie' : 'Ajouter une Catégorie' }}</h2>
      <form @submit.prevent="isEditMode ? updateCategory() : addCategory()">
        <label for="name">Nom de la Catégorie</label>
        <input id="name" v-model="currentCategory.name" type="text" required>
        <input
          type="submit"
          :value="isEditMode ? 'Enregistrer les modifications' : 'Ajouter une Catégorie'"
        >
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import getAuthenticationToken from '../../api/getApiKey';

// Initialisation des états réactifs
const categories = ref([]); // Stocke la liste des catégories
const currentCategory = reactive({ id: null, name: '' }); // Catégorie courante pour le formulaire
const isEditMode = ref(false); // Indique si le formulaire est en mode édition
const isLoading = ref(false); // Indicateur de chargement
const error = ref(''); // Message d'erreur
const message = ref(''); // Message de succès

const apiBaseUrl = 'http://localhost/api/categories'; // URL de base de l'API
let headers = {}; // En-têtes pour les requêtes API

// Fonctions pour interagir avec l'API et gérer les catégories
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(apiBaseUrl, { headers });
    const data = await response.json();
    categories.value = data['hydra:member'];
  } catch (e) {
    error.value = `Erreur lors du chargement des catégories: ${e.message}`;
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
    message.value = 'Catégorie ajoutée avec succès.';
    error.value = '';
  } catch (e) {
    error.value = `Erreur lors de l'ajout de la catégorie: ${e.message}`;
    message.value = '';
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
    message.value = 'Catégorie mise à jour avec succès.';
    error.value = '';
  } catch (e) {
    error.value = `Erreur lors de la mise à jour de la catégorie: ${e.message}`;
    message.value = '';
  }
};

const deleteCategory = async (id) => {
  try {
    await fetch(`${apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });
    await fetchCategories();
    message.value = 'Catégorie supprimée avec succès.';
    error.value = '';
  } catch (e) {
    error.value = `Erreur lors de la suppression de la catégorie: ${e.message}`;
    message.value = '';
  }
};

// Fonction appelée lors du montage du composant pour initialiser les données
onMounted(initialize);
</script>

<style scoped lang="scss">
.category-management {
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

  .loading, .error, .message {
    text-align: center;
    font-size: 1.2em;
    margin-top: 20px;
    padding: 10px;
    border-radius: 4px;
  }

  .error {
    color: #d9534f;
    background-color: #f2dede;
    border: 1px solid #d9534f;
  }

  .message {
    color: #3c763d;
    background-color: #dff0d8;
    border: 1px solid #3c763d;
  }

  .categories-list, .category-form {
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

      input[type="text"] {
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
        width: 100%;
      }

      input[type="submit"] {
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
}
</style>
