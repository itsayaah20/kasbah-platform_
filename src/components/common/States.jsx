import { Inbox, RefreshCw, ServerCrash } from 'lucide-react';

export function Skeleton({ width = '100%', height = 14, radius, style }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} aria-hidden="true" />;
}

export function EmptyState({ icon: Icon = Inbox, title = 'Aucune donnée disponible', description, action }) {
  return (
    <div className="state">
      <span className="state__icon"><Icon size={20} /></span>
      <div className="state__title">{title}</div>
      {description && <div className="state__desc">{description}</div>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon"><ServerCrash size={20} /></span>
      <div className="state__title">Impossible de charger les données</div>
      <div className="state__desc">{error?.message || 'Une erreur inattendue est survenue.'}</div>
      {onRetry && (
        <button type="button" className="btn btn--sm" onClick={onRetry}><RefreshCw size={13} /> Réessayer</button>
      )}
    </div>
  );
}

export function LoadingState({ variant = 'page' }) {
  if (variant === 'block') {
    return (
      <div className="stack-sm" style={{ padding: 18 }} aria-busy="true" aria-label="Chargement">
        <Skeleton width="40%" height={16} />
        <Skeleton height={12} />
        <Skeleton width="85%" height={12} />
        <Skeleton width="70%" height={12} />
      </div>
    );
  }
  return (
    <div className="stack" aria-busy="true" aria-label="Chargement de la page">
      <Skeleton width={260} height={26} />
      <div className="grid grid-kpi">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={104} radius={14} />)}
      </div>
      <div className="grid grid-main-side">
        <Skeleton height={320} radius={14} />
        <Skeleton height={320} radius={14} />
      </div>
      <Skeleton height={240} radius={14} />
    </div>
  );
}

// Rend loading / erreur / vide / contenu à partir du résultat de useAsync.
export function AsyncContent({ state, children, loading = <LoadingState />, isEmpty, empty }) {
  if (state.loading && !state.data) return loading;
  if (state.error) return <ErrorState error={state.error} onRetry={state.reload} />;
  if (!state.data || (isEmpty && isEmpty(state.data))) return empty || <EmptyState />;
  return children(state.data);
}
