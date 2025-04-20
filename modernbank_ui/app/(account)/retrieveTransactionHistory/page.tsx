"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface Transaction {
  acntNo: string;
  seq: number;
  divCd: string;
  stsCd: string;
  trnsAmt: number;
  acntBlnc: number;
  trnsBrnch?: string;
  trnsDtm: string;
}

interface Account {
  acntNo: string;
  acntNm: string;
  acntBlnc: number;
}

export default function TransactionHistory() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user?.user_id) {
        showModal("오류", "사용자 인증이 필요합니다.");
        return;
      }

      try {
        const response = await fetch(`/api/account?path=accounts&customerId=${user.user_id}`, {
          headers: {
            "x-user-id": user.user_id,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "계좌 목록을 불러올 수 없습니다.");
        }

        const data = await response.json();
        setAccounts(data);
        if (data.length > 0) {
          setSelectedAccount(data[0].acntNo);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "계좌 목록 조회 중 오류가 발생했습니다.";
        showModal("오류", errorMessage);
        setError(errorMessage);
      }
    };

    fetchAccounts();
  }, [user]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedAccount || !user?.user_id) return;

      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/account?path=transactions&accountNo=${selectedAccount}`, {
          headers: {
            "x-user-id": user.user_id,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "거래 내역을 불러올 수 없습니다.");
        }

        const data = await response.json();
        // 거래일시 기준으로 내림차순 정렬
        const sortedTransactions = data.sort((a: Transaction, b: Transaction) => 
          new Date(b.trnsDtm).getTime() - new Date(a.trnsDtm).getTime()
        );
        setTransactions(sortedTransactions);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "거래 내역 조회 중 오류가 발생했습니다.";
        showModal("오류", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedAccount, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getTransactionType = (divCd: string) => {
    switch (divCd) {
      case 'D':
        return { text: '입금', color: 'text-blue-600 dark:text-blue-400' };
      case 'W':
        return { text: '출금', color: 'text-red-600 dark:text-red-400' };
      default:
        return { text: '알 수 없음', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const getTransactionStatus = (stsCd: string) => {
    switch (stsCd) {
      case '1':
        return { text: '완료', color: 'text-green-600 dark:text-green-400' };
      case '2':
        return { text: '처리중', color: 'text-yellow-600 dark:text-yellow-400' };
      case '3':
        return { text: '실패', color: 'text-red-600 dark:text-red-400' };
      default:
        return { text: '알 수 없음', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const formatAmount = (amount: number, divCd: string) => {
    const formattedAmount = amount.toLocaleString();
    return divCd === 'D' 
      ? `+${formattedAmount}`
      : `-${formattedAmount}`;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 타이틀 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            거래 내역 조회
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            계좌의 거래 내역을 조회합니다.
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* 계좌 선택 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              계좌 선택
            </label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">계좌를 선택하세요</option>
              {accounts.map((account) => (
                <option key={account.acntNo} value={account.acntNo}>
                  {account.acntNm} ({account.acntNo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 거래 내역 테이블 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    거래일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    거래구분
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    거래금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    거래후잔액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    거래지점
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="ml-2">거래내역 조회 중...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((transaction) => {
                    const type = getTransactionType(transaction.divCd);
                    const status = getTransactionStatus(transaction.stsCd);
                    return (
                      <tr key={transaction.seq} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(transaction.trnsDtm)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={type.color}>{type.text}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={type.color}>
                            {formatAmount(transaction.trnsAmt, transaction.divCd)} 원
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.acntBlnc.toLocaleString()} 원
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.trnsBrnch || '온라인'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={status.color}>{status.text}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      거래 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
    </>
  );
}
