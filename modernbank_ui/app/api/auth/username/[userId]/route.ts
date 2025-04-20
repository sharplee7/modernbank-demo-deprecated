import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

export const GET: RouteHandler = async (request) => {
  try {
    // URL에서 userId 추출
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const userId = pathSegments[3]; // ['api','auth','username','<userId>']

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await apiClient("AUTH", `/username/${userId}`, "GET");

    if (!response?.data) {
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("[Username API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}; 