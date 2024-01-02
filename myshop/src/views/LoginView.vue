<template>
  <div class="login-container">
    <h1>Connexion</h1>
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

const errorMessage = ref('');

const login = async () => {
  try {
    const response = await fetch('http://localhost/authentication_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials.value),
    });

    if (!response.ok) {
      errorMessage.value = 'Une erreur est survenue';
      return;
    }

    const dataToken = await response.json();

    const usersResponse = await fetch('http://localhost/api/users', {
      headers: {
        Authorization: `Bearer ${dataToken.token}`,
      },
    });

    if (!usersResponse.ok) {
      errorMessage.value = 'Une erreur est survenue';
      return;
    }

    const usersData = await usersResponse.json();

    const authenticatedUser = usersData['hydra:member'].find(
      (user) => user.email === credentials.value.email,
    );

    if (!authenticatedUser) {
      errorMessage.value = 'Utilisateur non trouvé';
      return;
    }

    localStorage.setItem('myshop_userToken', dataToken.token);
    localStorage.setItem('myshop_userId', authenticatedUser.id);
    window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: true } }));
    await router.push({ name: 'Home' });
  } catch (error) {
    errorMessage.value = error.message || 'Une erreur est survenue';
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

input {
  &[type="text"],
  &[type="password"] {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}

button {
  &[type="submit"] {
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
}
</style>
