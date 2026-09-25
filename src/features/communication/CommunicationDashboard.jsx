import { useState } from 'react';
import { Newspaper, Mail, Inbox, Scale, Users, Shield, Building2, Megaphone, Send, FilePen, History, ExternalLink, BookCheck, UserCheck, ListChecks } from 'lucide-react';
import { Tabs, Segmented, SearchBar } from '../../components/common/Controls';
import { useTabParam } from '../../hooks/useMisc';
import { Card, Callout } from '../../components/common/Card';
import { StatusBadge, EvidenceChips, Badge, ActionStatusBadge } from '../../components/common/Badge';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/States';
import { CellOverviewFooter } from '../shared';
import { documents } from '../../data/common/documents';
import { documentUrl } from '../../services/documentService';
import { normalize } from '../../utils/format';

const AUDIENCE = {
  interne: { label: 'Cellule de crise', icon: Shield },
  salaries: { label: 'Salariés', icon: Users },
  clients: { label: 'Clients', icon: Building2 },
  presse: { label: 'Presse', icon: Newspaper },
  public: { label: 'Public', icon: Megaphone },
};
const STATUS = {
  sent: { label: 'Envoyé', tone: 'good' },
  draft: { label: 'Projet de communiqué', tone: 'warning' },
  deposited: { label: 'Communiqué déposé', tone: 'good' },
  superseded: { label: 'Remplacé', tone: 'neutral' },
};

function MessageViewer({ message, onClose, all }) {
  if (!message) return null;
  const doc = documents.find((d) => d.id === message.docId);
  const Aud = AUDIENCE[message.audience];
  const next = message.supersededBy ? all.find((m) => m.id === message.supersededBy) : null;
  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={message.subject}
      subtitle={<span className="row-wrap"><StatusBadge size="sm" tone={STATUS[message.status].tone}>{STATUS[message.status].label}</StatusBadge><Badge size="sm" icon={Aud.icon}>{Aud.label}</Badge>{message.recipient && <span>À : {message.recipient}</span>}<span className="mono">{message.day}{message.dayInferred ? ' (déduit)' : ''}</span></span>}
      footer={(<>{doc && <a className="btn" href={documentUrl(doc)} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Fichier source ({doc.original})</a>}<button type="button" className="btn btn--primary" onClick={onClose}>Fermer</button></>)}
    >
      <article className="letter">
        {message.body.map((p, i) => <p key={i}>{p}</p>)}
        <p className="letter__sign">{message.signedBy || 'Cellule de communication de crise AtlasGrid'}</p>
      </article>
      <div className="row-wrap" style={{ marginTop: 16 }}>
        <span className="small muted">Sujets :</span>
        {message.topics.map((t) => <Badge key={t} size="sm" tone="outline" className="badge--outline">{t}</Badge>)}
        {message.closes && <StatusBadge size="sm" tone="good">Piste {message.closes} levée</StatusBadge>}
        <EvidenceChips refs={message.evidence} />
      </div>
      {next && <Callout tone="info" icon={History}>Ce message a été suivi par « {next.subject} ».</Callout>}
    </Modal>
  );
}

