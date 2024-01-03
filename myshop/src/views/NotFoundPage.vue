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
    margin-top: 5rem;
    color: #333;

    h1 {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #007bff;
    }

    p {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    router-link {
        display: inline-block;
        padding: 10px 15px;
        border: 1px solid #007bff;
        border-radius: 4px;
        color: #007bff;
        text-decoration: none;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
            background-color: #007bff;
            color: white;
            text-decoration: none;
        }
    }
}

</style>
