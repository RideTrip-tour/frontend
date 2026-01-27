import type { User } from "./user";

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type RefreshResponse = {
  token: string;
  user?: User;
};
