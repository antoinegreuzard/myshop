<template>
  <footer class="footer">
    <div class="footer-content">
      <section class="footer-section">
        <h3>MyShop</h3>
        <p>
        Explorez notre large gamme de produits et profitez d'une expérience d'achat exceptionnelle.
        </p>
      </section>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2023 MyShop - Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script setup>
// Logique JavaScript si nécessaire
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1em 0;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  padding: 1em;
}

.footer-section h3 {
  margin-bottom: 0.5em;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #646cff;
}

.footer-bottom {
  margin-top: 1em;
  font-size: 0.8em;
}
</style>
