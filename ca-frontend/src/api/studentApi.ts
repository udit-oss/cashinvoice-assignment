import api from './axiosConfig';
import { Student } from '../types';

export const studentApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (student: Partial<Student>): Promise<Student> => {
    const response = await api.post('/students', student);
    return response.data;
  },

  update: async (id: number, student: Partial<Student>): Promise<Student> => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  }
};