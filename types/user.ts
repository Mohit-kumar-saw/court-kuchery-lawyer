/**
 * Shared user and auth types
 */

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string[],
  experienceYears?: number,
  ratePerMinute?: number,
  profileCompleted: boolean;
  barCouncilId?: string;
  bio?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type CompleteProfileData = {
  specialization: string[];
  experienceYears: number;
  ratePerMinute: number;
  bio: string;
  barCouncilId: string;
};

export type Lawyer = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rate: string;
  rating: number;
  image: any;
  about: string;
};

