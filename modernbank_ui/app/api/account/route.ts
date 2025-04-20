import { NextRequest, NextResponse } from "next/server";
import apiClient from "@/utils/apiClient";
import { z } from "zod";

// 계좌 생성 요청 스키마 정의
const accountSchema = z.object({
  acntNo: z.string().min(1, "계좌번호는 필수입니다"),
  cstmId: z.string().min(1, "고객 ID는 필수입니다"),
  cstmNm: z.string().min(1, "고객명은 필수입니다"),
  acntNm: z.string().min(1, "계좌명은 필수입니다"),
  newDtm: z.string().optional(),
  acntBlnc: z.number().min(0, "계좌 잔액은 0 이상이어야 합니다").optional(),
});

// 거래 요청 스키마 정의 (입금/출금 공통)
const transactionSchema = z.object({
  acntNo: z.string().min(1, "계좌번호는 필수입니다"),
  seq: z.number().default(0),
  divCd: z.string().default("D"),
  stsCd: z.string().default("C"),
  trnsAmt: z.number().min(1, "거래금액은 1원 이상이어야 합니다"),
  acntBlnc: z.number().min(0, "계좌 잔액은 0 이상이어야 합니다"),
  trnsBrnch: z.string().default(""),
  trnsDtm: z.string().optional(),
});

// 타행 이체 확인 스키마 정의
const confirmWithdrawalSchema = z.object({
  acntNo: z.string().min(1, "계좌번호는 필수입니다"),
  seq: z.number(),
  divCd: z.string(),
  stsCd: z.string().refine(
    val => val === "1" || val === "2", 
    {
      message: "상태 코드는 '1'(확인) 또는 '2'(취소)만 가능합니다"
    }
  ),
  trnsAmt: z.number().min(1, "거래금액은 1원 이상이어야 합니다"),
  acntBlnc: z.number().min(0, "계좌 잔액은 0 이상이어야 합니다"),
  trnsBrnch: z.string(),
  trnsDtm: z.string().optional(),
});

interface ValidationError {
  message: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const customerId = searchParams.get("customerId");
  const accountNo = searchParams.get("accountNo");

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  try {
    let response;
    switch (path) {
      case "accounts":
        if (!customerId) {
          return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        }
        response = await apiClient("ACCOUNT", `/customer/${customerId}/accounts`, "GET");
        break;
      case "account":
        if (!accountNo) {
          return NextResponse.json({ error: "Account number is required" }, { status: 400 });
        }
        response = await apiClient("ACCOUNT", `/${accountNo}`, "GET");
        break;
      case "balance":
        if (!accountNo) {
          return NextResponse.json({ error: "Account number is required" }, { status: 400 });
        }
        response = await apiClient("ACCOUNT", `/${accountNo}/balance`, "GET");
        return NextResponse.json(response.data);
      case "transactions":
        if (!accountNo) {
          return NextResponse.json({ error: "Account number is required" }, { status: 400 });
        }
        response = await apiClient("ACCOUNT", `/${accountNo}/transactions`, "GET");
        break;
      default:
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    // 요청 타입에 따라 다른 처리
    if (type === "deposit") {
      // 입금 요청 처리
      const validatedData = transactionSchema.parse({
        acntNo: body.accountNo,
        trnsAmt: body.amount,
        acntBlnc: body.currentBalance || 0,
        trnsDtm: new Date().toISOString(),
        divCd: "D", // 입금 구분 코드
        stsCd: "C", // 완료 상태 코드
        seq: 0,
        trnsBrnch: body.branch || "",
      });

      const response = await apiClient("ACCOUNT", "/deposits/", "POST", validatedData);
      return NextResponse.json(response.data);
    } else if (type === "withdrawal") {
      // 출금 요청 처리
      const validatedData = transactionSchema.parse({
        acntNo: body.accountNo,
        trnsAmt: body.amount,
        acntBlnc: body.currentBalance || 0,
        trnsDtm: new Date().toISOString(),
        divCd: "W", // 출금 구분 코드
        stsCd: body.isOtherBankTransfer ? "0" : "1", // 타행 이체면 대기 상태(0), 당행이체면 성공 상태(1)
        seq: 0,
        trnsBrnch: body.branch || "",
      });

      const response = await apiClient("ACCOUNT", "/withdrawals/", "POST", validatedData);
      return NextResponse.json(response.data);
    } else if (type === "withdrawal-confirm") {
      // 타행 이체 결과 확인 처리
      const validatedData = confirmWithdrawalSchema.parse({
        acntNo: body.accountNo,
        seq: body.seq || 0,
        divCd: body.divCd || "W",
        stsCd: body.stsCd, // "1"(확인) 또는 "2"(취소)만 허용
        trnsAmt: body.amount,
        acntBlnc: body.currentBalance || 0,
        trnsBrnch: body.branch || "",
        trnsDtm: body.trnsDtm || new Date().toISOString(),
      });

      const response = await apiClient("ACCOUNT", "/withdrawals/confirm/", "POST", validatedData);
      return NextResponse.json(response.data);
    } else {
      // 계좌 생성 요청 처리
      const validatedData = accountSchema.parse(body);

      // 현재 시간을 newDtm으로 설정 (없는 경우)
      if (!validatedData.newDtm) {
        validatedData.newDtm = new Date().toISOString();
      }

      // 초기 잔액 설정 (없는 경우)
      if (validatedData.acntBlnc === undefined) {
        validatedData.acntBlnc = 0;
      }

      const response = await apiClient("ACCOUNT", "/", "POST", validatedData);
      return NextResponse.json(response.data);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err: ValidationError) => err.message).join('\n');
      return NextResponse.json(
        { error: errorMessages, details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("API 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
} 