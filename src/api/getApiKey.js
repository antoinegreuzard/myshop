/**
 * Récupère un jeton d'authentification à partir d'un service d'authentification.
 * Utilise des variables d'environnement pour les identifiants d'administration.
 *
 * @return {Promise<string|null>} Un jeton d'authentification ou null en cas d'échec.
 */
async function getAuthenticationToken() {
  // Les identifiants sont stockés dans des variables d'environnement pour la sécurité.
  const credentials = {
    email: import.meta.env.VITE_ADMIN_EMAIL,
    password: import.meta.env.VITE_ADMIN_PASS,
  };

  try {
    // Envoi d'une requête POST au service d'authentification.
    const response = await fetch('http://localhost/authentication_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Traitement de la réponse JSON et extraction du jeton.
    const data = await response.json();
    if (data.token) {
      return data.token;
    }
    return null;
  } catch (error) {
    // Gestion des erreurs de la requête (renvoie null).
    return null;
  }
}

// Exportation de la fonction pour une utilisation dans d'autres parties de l'application.
export default getAuthenticationToken;
