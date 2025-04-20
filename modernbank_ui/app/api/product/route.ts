import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import apiClient from "@/utils/apiClient";

// 상품 생성 요청 스키마 정의
const productSchema = z.object({
  id: z.string().min(1, "상품 ID는 필수입니다"),
  name: z.string().min(1, "상품명은 필수입니다"),
  description: z.string().min(1, "상품 설명은 필수입니다"),
  interestRate: z.number().min(0, "이자율은 0 이상이어야 합니다"),
  currency: z.string().min(1, "통화는 필수입니다"),
});

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    const response = await apiClient("PRODUCT", "", "GET", undefined, {
      'x-user-id': userId
    });

    if (!response?.data) {
      return NextResponse.json(
        { error: '상품 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('[Product API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Received request body:", body);
    
    // 요청 데이터 검증
    const validatedData = productSchema.parse(body);
    console.log("Validated data:", validatedData);

    // API Client를 사용하여 PRODUCT 서비스로 요청 전송
    console.log("Sending request to PRODUCT service...");
    const { data } = await apiClient(
      "PRODUCT",
      "/",
      "POST",
      validatedData,
      { 'x-user-id': userId }
    );
    console.log("Received response data:", data);

    return NextResponse.json(
      { message: "상품이 성공적으로 생성되었습니다", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed error:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "잘못된 요청 데이터입니다", errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error("상품 생성 중 오류 발생:", error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "서버 오류가 발생했습니다",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 