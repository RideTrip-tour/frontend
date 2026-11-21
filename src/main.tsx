import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from '@/app/App';
import { ErrorBoundary } from '@/shared/errors/ErrorBoundary';
import { NotificationProvider } from '@/shared/notifications/NotificationContext';

import '@/app/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <NotificationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </ErrorBoundary>
  </StrictMode>,
);
