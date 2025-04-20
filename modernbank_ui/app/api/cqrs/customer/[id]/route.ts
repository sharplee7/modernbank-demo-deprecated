import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';


// GET customer by ID
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1]; // URL 경로에서 id 추출
    
    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: '고객 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const response = await apiClient("CQRS", `/${id}/details`, "GET", undefined, {
      'x-user-id': userId
    });

    if (!response?.data) {
      return NextResponse.json(
        { error: '고객 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    console.error('[Customer CQRS API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE customer
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const id = segments[segments.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { error: "고객 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await apiClient("CQRS", `/customer/${id}`, "DELETE");
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("[Customer DELETE] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 