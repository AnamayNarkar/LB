import axios from 'axios';
import type { User, PointHistory, ClaimPointsResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Include credentials for CORS requests
});

export const apiService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    console.log('Fetching users from API');
    const response = await api.get('/api/users');
    console.log('Users fetched successfully:', response.data);
    return response.data;
  },

  // Create a new user
  createUser: async (name: string): Promise<User> => {
    const response = await api.post('/api/users', { name });
    return response.data;
  },

  // Claim points for a user
  claimPoints: async (userId: string): Promise<ClaimPointsResponse> => {
    const response = await api.post('/api/users/claim', { userId });
    return response.data;
  },

  // Get point history
  getPointHistory: async (userId?: string): Promise<PointHistory[]> => {
    const url = userId ? `/api/users/history/${userId}` : '/api/users/history';
    const response = await api.get(url);
    return response.data;
  },
};

export default apiService;
