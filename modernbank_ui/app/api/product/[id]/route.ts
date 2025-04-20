import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';
import { z } from "zod";

// 상품 수정 요청 스키마 정의
const productSchema = z.object({
  id: z.string().min(1, "상품 ID는 필수입니다"),
  name: z.string().min(1, "상품명은 필수입니다"),
  description: z.string().min(1, "상품 설명은 필수입니다"),
  interestRate: z.number().min(0, "이자율은 0 이상이어야 합니다"),
  currency: z.string().min(1, "통화는 필수입니다"),
});

export async function GET(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const id = pathSegments[2]; // ['api','product','<id>']

    if (!id) {
      return NextResponse.json(
        { error: "상품 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await apiClient("PRODUCT", `/${id}`, "GET");
    
    if (!response?.data) {
      return NextResponse.json(
        { error: "상품 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("[Product API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const id = pathSegments[2]; // ['api','product','<id>']

    if (!id) {
      return NextResponse.json(
        { error: "상품 ID가 필요합니다." },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log("PUT request body:", body);
    
    // 요청 데이터 검증
    const validatedData = productSchema.parse(body);
    console.log("Validated data:", validatedData);

    // 요청한 ID와 바디의 ID가 일치하는지 확인
    if (id !== validatedData.id) {
      return NextResponse.json(
        { error: "URL의 ID와 요청 본문의 ID가 일치하지 않습니다." },
        { status: 400 }
      );
    }

    const response = await apiClient("PRODUCT", `/${id}`, "PUT", validatedData);
    
    if (!response?.data) {
      return NextResponse.json(
        { error: "상품 수정에 실패했습니다." },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: "상품이 성공적으로 수정되었습니다.", 
      data: response.data 
    });
  } catch (error: unknown) {
    console.error("[Product API - PUT] Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "잘못된 요청 데이터입니다", errors: error.errors },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const id = pathSegments[2]; // ['api','product','<id>']

    if (!id) {
      return NextResponse.json(
        { error: "상품 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await apiClient("PRODUCT", `/${id}`, "DELETE");
    
    if (!response?.data) {
      return NextResponse.json(
        { error: "상품 삭제에 실패했습니다." },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: "상품이 성공적으로 삭제되었습니다.",
      data: response.data 
    });
  } catch (error: unknown) {
    console.error("[Product API - DELETE] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 