
const BASE_URL = 'http://localhost:5000';

// export const loginUser = async (email, password) => {
//   const res = await fetch(`${BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });
//   return res.json();
// };

// export const signupUser = async (name, email, password) => {
//   const res = await fetch(`${BASE_URL}/auth/signup`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name, email, password }),
//   });
//   return res.json();
// };


// uploading document
export const uploadDocument = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: formData,
  });
  return res.json();
};

// retreival of problematic clauses
export const getDocumentAnalysis = async (documentId, token) => {
  const res = await fetch(`${BASE_URL}/api/v1/documents/${documentId}/analysis`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
  return res.json();
};


// authorization apis
export const getGoogleAuthURL = () => `${BASE_URL}/auth/google`;
export const getGitHubAuthURL = () => `${BASE_URL}/auth/github`;

export default BASE_URL;
