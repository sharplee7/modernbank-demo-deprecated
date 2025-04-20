import { NextRequest, NextResponse } from 'next/server';
import apiClient from "@/utils/apiClient";

interface AuthResponse {
  isAuthenticated: boolean;
  user?: {
    user_id: string;
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { isAuthenticated: false, error: '사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    // 서버에 인증 상태 확인 요청
    await apiClient("AUTH", "/check", "GET", undefined, {
      'x-user-id': userId
    });

    // 서버 응답이 성공적이면 인증된 것으로 간주
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        user_id: userId
      }
    });

  } catch (error) {
    console.error('[Auth Check] Error:', error);
    return NextResponse.json(
      { isAuthenticated: false, error: '인증 확인에 실패했습니다.' },
      { status: 401 }
    );
  }
}

interface UserData {
  cstmId: string;
  cstmNm: string;
  cstmTlno: string;
  cstmMlAddr: string;
}

interface ErrorResponse {
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UserData | ErrorResponse>> {
  try {
    const body = await request.json();
    const { cstmId } = body;

    if (!cstmId) {
      return NextResponse.json({ message: "고객 ID가 필요합니다." }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/customer/details/${cstmId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json({ message }, { status: 500 });
  }
} 