import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '../components/common/States';

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Page introuvable"
      description="Cette adresse ne correspond à aucune vue de la plateforme."
      action={<Link to="/dashboard" className="btn btn--primary btn--sm">Retour au tableau de bord</Link>}
    />
  );
}
