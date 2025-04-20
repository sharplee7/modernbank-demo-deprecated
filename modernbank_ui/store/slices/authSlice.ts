import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  user_id: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// localStorage에서 상태를 불러오는 함수
const loadState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }
  
  try {
    const storedState = localStorage.getItem('authState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      return {
        user: parsedState.user,
        isAuthenticated: !!parsedState.user
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
  }
  return { user: null, isAuthenticated: false };
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('authState', JSON.stringify({
          user: action.payload,
          isAuthenticated: true
        }));
      } catch (error) {
        console.error('Error saving auth state to localStorage:', error);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('authState');
      } catch (error) {
        console.error('Error clearing auth state from localStorage:', error);
      }
    },
    // 인증 상태 확인을 위한 리듀서
    checkAuth: (state) => {
      try {
        // 먼저 authState 키 확인 (Redux 저장방식)
        const storedAuthState = localStorage.getItem('authState');
        if (storedAuthState) {
          const parsedState = JSON.parse(storedAuthState);
          state.user = parsedState.user;
          state.isAuthenticated = !!parsedState.user;
          
          // retrieveCustomer와 호환성을 위해 'user' 키에도 저장
          if (parsedState.user) {
            localStorage.setItem('user', JSON.stringify(parsedState.user));
          }
          return;
        }
        
        // authState가 없으면 user 키 확인 (다른 컴포넌트 호환성)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          state.user = user;
          state.isAuthenticated = true;
          
          // user 키의 정보를 authState로 마이그레이션 (일관성 유지)
          localStorage.setItem('authState', JSON.stringify({
            user,
            isAuthenticated: true
          }));
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        state.user = null;
        state.isAuthenticated = false;
      }
    }
  }
});

export const { setUser, clearUser, checkAuth } = authSlice.actions;
export default authSlice.reducer; 