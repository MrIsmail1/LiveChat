import { LoginSchema, RegisterSchema } from "@/schemas/authSchema";
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajout d'intercepteurs pour le débogage
api.interceptors.request.use(request => {
  console.log('Starting Request', {
    url: request.url,
    method: request.method,
    data: request.data
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (data: LoginSchema) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterSchema) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export default api;