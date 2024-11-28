import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with the actual API base URL

export const fetchDataFromAPI = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
};

export const fetchDashboardData = async () => {
  return await fetchDataFromAPI('dashboard-data'); // Replace with the actual endpoint
};
