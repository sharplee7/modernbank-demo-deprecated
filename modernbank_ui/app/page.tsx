"use client";

import { JSX, useState } from "react";
import Link from "next/link";

export default function Home(): JSX.Element {
  const [loading, setLoading] = useState(false);

  return (
    // 전체 배경을 멋진 이미지로 설정 (bg-cover, bg-center)
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* 배경 이미지 위에 검은색 반투명 오버레이 적용 */}
      <div className="bg-black bg-opacity-60 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
          {/* ==============================
              히어로 섹션
          ============================== */}
          <section className="text-center py-12">
            <h1 className="text-4xl font-extrabold text-white">
              신뢰할 수 있는 디지털 금융
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              ModernBank와 함께 빠르고 안전한 금융 서비스를 경험하세요.
            </p>
            <Link href="#">
              <button className="mt-6 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition">
                무료 계좌 개설
              </button>
            </Link>
          </section>

          {/* ==============================
              핵심 기능 섹션
          ============================== */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center text-white">
              ModernBank의 핵심 금융 서비스
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {/* 초고속 송금 */}
              <div className="p-6 bg-white bg-opacity-90 shadow-md rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  🚀 초고속 송금
                </h3>
                <p className="mt-3 text-gray-700">5초 만에 송금이 완료됩니다.</p>
                <Link
                  href="/transfer/transfer"
                  className="mt-4 inline-block text-yellow-500 font-semibold hover:underline"
                >
                  당행 이체 바로가기 →
                </Link>
              </div>
              {/* 강력한 보안 */}
              <div className="p-6 bg-white bg-opacity-90 shadow-md rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  🔐 강력한 보안
                </h3>
                <p className="mt-3 text-gray-700">
                  AI 기반 이상 거래 탐지 및 2FA 인증 지원.
                </p>
                <Link
                  href="/security"
                  className="mt-4 inline-block text-yellow-500 font-semibold hover:underline"
                >
                  보안 기능 알아보기 →
                </Link>
              </div>
              {/* AI 맞춤 추천 */}
              <div className="p-6 bg-white bg-opacity-90 shadow-md rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  🤖 AI 맞춤 추천
                </h3>
                <p className="mt-3 text-gray-700">
                  나에게 맞는 금융 상품을 추천받으세요.
                </p>
                <Link
                  href="/ai-recommendations"
                  className="mt-4 inline-block text-yellow-500 font-semibold hover:underline"
                >
                  추천 서비스 →
                </Link>
              </div>
            </div>
          </section>

          {/* ==============================
              입출금 & 금융 서비스 섹션
          ============================== */}
          <section className="py-16 bg-gray-100 bg-opacity-90 rounded-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              더욱 편리한 금융 서비스
            </h2>
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {/* 입금 서비스 */}
              <div className="p-6 bg-white shadow-md rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  💰 간편한 입금
                </h3>
                <p className="mt-3 text-gray-700">
                  언제 어디서나 ModernBank 계좌에 입금하세요.
                </p>
                <Link
                  href="/account/deposit"
                  className="mt-4 inline-block text-yellow-500 font-semibold hover:underline"
                >
                  입금하기 →
                </Link>
              </div>
              {/* 출금 서비스 */}
              <div className="p-6 bg-white shadow-md rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  🏦 출금 서비스
                </h3>
                <p className="mt-3 text-gray-700">
                  편리한 ATM 및 온라인 출금을 지원합니다.
                </p>
                <Link
                  href="/account/withdraw"
                  className="mt-4 inline-block text-yellow-500 font-semibold hover:underline"
                >
                  출금하기 →
                </Link>
              </div>
            </div>
          </section>

          {/* ==============================
              고객 리뷰 & 신뢰도 섹션
          ============================== */}
          <section className="py-16 text-center">
            <h2 className="text-3xl font-bold text-white">
              고객이 신뢰하는 금융 서비스
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              200만 명 이상의 고객이 ModernBank를 이용하고 있습니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              <div className="p-6 bg-white bg-opacity-90 rounded-lg shadow-md max-w-sm">
                <p className="text-gray-700">
                  &ldquo;ModernBank 덕분에 금융 거래가 너무 편해졌어요!&rdquo;
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  - 김민수, IT 엔지니어
                </p>
              </div>
              <div className="p-6 bg-white bg-opacity-90 rounded-lg shadow-md max-w-sm">
                <p className="text-gray-700">
                  &ldquo;AI 추천 서비스가 정말 유용합니다!&rdquo;
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  - 이지영, 마케터
                </p>
              </div>
            </div>
          </section>

          {/* ==============================
              CTA 섹션
          ============================== */}
          <section className="py-16 text-center bg-yellow-500 bg-opacity-90 text-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold">ModernBank와 함께하세요</h2>
            <p className="mt-2">
              지금 가입하고 특별 혜택을 받아보세요.
            </p>
            <button
              className="mt-6 px-6 py-3 bg-white text-yellow-500 font-semibold rounded-md hover:bg-gray-100 transition"
              onClick={() => setLoading(true)}
            >
              {loading ? "처리 중..." : "무료 가입하기"}
            </button>
          </section>

          <p>
            &ldquo;모던뱅크에 오신 것을 환영합니다&rdquo;
          </p>
          <p>
            &ldquo;최고의 금융 서비스를 제공합니다&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
