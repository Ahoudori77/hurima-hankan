import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProofPage } from './pages/ProofPage';
import { TasksPage } from './pages/TasksPage';


const qc = new QueryClient();
function App() {
  const path = new URL(location.href).pathname;
  return (
    <QueryClientProvider client={qc}>
    {path.includes('/liff/proof') ? <ProofPage /> : <TasksPage />}
    </QueryClientProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);