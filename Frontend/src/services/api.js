const BASE_URL = 'http://localhost:5000';

// Uploading document for analysis
export const uploadDocument = async (formData, token) => {
  const res = await fetch(`${BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    headers: { 
      // Do NOT set Content-Type for FormData; fetch sets it automatically
      Authorization: 'Bearer ' + token 
    },
    body: formData,
  });
  return res.json();
};

// Retrieval of history
export const getHistory = async (token) => {
  const res = await fetch(`${BASE_URL}/api/v1/documents/history`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
  return res.json();
};

// Authorization APIs
export const getGoogleAuthURL = () => `${BASE_URL}/auth/google`;
export const getGitHubAuthURL = () => `${BASE_URL}/auth/github`;

export default BASE_URL;