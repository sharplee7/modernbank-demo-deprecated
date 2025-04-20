// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './customerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        customer: customerReducer,
    },
    devTools: process.env.NODE_ENV !== 'production', // 개발 환경에서만 Redux DevTools 활성화
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
