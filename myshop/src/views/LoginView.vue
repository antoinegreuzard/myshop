<template>
  <div class="login-container">
    <h1>Connexion</h1>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="message" class="message">{{ message }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Email de l'utilisateur:</label>
        <input type="text" id="username" v-model="credentials.email" required>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="credentials.password" required>
      </div>
      <button type="submit">Connexion</button>
    </form>

    <router-link :to="{name: 'Register'}">Créer un compte</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const credentials = ref({
  email: '',
  password: '',
});

const loading = ref(false);
const message = ref('');
const error = ref('');

const login = async () => {
  loading.value = true;
  message.value = '';
  error.value = '';

  try {
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

.error {
  color: red;
  margin-top: 10px;
}

.message {
  color: green;
  margin-top: 10px;
}
</style>
