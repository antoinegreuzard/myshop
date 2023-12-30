<template>
  <div class="login-container">
    <h1>Créer son compte</h1>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
const errorMessage = ref('');

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
  errorMessage.value = '';

  if (registerData.value.password !== registerData.value.passwordconf) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  if (!validatePassword(registerData.value.password)) {
    errorMessage.value = 'Le mot de passe ne respecte pas la politique de sécurité.';
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
      throw new Error('Erreur lors de la création du compte');
    }

    await router.push('/login');
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'inscription.';
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

.error-message {
  color: red;
  margin-bottom: 15px;
}
</style>
