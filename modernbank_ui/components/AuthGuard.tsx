"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setUser({
            user_id: data.user_id,
            name: data.user_id
          }));
        } else if (!pathname.startsWith("/sign")) {
          // /signin이나 /signup으로 시작하는 경로는 리다이렉트하지 않음
          router.push("/signin");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (!pathname.startsWith("/sign")) {
          // /signin이나 /signup으로 시작하는 경로는 리다이렉트하지 않음
          router.push("/signin");
        }
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, dispatch, router, pathname]);

  // 인증되지 않은 상태에서도 로그인/회원가입 페이지는 보여줌
  if (!isAuthenticated && !pathname.startsWith("/sign")) {
    return null;
  }

  return <>{children}</>;
}
