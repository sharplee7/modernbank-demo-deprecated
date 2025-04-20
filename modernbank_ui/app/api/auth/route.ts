import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/utils/apiClient";

interface AuthResponse {
  isAuthenticated: boolean;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, password } = body;

    if (!user_id || !password) {
      return NextResponse.json(
        { error: '사용자 ID와 비밀번호가 필요합니다.' },
        { status: 400 }
      );
    }

    const response = await apiClient("AUTH", "/login", "POST", {
      user_id,
      password,
    });

    if (!response?.data) {
      return NextResponse.json(
        { error: '로그인에 실패했습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    console.error('[Auth API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({
        isAuthenticated: false,
        message: '인증되지 않은 사용자입니다.'
      }, {
        status: 401
      });
    }

    return NextResponse.json({
      isAuthenticated: true
    });
  } catch (error) {
    console.error('[Auth] Error:', error);
    return NextResponse.json({
      isAuthenticated: false,
      message: '인증 확인에 실패했습니다.'
    }, {
      status: 500
    });
  }
}
