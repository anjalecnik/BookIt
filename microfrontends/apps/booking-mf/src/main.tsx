import React from 'react';
import ReactDOM from 'react-dom/client';
import DashboardPage from './DashboardPage';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DashboardPage />
    </BrowserRouter>
  </React.StrictMode>
);
