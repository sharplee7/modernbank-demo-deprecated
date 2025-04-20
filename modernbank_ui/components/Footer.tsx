"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* ✅ 헤더 (로고 + 내비게이션) */}
      <header className="flex justify-between items-center py-4 border-b">
        <h1 className="text-2xl font-bold text-blue-600">ModernBank</h1>
        <nav className="space-x-4">
          <a href="#" className="text-gray-700 hover:text-blue-600">서비스</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">이체</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">고객센터</a>
        </nav>
      </header>

      {/* ✅ 히어로 섹션 */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900">
          빠르고 안전한 금융 서비스
        </h2>
        <p className="mt-2 text-gray-600">
          AI 기반 맞춤 추천과 강력한 보안을 ModernBank에서 경험하세요.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          무료 계좌 개설
        </button>
      </section>

      {/* ✅ 핵심 기능 섹션 */}
      <section className="py-12">
        <h3 className="text-2xl font-bold text-gray-900 text-center">ModernBank의 핵심 기능</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-100 shadow-md rounded-lg">
            <h4 className="text-lg font-semibold">🚀 초고속 송금</h4>
            <p className="mt-2 text-gray-700">5초 안에 송금이 완료됩니다.</p>
          </div>
          <div className="p-6 bg-gray-100 shadow-md rounded-lg">
            <h4 className="text-lg font-semibold">🔐 강력한 보안</h4>
            <p className="mt-2 text-gray-700">최신 보안 기술로 안전한 거래 보장.</p>
          </div>
          <div className="p-6 bg-gray-100 shadow-md rounded-lg">
            <h4 className="text-lg font-semibold">🤖 AI 맞춤 추천</h4>
            <p className="mt-2 text-gray-700">나에게 딱 맞는 금융 상품 추천.</p>
          </div>
        </div>
      </section>

      {/* ✅ CTA 섹션 */}
      <section className="py-12 text-center bg-blue-600 text-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold">ModernBank와 함께하세요</h3>
        <p className="mt-2">지금 가입하고 특별 혜택을 받아보세요.</p>
        <button
          className="mt-4 px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100"
          onClick={() => setLoading(true)}
        >
          {loading ? "처리 중..." : "무료 가입하기"}
        </button>
      </section>

      {/* ✅ 푸터 */}
      <footer className="text-center py-6 text-gray-600">
        &copy; 2025 ModernBank. 모든 권리 보유.
      </footer>
    </div>
  );
}
