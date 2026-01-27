export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};
