import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      user_id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    user_id: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    user_id: string;
  }
}

export interface User {
  user_id: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
} 