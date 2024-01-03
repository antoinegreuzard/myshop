<template>
  <!-- Conteneur principal pour la gestion du compte utilisateur -->
  <div class="container">
    <div class="account">
      <h2>User Account</h2>

      <!-- Message de chargement -->
      <div v-if="loading" class="loading-message">Chargement en cours...</div>

      <!-- Formulaire de mise à jour du compte utilisateur -->
      <div v-else>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <form @submit.prevent="updateAccount">
          <!-- Champ pour le nom complet de l'utilisateur -->
          <div class="form-group">
            <label for="username">Prénom & Nom:</label>
            <input type="text" id="username" v-model="editedUsername" />
          </div>

          <!-- Champ pour l'email -->
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="editedEmail" />
          </div>

          <!-- Champ pour le mot de passe -->
          <div class="form-group">
            <label for="password">Mot de passe:</label>
            <input
            type="password"
            id="password"
            v-model="editedPassword"
            placeholder="Remplir pour modifier" />
          </div>

          <!-- Bouton pour soumettre les modifications -->
          <button type="submit">Enregistrer les modifications</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Déclaration des variables réactives pour le stockage des informations de l'utilisateur
const username = ref('');
const email = ref('');
const editedUsername = ref('');
const editedEmail = ref('');
const editedPassword = ref('');
const errorMessage = ref(null);
const loading = ref(true);

// Fonction pour gérer les erreurs
function handleError(message) {
  errorMessage.value = message;
}

// Fonction pour récupérer les détails du compte utilisateur
async function fetchAccountDetails() {
  try {
    const userId = localStorage.getItem('myshop_userId');
    const token = localStorage.getItem('myshop_userToken');

    if (!userId) {
      loading.value = false;
      return;
    }

    const response = await fetch(`http://localhost/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      loading.value = false;
      return;
    }

    const data = await response.json();

    username.value = data.fullName;
    email.value = data.email;
    editedUsername.value = username.value;
    editedEmail.value = email.value;

    loading.value = false;
  } catch (error) {
    handleError(error.message);
  }
}

// Fonction pour mettre à jour le compte utilisateur
async function updateAccount() {
  try {
    const userId = localStorage.getItem('myshop_userId');
    const token = localStorage.getItem('myshop_userToken');

    const response = await fetch(`http://localhost/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: editedUsername.value,
        email: editedEmail.value,
        password: editedPassword.value,
      }),
    });

    if (!response.ok) {
      return;
    }

    const updatedData = await response.json();

    username.value = updatedData.fullName;
    email.value = updatedData.email;
    errorMessage.value = null;
  } catch (error) {
    handleError(error.message);
  }
}

// Récupération des détails du compte lors du montage du composant
onMounted(fetchAccountDetails);
</script>

<style scoped lang="scss">
.account {
  width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  margin-block: 3rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  .loading-message {
    color: #4caf50;
    margin-bottom: 10px;
  }

  .error-message {
    color: #d9534f;
    background-color: #f2dede;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  .form-group {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }

  button {
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
</style>
