import { NextRequest, NextResponse } from 'next/server';
import apiClient from "@/utils/apiClient";

interface LoginRequest {
  user_id: string;
  password: string;
}

interface LoginResponse {
  user_id: string;
  userName: string;
  cstmTlno: string;
  cstmMlAddr: string;
}

interface ErrorResponse {
  message: string;
}

interface ValidationError {
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      details?: ValidationError[];
    };
    status?: number;
  };
  message?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse | ErrorResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { user_id, password } = body;

    if (!user_id || !password) {
      return NextResponse.json({ message: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const response = await apiClient("AUTH", "/login", "POST", {
      user_id: user_id,
      password: password,
    });

    if (!response.data) {
      return NextResponse.json({ message: "로그인에 실패했습니다." }, { status: 401 });
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Login error:", error);
    const apiError = error as ApiError;
    const errorMessages = apiError.response?.data?.details?.map((err: ValidationError) => err.message).join('\n');
    const message = errorMessages || "서버 오류가 발생했습니다.";
    return NextResponse.json({ message }, { status: apiError.response?.status || 500 });
  }
} 