function PressRoom({ data, onOpen }) {
  const [audience, setAudience] = useState('all');
  const [query, setQuery] = useState('');
  const q = normalize(query);
  const list = data.messages.filter((m) => (audience === 'all' || m.audience === audience) && (!q || normalize(`${m.subject} ${m.body.join(' ')} ${m.topics.join(' ')}`).includes(q)));
  const sent = data.messages.filter((m) => m.status === 'sent').length;
  const handled = data.inboundRequests.filter((r) => r.status === 'fait').length;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="grid grid-kpi">
        <StatCard label="Messages rédigés" value={data.messages.length} sub="10 documents dans Data/Communication" icon={FilePen} provenance="real" />
        <StatCard label="Envoyés" value={sent} sub="Internes, salariés, clients, presse" icon={Send} tone="good" provenance="derived" />
        <StatCard label="Communiqués officiels" value={data.messages.filter((m) => m.audience === 'public').length} sub="Déposés J2 16:40 et 16:46" icon={Megaphone} tone="warning" provenance="real" />
        <StatCard label="Demandes traitées" value={handled} unit={`/ ${data.inboundRequests.length}`} sub="Clients, presse, personnel" icon={Inbox} tone="info" provenance="derived" />
      </div>
      <div className="filter-bar">
        <Segmented value={audience} onChange={setAudience} ariaLabel="Audience" options={[
          { value: 'all', label: 'Toutes', count: data.messages.length },
          ...Object.entries(AUDIENCE).map(([k, v]) => ({ value: k, label: v.label, icon: v.icon, count: data.messages.filter((m) => m.audience === k).length })),
        ]} />
        <span className="filter-bar__spacer" />
        <SearchBar value={query} onChange={setQuery} placeholder="Rechercher dans les messages…" width={260} />
      </div>
      {list.length === 0 ? <EmptyState title="Aucun message" description="Aucun message ne correspond à ces critères." /> : (
        <div className="grid grid-2">
          {list.map((m) => {
            const Aud = AUDIENCE[m.audience];
            return (
              <button key={m.id} type="button" className="card card--interactive message-card" onClick={() => onOpen(m)}>
                <div className="row between">
                  <span className="row small secondary" style={{ gap: 6 }}><Aud.icon size={14} />{Aud.label}{m.recipient && <span className="muted">· {m.recipient}</span>}</span>
                  <StatusBadge size="sm" tone={STATUS[m.status].tone}>{STATUS[m.status].label}</StatusBadge>
                </div>
                <div className="message-card__subject">{m.subject}</div>
                <p className="message-card__excerpt">{m.body[0]}</p>
                <div className="row-wrap">
                  <Badge size="sm" tone="outline" className="badge--outline">{m.kind}</Badge>
                  {m.closes && <StatusBadge size="sm" tone="good">{m.closes} levée</StatusBadge>}
                  <span className="tiny muted mono">{m.day}{m.dayInferred ? ' · déduit' : ''}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Communiques({ data, onOpen }) {
  const a = data.messages.find((m) => m.variant === 'A');
  const b = data.messages.find((m) => m.variant === 'B');
  return (
    <div className="stack">
      <Callout tone="info" icon={Scale}>Deux communiqués datés du 24 septembre 2026 ont été déposés sur la plateforme en réponse au rendu « communiqué de crise » demandé par Leïla Mansouri : la version A à 16:40, la version B à 16:46 (dernière déposée). La B applique la consigne du rendu : n’affirmer que ce qui est prouvé, indiquer ses sources.</Callout>
      <div className="grid grid-2">
        {[a, b].map((m) => (
          <Card key={m.id} title={`Version ${m.variant} · déposée ${m.depositedAt}`} subtitle={documents.find((d) => d.id === m.docId)?.original} actions={<button type="button" className="btn btn--sm" onClick={() => onOpen(m)}>Lire</button>}>
            <p className="small secondary">{m.body[0]}</p>
          </Card>
        ))}
      </div>
      <Card title="Comparaison point par point" flush>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Sujet</th><th>Version A — Rendu_communication.pdf</th><th>Version B — communique_crise.pdf</th></tr></thead>
            <tbody>{data.communiqueComparison.map((c) => <tr key={c.topic}><td className="strong">{c.topic}</td><td className="small">{c.a}</td><td className="small">{c.b}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Inbound({ data, onOpen }) {
  return (
    <Card title="Demandes entrantes et réponses" subtitle="Recensées dans la main courante et le plan de containment" flush>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Demandeur</th><th>Quand</th><th>Demande</th><th>Réponse</th><th>Statut</th></tr></thead>
          <tbody>{data.inboundRequests.map((r) => {
            const m = data.messages.find((x) => x.id === r.response);
            return (
              <tr key={r.from}>
                <td className="strong">{r.from}</td><td className="mono nowrap">{r.when}</td><td>{r.request}</td>
                <td>{m ? <button type="button" className="btn btn--sm btn--ghost" onClick={() => onOpen(m)}><Mail size={13} /> {m.kind}</button> : <span className="muted">—</span>}</td>
                <td><ActionStatusBadge status={r.status} size="sm" />{r.note && <div className="tiny muted" style={{ marginTop: 4 }}>{r.note}</div>}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </Card>
  );
}

function Principles({ data }) {
  const fp = data.messages.filter((m) => m.closes);
  return (
    <div className="stack">
      <div className="grid grid-2">
        <Card title="Règles de communication" subtitle="Tirées de la note DC/2026/01, du PCA et du retour Risque / Conformité">
          <ul className="list">{data.communicationRules.map((r) => (
            <li key={r.rule} className="row" style={{ alignItems: 'flex-start', gap: 8 }}><BookCheck size={15} style={{ color: 'var(--good-text)', marginTop: 2, flexShrink: 0 }} /><div><div className="small">{r.rule}</div><div className="tiny muted">{r.source}</div></div></li>
          ))}</ul>
        </Card>
        <Card title="Présomption d’innocence préservée" subtitle="Pistes internes levées sans accusation publique">
          <ul className="list">{fp.map((m) => (
            <li key={m.id}>
              <div className="row" style={{ gap: 8 }}><UserCheck size={15} style={{ color: 'var(--good-text)' }} /><strong>{m.closes}</strong><span className="small">{m.subject}</span></div>
              <div className="small secondary" style={{ marginTop: 4 }}>{m.body[m.id === 'msg-badge2' ? 2 : 1]}</div>
            </li>
          ))}</ul>
        </Card>
      </div>
      <Card title="Plan de diffusion (PCA 4.4)" subtitle="Destinataire, message clé, canal, moment" flush>
        <div className="table-wrap">
          <table className="table"><thead><tr><th>Destinataire</th><th>Message clé</th><th>Canal</th><th>Moment</th></tr></thead>
            <tbody>{data.commPlan.map((c) => <tr key={c.audience}><td className="strong">{c.audience}</td><td>{c.message}</td><td>{c.channel}</td><td className="nowrap">{c.when}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Actions({ data }) {
  return (
    <Card title="Actions portées par la Communication" subtitle="Plan de containment, section 14 (M4, M5, M8, M9)" flush>
      <ul className="list" style={{ padding: '0 18px 8px' }}>
        {data.actions.map((a) => (
          <li key={a.id} className="row between" style={{ gap: 12 }}>
            <div><span className="chip">{a.id}</span> <span style={{ marginLeft: 6 }}>{a.action}</span>{a.note && <div className="tiny muted" style={{ marginTop: 4 }}>{a.note}</div>}</div>
            <ActionStatusBadge status={a.status} size="sm" />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function CommunicationDashboard({ cell, data }) {
  const [tab, setTab] = useTabParam('salle-de-presse');
  const [open, setOpen] = useState(null);
  const tabs = [
    { id: 'salle-de-presse', label: 'Salle de presse', icon: Newspaper, count: data.messages.length },
    { id: 'communiques', label: 'Communiqués', icon: Megaphone },
    { id: 'demandes', label: 'Demandes entrantes', icon: Inbox, count: data.inboundRequests.length },
    { id: 'regles', label: 'Règles & diffusion', icon: Scale },
    { id: 'actions', label: 'Actions', icon: ListChecks, count: data.actions.length },
    { id: 'team', label: 'Équipe & documents', icon: Users },
  ];
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'salle-de-presse' && <PressRoom data={data} onOpen={setOpen} />}
      {tab === 'communiques' && <Communiques data={data} onOpen={setOpen} />}
      {tab === 'demandes' && <Inbound data={data} onOpen={setOpen} />}
      {tab === 'regles' && <Principles data={data} />}
      {tab === 'actions' && <Actions data={data} />}
      {tab === 'team' && <CellOverviewFooter cell={cell} />}
      <MessageViewer message={open} all={data.messages} onClose={() => setOpen(null)} />
    </>
  );
}
