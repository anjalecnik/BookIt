import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getAuth } from '@mf/shared-auth';
import LoginPage from './pages/LoginPage';

const DashboardPage = lazy(() => import('bookingMf/DashboardPage'));

function RequireAuth({ children }: { children: React.ReactElement }) {
  const auth = getAuth();
  return auth ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading microfrontend...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
