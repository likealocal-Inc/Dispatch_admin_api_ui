export interface UserModel {
  id: number;

  email: string;

  company: string;

  phone: string;

  password: string;

  isActive: boolean;

  role: string;

  created: Date;

  updated: Date;
}
