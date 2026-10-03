import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';

export default function ProtectedRoute({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    const loginPath = role ? `/login?role=${role}` : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
