import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import "./assets/scss/main.scss"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { RouterProvider } from 'react-router';
import { router } from './app/router/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      <RouterProvider router={router} />
    </QueryClientProvider>
    
  </StrictMode>,
)
