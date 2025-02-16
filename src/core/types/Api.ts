
export interface ResponseGeneric<T = any> {
  data: T;
  error: boolean;
  message: string;
}


export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  resetCode?: string;
  enabled?: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}