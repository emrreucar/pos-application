export type AuthState = {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
};
