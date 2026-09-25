import { Link } from 'react-router-dom';
import { AlertOctagon, CheckCircle2, CircleDashed, Info, Lock, TriangleAlert, CircleDot, FileSearch } from 'lucide-react';
import { VERDICTS } from '../../data/common/evidence';
import { ACTION_STATUS } from '../../data/continuite/plans';

const TONE_ICON = { critical: AlertOctagon, serious: TriangleAlert, warning: TriangleAlert, good: CheckCircle2, info: Info, neutral: CircleDot };

export function Badge({ tone = 'neutral', icon: Icon, children, size, className = '', title }) {
  return (
    <span className={`badge badge--${tone} ${size === 'sm' ? 'badge--sm' : ''} ${className}`} title={title}>
      {Icon && <Icon size={size === 'sm' ? 11 : 12} aria-hidden="true" />}
      {children}
    </span>
  );
}

// Un statut porte toujours une icône + un libellé, jamais la couleur seule.
export function StatusBadge({ tone = 'neutral', children, size, withIcon = true }) {
  return <Badge tone={tone} icon={withIcon ? TONE_ICON[tone] : undefined} size={size}>{children}</Badge>;
}

export function VerdictBadge({ verdict, size }) {
  const v = VERDICTS[verdict];
  if (!v) return <Badge size={size}>N/A</Badge>;
  const icon = verdict === 'preuve' ? FileSearch : verdict === 'a-confirmer' ? CircleDashed : CheckCircle2;
  return <Badge tone={v.tone} icon={icon} size={size}>{v.label}</Badge>;
}

export function ActionStatusBadge({ status, size }) {
  const s = ACTION_STATUS[status];
  if (!s) return <Badge size={size}>N/A</Badge>;
  const icon = status === 'bloque' ? Lock : status === 'fait' ? CheckCircle2 : status === 'en-cours' ? CircleDot : status === 'a-confirmer' ? CircleDashed : undefined;
  return <Badge tone={s.tone} icon={icon} size={size} title={s.desc}>{s.label}</Badge>;
}

export const SEVERITY_TONE = { critical: 'critical', high: 'serious', medium: 'warning', low: 'good', unknown: 'neutral' };
export const SEVERITY_LABEL = { critical: 'Critique', high: 'Élevée', medium: 'Moyenne', low: 'Faible', unknown: 'À vérifier' };

export function SeverityBadge({ severity, size }) {
  return <StatusBadge tone={SEVERITY_TONE[severity] || 'neutral'} size={size}>{SEVERITY_LABEL[severity] || severity}</StatusBadge>;
}

const PROVENANCE = { real: 'Réel', derived: 'Dérivé', na: 'N/A', demo: 'Démo' };
export function ProvenanceTag({ kind = 'real', title }) {
  return <span className={`provenance provenance--${kind}`} title={title}>● {PROVENANCE[kind]}</span>;
}

export function EvidenceChips({ refs = [], max = 6 }) {
  if (!refs.length) return null;
  const shown = refs.slice(0, max);
  return (
    <span className="row-wrap" style={{ gap: 4 }}>
      {shown.map((ref) => (
        <Link key={ref} to={`/pieces?ref=${ref}`} className="chip" title={`Ouvrir la pièce ${ref}`} onClick={(e) => e.stopPropagation()}>
          {ref}
        </Link>
      ))}
      {refs.length > max && <span className="chip">+{refs.length - max}</span>}
    </span>
  );
}
