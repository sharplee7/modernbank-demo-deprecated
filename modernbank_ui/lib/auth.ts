import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import apiClient from "@/utils/apiClient";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user_id: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.user_id || !credentials?.password) {
            throw new Error("아이디와 비밀번호를 입력해주세요.");
          }

          const response = await apiClient("AUTH", "", "POST", {
            user_id: credentials.user_id,
            password: credentials.password
          });

          if (!response?.data) {
            throw new Error("로그인에 실패했습니다.");
          }

          return {
            id: credentials.user_id,
            name: response.data.username,
            user_id: credentials.user_id
          };
        } catch (error: unknown) {
          console.error("[NextAuth] Error:", error);
          const errorMessage = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user_id = user.user_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.user_id = token.user_id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
    error: "/signin"
  },
  session: {
    strategy: "jwt",
  },
}; 