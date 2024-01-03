# MyShop

## Description

MyShop est une application e-commerce développée avec Vue.js. Elle propose une expérience
utilisateur enrichie pour la navigation, la gestion et l'achat de produits.

## Fonctionnalités

- Authentification et gestion des comptes utilisateurs.
- Interface administrateur pour la gestion des produits, catégories et utilisateurs.
- Affichage détaillé des produits avec options de recherche et de filtrage.

## Installation

### Prérequis

- Node.js
- npm, yarn ou pnpm

### Étapes d'installation

1. Clonez le dépôt :
   ```
   git clone https://github.com/antoinegreuzard/myshop
   cd myshop
   ```

2. Installez les dépendances :
   Avec npm:
   ```bash
   npm install
   ```
   Avec yarn:
   ```bash
   yarn install
   ```
   Avec pnpm:
   ```bash
   pnpm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` à la racine du projet et configurez les variables d'environnement
   nécessaires.

## Démarrage

Pour lancer l'application en mode développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## Structure du Projet

- `src/views` : Composants Vue pour les pages.
- `src/components` : Composants réutilisables.
- `src/router` : Configuration des routes.
- `src/api` : Gestion des appels API.

## Routes Principales

- `/` : Page d'accueil
- `/product/:id` : Détails du produit
- `/login` : Page de connexion
- `/register` : Page pour la création d'un compte
- `/account` : Compte utilisateur
- `/admin/products` : Administration des produits
- `/admin/categories` : Administration des catégories
- `/admin/users` : Administration des utilisateurs

## Contribution

Les contributions sont bienvenues. N'hésitez pas à forker le projet, à créer des branches, à
soumettre des Pull Requests, et à envoyer des suggestions pour améliorer l'application.

## Licence

[MIT](https://opensource.org/licenses/MIT)
