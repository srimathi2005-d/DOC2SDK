import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const apiService = {
  analyzeDocs: async (url, useCase, language) => {
    const response = await axios.post(`${API_BASE}/analyze`, { url, useCase, language });
    return response.data.data; // returns structured API data
  },
  
  generateSDK: async (apiData, language, useCase) => {
    const response = await axios.post(`${API_BASE}/generate`, { apiData, language, useCase });
    return response.data; // returns { data: generationData, downloadPath: string }
  }
};
