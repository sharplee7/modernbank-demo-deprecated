import { NextResponse } from "next/server";
import apiClient from "@/utils/apiClient";
import { NextRequest } from 'next/server';
import { z } from "zod";

// 이체 한도 등록 스키마
const transferLimitSchema = z.object({
  cstmId: z.string().min(1, "고객 ID는 필수입니다"),
  oneTmTrnfLmt: z.number().min(0, "1회 이체 한도는 0 이상이어야 합니다"),
  oneDyTrnfLmt: z.number().min(0, "1일 이체 한도는 0 이상이어야 합니다")
});

// 이체 내역 스키마 (당행/타행 공통)
const transferHistorySchema = z.object({
  cstmId: z.string().min(1, "고객 ID는 필수입니다"),
  seq: z.number().optional(),
  divCd: z.string().optional(),
  stsCd: z.string().optional(),
  dpstAcntNo: z.string().min(1, "입금 계좌번호는 필수입니다"),
  wthdAcntNo: z.string().min(1, "출금 계좌번호는 필수입니다"),
  wthdAcntSeq: z.number().optional(),
  sndMm: z.string().optional(),
  rcvMm: z.string().optional(),
  rcvCstmNm: z.string().optional(),
  trnfAmt: z.number().min(1, "이체 금액은 1원 이상이어야 합니다"),
  trnfDtm: z.string().optional()
});

interface TransferResponse {
  fromAcntNo: string;
  toAcntNo: string;
  trnsAmt: number;
  formerBlnc: number;
  acntBlnc: number;
}

interface ErrorResponse {
  message: string;
  details?: unknown;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const customerId = searchParams.get("customerId");

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  try {
    let response;
    switch (path) {
      case "limits":
        if (!customerId) {
          return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        }
        response = await apiClient("TRANSFER", `/limits/${customerId}`, "GET");
        break;
      case "limits-available":
        if (!customerId) {
          return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        }
        response = await apiClient("TRANSFER", `/limits/${customerId}/available`, "GET");
        break;
      case "history":
        if (!customerId) {
          return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        }
        response = await apiClient("TRANSFER", `/history/${customerId}`, "GET");
        break;
      default:
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('[Transfer API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<TransferResponse | ErrorResponse>> {
  try {
    const body = await request.json();
    const { type } = body;

    // 요청 타입에 따라 다른 처리
    if (type === "limits") {
      // 이체 한도 등록
      try {
        const validatedData = transferLimitSchema.parse(body);
        const response = await apiClient("TRANSFER", "/limits", "POST", validatedData);
        return NextResponse.json(response.data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ 
            message: "유효성 검증 실패", 
            details: error.errors 
          }, { status: 400 });
        }
        throw error;
      }
    } else if (type === "internal") {
      // 당행 이체
      try {
        const validatedData = transferHistorySchema.parse(body);
        const response = await apiClient("TRANSFER", "/internal", "POST", validatedData);
        return NextResponse.json(response.data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ 
            message: "유효성 검증 실패", 
            details: error.errors 
          }, { status: 400 });
        }
        throw error;
      }
    } else if (type === "external") {
      // 타행 이체
      try {
        const validatedData = transferHistorySchema.parse(body);
        const response = await apiClient("TRANSFER", "/external", "POST", validatedData);
        return NextResponse.json(response.data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ 
            message: "유효성 검증 실패", 
            details: error.errors 
          }, { status: 400 });
        }
        throw error;
      }
    } else {
      // 일반 이체 (기존 코드)
      const { fromAcntNo, toAcntNo, trnsAmt } = body;

      if (!fromAcntNo || !toAcntNo || !trnsAmt) {
        return NextResponse.json({ message: "모든 필드를 입력해주세요." }, { status: 400 });
      }

      const response = await fetch(`${process.env.API_BASE_URL}/api/v1/account/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("이체에 실패했습니다.");
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json({ message }, { status: 500 });
  }
} 