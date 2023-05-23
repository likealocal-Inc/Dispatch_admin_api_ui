import { Gender, Role, User } from '@prisma/client';

export class CUserEntity implements User {
  id: number;
  created: Date;
  updated: Date;

  company: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  password: string;

  gender: Gender;
  isActive: boolean;
  profileImgId: number;
  role: Role;
}
