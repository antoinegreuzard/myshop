<template>
    <div class="not-found">
        <h1>404</h1>
        <p>Désolé, la page que vous cherchez n'existe pas.</p>
        <router-link :to="{ name: 'Home' }">Retour à l'accueil</router-link>
    </div>
</template>

<style scoped lang="scss">
.not-found {
    text-align: center;
    padding: 2rem;

    h1 {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
}
</style>
