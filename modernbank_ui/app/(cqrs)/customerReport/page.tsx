"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// ✅ 인터페이스 정의
interface Account {
  acntNo: string;
  cstmId: string;
  cstmNm: string | null;
  acntNm: string;
  newDtm: string;
  acntBlnc: number;
}

interface CustomerReport {
  cstmId: string;
  cstmNm: string;
  cstmAge: string;
  cstmGnd: string;
  cstmPn: string;
  cstmAdr: string;
  oneTmTrnfLmt: number;
  oneDyTrnfLmt: number;
  accounts: Account[];
}

export default function CustomerReport() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!user?.user_id) {
        showModal("오류", "사용자 인증이 필요합니다.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/cqrs/customers/${user.user_id}/details`, {
          headers: {
            "x-user-id": user.user_id,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "고객 리포트를 불러올 수 없습니다.");
        }

        const data = await response.json();
        setReport(data);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "고객 리포트 조회 중 오류가 발생했습니다.";
        showModal("오류", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">⚠️ Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-900 dark:text-white">❌ 고객 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] overflow-auto">
      {/* 페이지 타이틀 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          고객 정보
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          고객의 기본 정보와 계좌 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* 고객 기본 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          기본 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">고객 ID</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{report.cstmId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">고객명</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{report.cstmNm}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">연락처</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{report.cstmPn}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">주소</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{report.cstmAdr}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">나이</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{report.cstmAge}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">성별</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {report.cstmGnd === '1' ? '남성' : '여성'}
            </p>
          </div>
        </div>
      </div>

      {/* 이체 한도 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          이체 한도
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">1회 이체 한도</p>
            <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              {report.oneTmTrnfLmt.toLocaleString()} 원
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">1일 이체 한도</p>
            <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              {report.oneDyTrnfLmt.toLocaleString()} 원
            </p>
          </div>
        </div>
      </div>

      {/* 계좌 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          계좌 목록
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">계좌번호</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">계좌명</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">개설일</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">잔액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {report.accounts.map((account: Account, idx: number) => (
                <tr key={account.acntNo} className={idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{account.acntNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{account.acntNm}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{formatDate(account.newDtm)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                    {account.acntBlnc.toLocaleString()} 원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
              {modalContent.title}
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {modalContent.message}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors duration-200"
              >
                확인
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
