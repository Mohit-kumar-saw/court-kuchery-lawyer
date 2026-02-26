import { api } from './api';
import { tokenStorage } from './tokenStorage';
import type { LoginCredentials, SignUpCredentials } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/lawyer/login', credentials);

    const { accessToken, refreshToken, lawyer } = response.data;

    await tokenStorage.setTokens(accessToken, refreshToken);

    return lawyer;

  },

  async signUp(credentials: SignUpCredentials) {
    const response = await api.post('/lawyer/register', credentials);

    // Note: Lawyers require admin verification, so no token is returned on register.
    // They must login after being verified.
    return response.data;
  },

  async logout() {
    await tokenStorage.clear();
  },

  async getProfile() {
    const response = await api.get('/lawyer/me');
    return response.data.lawyer;
  },

  async completeProfile(data: any) {
    const response = await api.post('/lawyer/complete-profile', data);
    return response.data.lawyer;
  },
};
