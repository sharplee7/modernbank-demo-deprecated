import { NextRequest, NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';
import { z } from 'zod';

// 고객 스키마 정의
const accountSchema = z.object({
  acntNo: z.string().min(1, "계좌번호는 필수입니다"),
  cstmId: z.string().min(1, "고객 ID는 필수입니다"),
  cstmNm: z.string().min(1, "고객명은 필수입니다"),
  acntNm: z.string().min(1, "계좌명은 필수입니다"),
  newDtm: z.string().optional(),
  acntBlnc: z.number().min(0, "계좌 잔액은 0 이상이어야 합니다").optional(),
});

const customerSchema = z.object({
  cstmId: z.string().min(1, "고객 ID는 필수입니다"),
  cstmNm: z.string().min(1, "고객명은 필수입니다"),
  cstmAge: z.string().optional(),
  cstmGnd: z.string().optional(),
  cstmPn: z.string().optional(),
  cstmAdr: z.string().optional(),
  oneTmTrnfLmt: z.number().min(0).optional(),
  oneDyTrnfLmt: z.number().min(0).optional(),
  accounts: z.array(accountSchema).optional(),
});

// GET - Retrieve basic customer information
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId") || userId;
    const action = searchParams.get("action");

    if (!customerId) {
      return NextResponse.json(
        { error: '고객 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    let response;
    if (action === "exists") {
      // 고객 존재 여부 확인
      response = await apiClient("CUSTOMER", `/${customerId}/exists`, "GET", {}, {
        'Content-Type': 'application/json'
      });
    } else if (action === "details") {
      // 상세 고객 정보 조회
      response = await apiClient("CUSTOMER", `/${customerId}/details`, "GET", {}, {
        'Content-Type': 'application/json'
      });
    } else {
      // 기본 고객 정보 조회
      response = await apiClient("CUSTOMER", `/${customerId}`, "GET", {}, {
        'Content-Type': 'application/json'
      });
    }

    if (!response?.data && action !== "exists") {
      return NextResponse.json(
        { error: action === "details" ? '고객 상세 정보를 찾을 수 없습니다.' : '고객 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    console.error('[Customer API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Register a new customer
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    
    // 데이터 유효성 검사 추가
    try {
      const validatedData = customerSchema.parse(body);
      
      // ID가 헤더에만 있고 body에 없는 경우 추가
      if (!validatedData.cstmId && userId) {
        validatedData.cstmId = userId;
      }
      
      const response = await apiClient("CUSTOMER", "/", "POST", validatedData, {
        'Content-Type': 'application/json'
      });

      if (!response?.data) {
        return NextResponse.json(
          { error: '고객 등록에 실패했습니다.' },
          { status: 400 }
        );
      }

      return NextResponse.json(response.data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message).join('\n');
        return NextResponse.json(
          { error: errorMessages, details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

  } catch (error: unknown) {
    console.error('[Customer API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// HEAD - Check customer existence
export async function HEAD(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId") || userId;

    if (!customerId) {
      return NextResponse.json(
        { error: '고객 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const response = await apiClient("CUSTOMER", `/${customerId}/exists`, "GET", {}, {
      'Content-Type': 'application/json'
    });

    if (!response?.data) {
      return NextResponse.json(
        { error: '고객 존재 여부 확인에 실패했습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    console.error('[Customer API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// OPTIONS - Retrieve detailed customer information
export async function OPTIONS(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId") || userId;

    if (!customerId) {
      return NextResponse.json(
        { error: '고객 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const response = await apiClient("CUSTOMER", `/${customerId}/details`, "GET", {}, {
      'Content-Type': 'application/json'
    });

    if (!response?.data) {
      return NextResponse.json(
        { error: '고객 상세 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    console.error('[Customer API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update customer
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    // 데이터 유효성 검사 추가
    try {
      const validatedData = customerSchema.partial().parse(body);
      
      const response = await apiClient("CQRS", "/customer/", "PUT", validatedData, {
        'x-user-id': userId
      });

      if (!response?.data) {
        return NextResponse.json(
          { error: '고객 정보 수정에 실패했습니다.' },
          { status: 400 }
        );
      }

      return NextResponse.json(response.data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => err.message).join('\n');
        return NextResponse.json(
          { error: errorMessages, details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

  } catch (error: unknown) {
    console.error('[Customer API] Error:', error);
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
    const customerId = request.nextUrl.searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { error: "고객 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await apiClient("CQRS", `/customer/${customerId}`, "DELETE");
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