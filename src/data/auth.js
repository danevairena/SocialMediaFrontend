export function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing user JSON:', error);
    return null;
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function login(user, token) {
  const userWithToken = { ...user, token };
  localStorage.setItem('user', JSON.stringify(userWithToken));
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}