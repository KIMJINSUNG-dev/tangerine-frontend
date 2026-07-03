// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';

const queryClient = new QueryClient({

  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
});

// ! (non-null assertion)으로 null이 아님을 TypeScript에 보장해요.
// index.html에 id="root"인 div가 반드시 있다는 걸 우리가 알고 있으니
// TypeScript에게 "null이 아니라고 내가 보장한다"고 알려주는 거예요.
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {/* <StrictMode> */}
      <App />
      {/* </StrictMode> */}
    </AuthProvider>
  </QueryClientProvider>
);
