export interface Users {
  id: string;
  rut: number;
  username: string;
  email: string;
  pnombre: string;
  apellido: string;
  carrera: string;
  isactive: boolean;
}

export interface NewUser {
  username: string;
  rut: number;
  email: string;
  pnombre: string;
  apellido: string;
  carrera: string;
  password: string;
}

export interface UpdateUserProfile {
  username: string;
  rut: number;
  email: string;
  pnombre: string;
  apellido: string;
  carrera: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Users;
}
