<template>
  <div class="product-history">
    <h3>Historique des produits visités</h3>
    <ul>
      <li v-for="product in visitedProducts" :key="product.id">
        <a :href="`/product/${product.id}`">{{ product.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visitedProducts = ref([]);

onMounted(() => {
  visitedProducts.value = JSON.parse(localStorage.getItem('visitedProducts') || '[]');
});
</script>

<style scoped lang="scss">
.product-history {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.5rem;

      a {
        color: #646cff;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  @media (max-width: 768px) {
    // Styles pour les écrans mobiles
    margin-top: 1rem;
    padding: 0.5rem;

    h3 {
      font-size: 1.2rem;
    }

    ul {
      li {
        a {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
