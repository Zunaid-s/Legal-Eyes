
const BASE_URL = 'https://legal-ai-livid-six.vercel.app';

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const signupUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

export const uploadDocument = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: formData,
  });
  return res.json();
};

export const getGoogleAuthURL = () => `${BASE_URL}/auth/google`;

export default BASE_URL;
