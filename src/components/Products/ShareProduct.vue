<template>
  <div class="share-product">
    <button @click="shareOnFacebook">Partager sur Facebook</button>
    <button @click="shareOnTwitter">Partager sur Twitter</button>
    <button @click="shareByEmail">Envoyer par E-mail</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  productUrl: String,
  productName: String,
});

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${props.productUrl}`;
  window.open(url, '_blank');
};

const shareOnTwitter = () => {
  const text = `Découvrez ce produit : ${props.productName}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${props.productUrl}`;
  window.open(url, '_blank');
};

const shareByEmail = () => {
  const subject = `Regardez ce produit : ${props.productName}`;
  const body = `J'ai trouvé ce produit intéressant sur MyShop : ${props.productUrl}`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
</script>

<style scoped lang="scss">
.share-product {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken(#007bff, 10%);
    }

    &:focus {
      outline: none;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;

    button {
      width: 100%;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
