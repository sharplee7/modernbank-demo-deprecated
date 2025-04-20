import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, username, password } = body;

    if (!user_id || !username || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    const response = await apiClient("AUTH", "", "POST", {
      user_id,
      username,
      password
    });

    if (!response?.data) {
      return NextResponse.json(
        { error: '회원가입에 실패했습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    console.error('[Signup API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 