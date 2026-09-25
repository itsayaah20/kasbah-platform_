import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;
  return (
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} className="row" style={{ gap: 6 }}>
            {item.to && !last ? <Link to={item.to}>{item.label}</Link> : <span aria-current={last ? 'page' : undefined}>{item.label}</span>}
            {!last && <ChevronRight size={12} />}
          </span>
        );
      })}
    </nav>
  );
}

export function PageHeader({ eyebrow, title, description, actions, breadcrumbs }) {
  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <header className="page-header">
        <div className="grow">
          {eyebrow && <div className="page-header__eyebrow">{eyebrow}</div>}
          <h1>{title}</h1>
          {description && <p className="page-header__desc">{description}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </header>
    </>
  );
}
