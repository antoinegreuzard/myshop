<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Désolé, la page que vous cherchez n'existe pas.</p>
    <router-link :to="{ name: 'Home' }">Retour à l'accueil</router-link>
  </div>
</template>

<script setup>
// Pas besoin de logique spécifique ici
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
}

.not-found h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found p {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
