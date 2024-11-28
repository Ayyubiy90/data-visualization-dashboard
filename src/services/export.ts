import axios from 'axios';

const EXPORT_API_URL = 'https://api.example.com/export'; // Replace with the actual export API URL

import { DataPoint } from '../types/data';

export const exportDataToCloud = async (data: DataPoint[]) => {
  try {
    const response = await axios.post(EXPORT_API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error exporting data to cloud:', error);
    throw error;
  }
};
