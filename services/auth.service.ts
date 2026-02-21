import { api } from './api';
import { tokenStorage } from './tokenStorage';
import type { LoginCredentials, SignUpCredentials } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/lawyer/login', credentials);

    const { accessToken, refreshToken, lawyer } = response.data;

    await tokenStorage.setTokens(accessToken, refreshToken);

    return lawyer;
    // await new Promise((res) => setTimeout(res, 800));

    // const dummyUser = {
    //   id: "1",
    //   name: "Dummy Lawyer",
    //   email: credentials.email,
    //   specialization: "Criminal",
    //   experienceYears: "5",
    //   ratePerMinute: "10",
    // };

    // Optional: store fake tokens
    // await tokenStorage.setTokens("dummyAccessToken", "dummyRefreshToken");

    // return dummyUser;
  },

  async signUp(credentials: SignUpCredentials) {
    const response = await api.post('/auth/register', credentials);

    const { accessToken, refreshToken, user } = response.data;

    await tokenStorage.setTokens(accessToken, refreshToken);

    return user;
  },

  async logout() {
    await tokenStorage.clear();
  },

  async getProfile() {
    const response = await api.get('/lawyer/me');
    return response.data.lawyer;
  },
};
