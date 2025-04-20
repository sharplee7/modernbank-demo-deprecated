export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  status: number;
  message: string;
}

export interface Account {
  acntNo: string;
  acntNm: string;
  acntBlnc: number;
  cstmId: string;
}

export interface Transaction {
  id: string;
  acntNo: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  timestamp: string;
}

export interface Customer {
  cstmId: string;
  name: string;
  email: string;
  phone: string;
}

export interface Transfer {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface TransferLimit {
  oneTmTrnfLmt: number;
  dlyTrnfLmt: number;
}

export interface TransferHistory {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  status: string;
}

export interface Product {
  id: string;
  name: string;
}

export interface HealthCheckResponse {
  status: string;
  details: {
    [key: string]: {
      status: string;
      details?: Record<string, unknown>;
    };
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
} 