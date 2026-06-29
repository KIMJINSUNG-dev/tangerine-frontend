// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'
import App from './App.jsx'

/**
 * [추가] QueryClient 생성
 * Pebble에서 했던 것과 동일해요. React Query의 캐시와 설정을 관리하는 객체예요.
 */
const queryClient = new QueryClient({

  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {/* <StrictMode> */}
      <App />
      {/* </StrictMode> */}
    </AuthProvider>
  </QueryClientProvider>
);
