<template>
  <!-- Pied de page avec un design centré et des informations sur la boutique -->
  <footer class="footer">
    <div class="footer-content container">
      <!-- Section du pied de page avec titre et description de la boutique -->
      <section class="footer-section">
        <h3>MyShop</h3>
        <p>
          Explorez notre large gamme de produits
          et profitez d'une expérience d'achat exceptionnelle.
        </p>
        <!-- Lien de déconnexion affiché uniquement si l'utilisateur est authentifié -->
        <router-link v-if="isAuthenticated" :to="{ name: 'Logout' }">Déconnexion</router-link>
      </section>
    </div>

    <!-- Zone inférieure du pied de page avec droits d'auteur -->
    <div class="footer-bottom">
      <p>&copy; 2023 MyShop - Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Référence réactive pour suivre le statut d'authentification de l'utilisateur
const isAuthenticated = ref(false);

// Fonction pour mettre à jour le statut d'authentification
const updateAuthStatus = (event) => {
  isAuthenticated.value = event.detail.isLoggedIn;
};

// Écouteur d'événement pour les changements d'authentification
onMounted(() => {
  window.addEventListener('auth-change', updateAuthStatus);
});

// Suppression de l'écouteur d'événement lors du démontage du composant
onUnmounted(() => {
  window.removeEventListener('auth-change', updateAuthStatus);
});
</script>

<style scoped lang="scss">
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1em 0;

  &-content {
    display: flex;
    justify-content: space-around;
    padding: 1em;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &-section {
    h3 {
      margin-bottom: 0.5em;
      font-family: 'Georgia', serif;
    }

    p {
      margin-bottom: 1em;
    }

    a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: #646cff;
      }
    }

    ul {
      list-style: none;
      padding: 0;

      li a {
        color: white;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: #646cff;
        }
      }
    }
  }

  &-bottom {
    margin-top: 1em;
    font-size: 0.8em;

    @media only screen and (max-width: 768px) {
      font-size: 1em;
    }
  }
}
</style>
