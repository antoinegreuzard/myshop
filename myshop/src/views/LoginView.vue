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
  </div>
</template>

<script>

export default {
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost/authentication_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.credentials),
        });

        if (!response.ok) {
          throw new Error('Erreur de connexion');
        }

        const data = await response.json();
        localStorage.setItem('userToken', data.token);
        window.dispatchEvent(new CustomEvent('auth-change', { detail: { isLoggedIn: true } }));
        this.$router.push({ name: 'Home' });
      } catch (error) {
        this.errorMessage = error.message || 'Une erreur est survenue';
      }
    },
  },
};
</script>

<style scoped>
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
}

button[type="submit"]:hover {
  background-color: #555;
}
</style>
