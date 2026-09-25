import { ProvenanceTag } from '../common/Badge';

export function StatCard({ label, value, unit, sub, icon: Icon, tone, provenance, source, children, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`card stat-card ${tone ? `stat-card--${tone}` : ''} ${onClick ? 'card--interactive' : ''}`}
      style={onClick ? { textAlign: 'left', font: 'inherit', color: 'inherit' } : undefined}
    >
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {Icon && <span className="stat-card__icon"><Icon size={16} /></span>}
      </div>
      <div className="stat-card__value">
        {value}
        {unit && <small>{unit}</small>}
      </div>
      {sub && <div className="stat-card__sub">{sub}</div>}
      {children}
      {(provenance || source) && (
        <div className="stat-card__foot">
          {provenance && <ProvenanceTag kind={provenance} />}
          {source && <span className="tiny muted" style={{ textAlign: 'right' }}>{source}</span>}
        </div>
      )}
    </Tag>
  );
}
