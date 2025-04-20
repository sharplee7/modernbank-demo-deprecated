"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Dialog, DialogTitle } from "@headlessui/react";

interface Customer {
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

interface Account {
  acntNo: string;
  acntNm: string;
  newDtm: string;
  acntBlnc: number;
}

export default function RetrieveCustomerCQRS() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchCustomerDetails = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/customer?customerId=${user.user_id}&action=details`, {
          headers: {
            'x-user-id': user.user_id
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "고객 조회 중 오류가 발생했습니다.");
        }

        setCustomer(data);
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : "고객 조회 중 오류가 발생했습니다.");
        setErrorModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [user]);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 ">
        <h2 className="text-3xl font-extrabold text-[#232F3E] dark:text-white mb-6 border-l-4 border-[#FF9900] pl-3">
          고객 조회 (CQRS)
        </h2>

        {/* 로딩 상태 */}
        {isLoading && (
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            불러오는 중...
          </p>
        )}

        {/* 고객 정보 */}
        {customer && (
          <>
            {/* 고객 정보 섹션 */}
            <h3 className="text-2xl font-semibold text-[#232F3E] dark:text-white mt-10 border-l-4 border-[#FF9900] pl-3">
              고객 정보
            </h3>
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm mt-6 rounded-md">
              <tbody>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    고객 ID
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.cstmId}
                  </td>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    이름
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.cstmNm}
                  </td>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    성별
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.cstmGnd === "1" ? "남성" : "여성"}
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    나이
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.cstmAge}세
                  </td>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    주소
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.cstmAdr}
                  </td>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    전화번호
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.cstmPn}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 이체 한도 정보 섹션 */}
            <h3 className="text-2xl font-semibold text-[#232F3E] dark:text-white mt-10 border-l-4 border-[#FF9900] pl-3">
              이체 한도 정보
            </h3>
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm mt-6 rounded-md">
              <tbody>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    1일 이체 한도
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.oneDyTrnfLmt !== undefined
                      ? customer.oneDyTrnfLmt.toLocaleString()
                      : "-"}{" "}
                    원
                  </td>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    1회 이체 한도
                  </th>
                  <td className="border p-3 dark:text-gray-300">
                    {customer.oneTmTrnfLmt !== undefined
                      ? customer.oneTmTrnfLmt.toLocaleString()
                      : "-"}{" "}
                    원
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 계좌 정보 섹션 */}
            <h3 className="text-2xl font-semibold text-[#232F3E] dark:text-white mt-10 border-l-4 border-[#FF9900] pl-3">
              계좌 정보
            </h3>
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm mt-6 rounded-md">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    계좌명
                  </th>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    계좌번호
                  </th>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    잔액
                  </th>
                  <th className="border p-3 text-left font-semibold text-[#232F3E] dark:text-white">
                    개설일
                  </th>
                </tr>
              </thead>
              <tbody>
                {customer && customer.accounts && Array.isArray(customer.accounts) && customer.accounts.length > 0 ? (
                  customer.accounts.map((account) => (
                    <tr key={account.acntNo} className="bg-gray-50 dark:bg-gray-800">
                      <td className="border p-3 text-[#232F3E] dark:text-gray-300">
                        {account.acntNm}
                      </td>
                      <td className="border p-3 text-[#232F3E] dark:text-gray-300">
                        {account.acntNo}
                      </td>
                      <td className="border p-3 text-[#232F3E] dark:text-gray-300">
                        {account.acntBlnc !== undefined ? account.acntBlnc.toLocaleString() : "-"} 원
                      </td>
                      <td className="border p-3 text-[#232F3E] dark:text-gray-300">
                        {account.newDtm}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border p-3 text-center text-[#232F3E] dark:text-gray-300">
                      조회된 계좌 정보가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </>
        )}
      </div>

      {/* 오류 모달 (Error Modal) */}
      <Dialog
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded p-6">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white">
              오류 발생
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">{errorMessage}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setErrorModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              >
                확인
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
