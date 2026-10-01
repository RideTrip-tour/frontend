import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from '@/App';
import { ErrorBoundary } from '@/shared/errors/ErrorBoundary';
import { NotificationProvider } from '@/shared/notifications/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <NotificationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
