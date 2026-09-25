import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../context/AppContext';

export function AppLayout() {
  const { collapsed, session } = useApp();
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  if (!session) return <Navigate to="/login" replace state={{ from: pathname }} />;

  return (
    <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="page" key={pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
