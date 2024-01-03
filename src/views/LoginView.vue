<template>
  <!-- Conteneur principal pour la page de connexion -->
  <div class="login-container">
    <h1>Connexion</h1>

    <!-- Affichage des messages de chargement, d'erreur ou de réussite -->
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Formulaire de connexion -->
    <form @submit.prevent="login">
      <!-- Champ pour l'email de l'utilisateur -->
      <div class="form-group">
        <label for="username">Email de l'utilisateur:</label>
        <input type="text" id="username" v-model="credentials.email" required>
      </div>
      <!-- Champ pour le mot de passe -->
      <div class="form-group">
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="credentials.password" required>
      </div>
      <!-- Bouton pour soumettre le formulaire -->
      <button type="submit">Connexion</button>
    </form>

    <!-- Lien vers la page d'inscription -->
    <router-link :to="{name: 'Register'}">Créer un compte</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Utilisation du routeur Vue pour la navigation
const router = useRouter();

// Déclaration des variables réactives pour le stockage des informations de connexion
const credentials = ref({
  email: '',
  password: '',
});

const loading = ref(false);
const message = ref('');
const error = ref('');

// Fonction pour gérer la connexion de l'utilisateur
const login = async () => {
  loading.value = true;
  message.value = '';
  error.value = '';

  try {
    // Tentative de connexion à l'API d'authentification
    const response = await fetch('http://localhost/authentication_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials.value),
    });

    if (!response.ok) {
      error.value = 'Une erreur est survenue lors de la connexion';
      return;
    }

    const dataToken = await response.json();

    const usersResponse = await fetch('http://localhost/api/users', {
      headers: {
        Authorization: `Bearer ${dataToken.token}`,
      },
    });

    if (!usersResponse.ok) {
      error.value = 'Une erreur est survenue lors de la récupération des utilisateurs';
      return;
    }

    const usersData = await usersResponse.json();

    const authenticatedUser = usersData['hydra:member'].find(
      (user) => user.email === credentials.value.email,
    );

    if (!authenticatedUser) {
      error.value = 'Utilisateur non trouvé';
      return;
    }

    // Stockage du token et de l'ID de l'utilisateur, puis redirection
    localStorage.setItem('myshop_userToken', dataToken.token);
    localStorage.setItem('myshop_userId', authenticatedUser.id);
    window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: true } }));
    message.value = 'Connexion réussie';
    await router.push({ name: 'Home' });
  } catch (e) {
    error.value = e.message || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;

  h1 {
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input[type="text"],
    input[type="password"] {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }

  button[type="submit"] {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #333;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #555;
    }
  }

  .loading, .error, .message {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  .loading {
    color: #007bff;
  }

  .error {
    color: #d9534f;
    background-color: #f2dede;
  }

  .message {
    color: #3c763d;
    background-color: #dff0d8;
  }

  router-link {
    display: block;
    margin-top: 20px;
    color: #007bff;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
