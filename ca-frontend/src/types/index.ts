export interface User {
  user_id: number;
  email: string;
  role: string;
}

export interface Student {
  student_id: number;
  name: string;
  email: string;
  age?: number;
  course: string;
  status: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}