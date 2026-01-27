export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateProfileDto = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};
