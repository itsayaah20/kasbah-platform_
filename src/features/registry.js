import { lazy } from 'react';

// Chaque cellule a sa propre interface ; aucune n'est un gabarit générique.
export const cellDashboards = {
  soc: lazy(() => import('./soc/SocDashboard')),
  forensics: lazy(() => import('./forensics/ForensicsDashboard')),
  continuite: lazy(() => import('./continuite/ContinuiteDashboard')),
  risque: lazy(() => import('./risque/RisqueDashboard')),
  direction: lazy(() => import('./direction/DirectionDashboard')),
  communication: lazy(() => import('./communication/CommunicationDashboard')),
};
