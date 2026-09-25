export function Card({ title, subtitle, actions, children, footer, flush = false, className = '', inset = false, ...rest }) {
  return (
    <section className={`card ${inset ? 'card--inset' : ''} ${className}`} {...rest}>
      {(title || actions) && (
        <header className="card__header">
          <div className="grow">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <div className="card__subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="row">{actions}</div>}
        </header>
      )}
      <div className={flush ? 'card__body--flush' : 'card__body'}>{children}</div>
      {footer && <footer className="card__footer">{footer}</footer>}
    </section>
  );
}

export function SectionTitle({ title, children }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {children && <div className="row">{children}</div>}
    </div>
  );
}

export function KeyValue({ items }) {
  return (
    <dl className="kv">
      {items.filter(Boolean).map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <dt>{k}</dt>
          <dd>{v ?? <span className="muted">N/A</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Callout({ tone = 'info', icon: Icon, title, children }) {
  return (
    <div className={`callout callout--${tone}`}>
      {Icon && <Icon size={16} />}
      <div>
        {title && <strong>{title} </strong>}
        {children}
      </div>
    </div>
  );
}
