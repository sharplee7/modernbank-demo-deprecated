import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

export async function GET(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const cstmId = pathSegments[3]; // ['api','cqrs','customers','<cstmId>','details']

    if (!cstmId) {
      return NextResponse.json(
        { error: "고객 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await apiClient("CQRS", `/customers/${cstmId}/details`, "GET");
    
    if (!response?.data) {
      return NextResponse.json(
        { error: "고객 상세 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("[Customer Details API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 