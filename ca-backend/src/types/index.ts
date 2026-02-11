export interface User {
  user_id: number;
  email: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface Student {
  student_id: number;
  name: string;
  email: string;
  age?: number;
  course: string;
  status: string;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  user_id: number;
  email: string;
  role: string;
}