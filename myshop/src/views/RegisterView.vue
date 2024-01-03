<template>
  <div class="login-container">
    <h1>Créer son compte</h1>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="message" class="message">{{ message }}</div>

    <form @submit.prevent="register">
      <div class="form-group">
        <label for="fullName">Nom et prénom:</label>
        <input type="text" id="fullName" v-model="registerData.fullName" required>
      </div>
      <div class="form-group">
        <label for="username">Email de l'utilisateur:</label>
        <input type="text" id="username" v-model="registerData.email" required>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="registerData.password" required>
      </div>
      <div class="form-group">
        <label for="passwordconf">Confirmer le mot de passe:</label>
        <input type="password" id="passwordconf" v-model="registerData.passwordconf" required>
      </div>
      <button type="submit">Créer son compte</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import getAuthenticationToken from '../api/getApiKey';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const message = ref('');

const registerData = ref({
  email: '',
  password: '',
  fullName: '',
  passwordconf: '',
});

function validatePassword(password) {
  return password.length >= 8;
}

const register = async () => {
  loading.value = true;
  errorMessage.value = '';
  message.value = '';

  if (registerData.value.password !== registerData.value.passwordconf) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.';
    loading.value = false;
    return;
  }

  if (!validatePassword(registerData.value.password)) {
    errorMessage.value = 'Le mot de passe ne respecte pas la politique de sécurité.';
    loading.value = false;
    return;
  }

  try {
    const token = await getAuthenticationToken();

    const response = await fetch('http://localhost/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: registerData.value.email,
        password: registerData.value.password,
        fullName: registerData.value.fullName,
      }),
    });

    if (!response.ok) {
      errorMessage.value = 'Une erreur est survenue lors de l\'inscription.';
      loading.value = false;
      return;
    }

    message.value = 'Inscription réussie. Redirection vers la connexion...';
    await router.push('/login');
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'inscription.';
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
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.loading {
  color: #007bff;
}

.error-message {
  color: red;
  margin-bottom: 15px;
}

.message {
  color: green;
  margin-bottom: 15px;
}
</style>
