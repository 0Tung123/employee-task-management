const API_BASE = import.meta.env.VITE_API_BASE;

export const loginWithEmail = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const signupWithEmail = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/signup/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};