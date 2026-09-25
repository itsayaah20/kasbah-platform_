import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingState } from './components/common/States';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cells = lazy(() => import('./pages/Cells'));
const CellDetail = lazy(() => import('./pages/CellDetail'));
const CellActivities = lazy(() => import('./pages/CellActivities'));
const CellStatistics = lazy(() => import('./pages/CellStatistics'));
const Relations = lazy(() => import('./pages/Relations'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Activities = lazy(() => import('./pages/Activities'));
const Events = lazy(() => import('./pages/Events'));
const Evidence = lazy(() => import('./pages/Evidence'));
const Decisions = lazy(() => import('./pages/Decisions'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Reports = lazy(() => import('./pages/Reports'));
const Users = lazy(() => import('./pages/Users'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function CellAlias({ suffix }) {
  const { id } = useParams();
  return <Navigate to={`/cellules/${id}/${suffix}`} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<div className="page"><LoadingState /></div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cellules" element={<Cells />} />
          <Route path="/cellules/:id" element={<CellDetail />} />
          <Route path="/cellules/:id/activites" element={<CellActivities />} />
          <Route path="/cellules/:id/statistiques" element={<CellStatistics />} />
          <Route path="/relations" element={<Relations />} />
          <Route path="/alertes" element={<Alerts />} />
          <Route path="/activites" element={<Activities />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/pieces" element={<Evidence />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/statistiques" element={<Statistics />} />
          <Route path="/rapports" element={<Reports />} />
          <Route path="/utilisateurs" element={<Users />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="/profil" element={<Profile />} />

          {/* Alias anglais */}
          <Route path="/cellules/:id/activities" element={<CellAlias suffix="activites" />} />
          <Route path="/cellules/:id/statistics" element={<CellAlias suffix="statistiques" />} />
          <Route path="/alerts" element={<Navigate to="/alertes" replace />} />
          <Route path="/activities" element={<Navigate to="/activites" replace />} />
          <Route path="/statistics" element={<Navigate to="/statistiques" replace />} />
          <Route path="/users" element={<Navigate to="/utilisateurs" replace />} />
          <Route path="/settings" element={<Navigate to="/parametres" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
