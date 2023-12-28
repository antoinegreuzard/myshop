<template>
  <div class="product-item">
    <h3>{{ product.name }}</h3>
    <p>{{ product.description }}</p>
    <p>Prix : {{ product.price }} €</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.product-item {
  border: 1px solid #ddd;
  padding: 1em;
  margin: 1em;
  border-radius: 8px;
}

.product-item h3 {
  margin-top: 0;
}
</style>
