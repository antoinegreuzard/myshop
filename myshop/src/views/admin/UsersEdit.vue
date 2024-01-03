<template>
  <div class="user-management container">
    <h1>Gestion des Utilisateurs</h1>

    <!-- Bouton pour ajouter un nouvel utilisateur -->
    <button @click="toggleAddMode">Ajouter un Utilisateur</button>

    <!-- Indicateur de chargement et messages -->
    <div v-if="isLoading" class="loading">Chargement des utilisateurs...</div>
    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Liste des utilisateurs -->
    <div v-else class="users-list">
      <h2>Utilisateurs</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.fullName }} - {{ user.email }}
          <button @click="editUser(user)">Modifier</button>
          <button @click="deleteUser(user.id)">Supprimer</button>
        </li>
      </ul>
    </div>

    <!-- Formulaire d'ajout/modification d'utilisateur -->
    <div class="user-form" v-if="isEditMode || isAddMode">
      <h2>{{ isEditMode ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur' }}</h2>
      <form @submit.prevent="isEditMode ? updateUser() : addUser()">
        <label for="fullName">Nom Complet</label>
        <input id="fullName" v-model="currentUser.fullName" required>

        <label for="email">Email</label>
        <input id="email" type="email" v-model="currentUser.email" required>

        <label for="password" v-if="isAddMode">Mot de Passe</label>
        <input
        id="password"
        type="password"
        v-model="currentUser.password"
        v-if="isAddMode" required>

        <label for="roles">Rôles</label>
        <select id="roles" v-model="currentUser.roles" multiple>
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_USER">Utilisateur</option>
        </select>

        <input
          type="submit"
          :value="isEditMode ? 'Enregistrer les modifications' : 'Ajouter un Utilisateur'"
        >
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import getAuthenticationToken from '../../api/getApiKey';

const users = ref([]);
const currentUser = reactive({
  id: null, email: '', roles: [], fullName: '', password: '',
});
const isEditMode = ref(false);
const isAddMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const error = ref('');

const apiBaseUrl = 'http://localhost/api/users';
let headers = {};

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(apiBaseUrl, { headers });
    const data = await response.json();
    users.value = data['hydra:member'];
  } catch (e) {
    error.value = `Error fetching users: ${e.message}`;
  } finally {
    isLoading.value = false;
  }
};

const initialize = async () => {
  isLoading.value = true;
  const token = await getAuthenticationToken();
  headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  await fetchUsers();
  isLoading.value = false;
};

const resetForm = () => {
  currentUser.id = null;
  currentUser.email = '';
  currentUser.roles = [];
  currentUser.fullName = '';
  currentUser.password = '';
};

const toggleAddMode = () => {
  isAddMode.value = true;
  isEditMode.value = false;
  resetForm();
  currentUser.roles = [];
};

const addUser = async () => {
  try {
    const userToAdd = {
      email: currentUser.email,
      roles: currentUser.roles,
      fullName: currentUser.fullName,
      password: currentUser.password,
    };
    await fetch(apiBaseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(userToAdd),
    });
    await fetchUsers();
    resetForm();
    message.value = 'Utilisateur ajouté avec succès.';
  } catch (e) {
    error.value = `Error adding user: ${e.message}`;
  }
};

const editUser = (user) => {
  isEditMode.value = true;
  isAddMode.value = false;
  currentUser.id = user.id;
  currentUser.email = user.email;
  currentUser.fullName = user.fullName;
  currentUser.roles = user.roles.filter((role) => role !== 'ROLE_ADMIN');
};

const updateUser = async () => {
  try {
    const userToUpdate = {
      email: currentUser.email,
      roles: currentUser.roles,
      fullName: currentUser.fullName,
    };
    await fetch(`${apiBaseUrl}/${currentUser.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(userToUpdate),
    });
    await fetchUsers();
    resetForm();
    message.value = 'Utilisateur mis à jour avec succès.';
  } catch (e) {
    error.value = `Error updating user: ${e.message}`;
  }
};

const deleteUser = async (id) => {
  try {
    await fetch(`${apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });
    await fetchUsers();
    message.value = 'Utilisateur supprimé avec succès.';
  } catch (e) {
    error.value = `Error deleting user: ${e.message}`;
  }
};

onMounted(initialize);
</script>

<style scoped lang="scss">
.user-management {
  margin: 3rem auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  h1 {
    text-align: center;
    color: #333;
  }

  .users-list, .user-form {
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

      input[type="email"],
      input[type="text"],
      input[type="password"],
      input[type="submit"],
      select {
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

  .loading, .message, .error {
    text-align: center;
    font-size: 1.2em;
    margin-top: 10px;
  }

  .message {
    color: green;
  }

  .error {
    color: red;
  }
}
</style>
