"use client";

import { Provider } from 'react-redux';
import { store } from '@/store';
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import ClientLayout from "@/components/ClientLayout";
import Header from "@/components/Header";
import ChatbotButton from "@/components/ChatbotButton";
import AuthGuard from "@/components/AuthGuard";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <DarkModeProvider>
        <ClientLayout>
          <div className="flex flex-col min-h-screen">
            <Header />
            <AuthGuard>
              <main className="flex-1 w-full mx-auto px-6 pt-24">
                {children}
              </main>
            </AuthGuard>
          </div>
          <div className="fixed bottom-6 right-6 z-50">
            <ChatbotButton />
          </div>
        </ClientLayout>
      </DarkModeProvider>
    </Provider>
  );
} 