async function getAuthenticationToken() {
  const credentials = {
    email: import.meta.env.VITE_ADMIN_EMAIL,
    password: import.meta.env.VITE_ADMIN_PASS,
  };

  try {
    const response = await fetch('http://localhost/authentication_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.token) {
      return data.token;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export default getAuthenticationToken;
