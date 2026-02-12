import api from './axiosConfig';
import { LoginRequest, LoginResponse } from '../types';

const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};

export default authApi;