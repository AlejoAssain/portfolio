import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

export function ProtectedAdminRoute() {
  const { isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Checking admin access...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
