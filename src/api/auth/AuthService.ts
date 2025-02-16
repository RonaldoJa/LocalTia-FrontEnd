import httpClient from '../HttpClient';
import { LoginPayload, RegisterPayload, AuthResponse, ResponseGeneric } from '../../core/types/Api';

export const AuthService = {
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    const response = await httpClient.post<ResponseGeneric<AuthResponse>>('auth/v1/generate-token', credentials);
    return response.data.data;
  },
  async register(userData: RegisterPayload): Promise<AuthResponse> {
    const response = await httpClient.post<ResponseGeneric<AuthResponse>>('user/v1/save', userData);
    return response.data.data;
  },
  async logout(): Promise<void> {
    const response = await httpClient.post<ResponseGeneric<void>>('/auth/logout');
    return response.data.data;
  }
};