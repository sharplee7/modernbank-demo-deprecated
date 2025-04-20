import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    const response = await apiClient("CQRS", "/customers", "GET", undefined, {
      'x-user-id': userId
    });

    if (!response?.data) {
      return NextResponse.json(
        { error: '고객 목록을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    console.error('[Customers CQRS API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 