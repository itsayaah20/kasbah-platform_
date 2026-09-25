import { request } from './api';
import { platformFeed } from '../data/common/platformFeed';
import { deadlines, containmentActions } from '../data/continuite/plans';
import { notificationObligations } from '../data/risque/compliance';
import { inboundRequests } from '../data/communication/messages';
import { openPoints } from '../data/forensics/investigation';
import { sortKey } from '../utils/time';

// Les alertes sont dérivées du fil de la plateforme KASBAH et des documents. Sévérité :
//  - critical : message de l'attaquant ou pièce qualifiée « preuve » par la cellule
//  - warning  : signal à analyser, pression externe à traiter, échéance ou obligation ouverte
//  - success  : piste écartée (FP-n), pièce classée bruit / fausse piste, échéance tenue
//  - info     : consignes, messages internes à recouper, points ouverts
export const SEVERITIES = {
  critical: { label: 'Critique', tone: 'critical' },
  warning: { label: 'Avertissement', tone: 'warning' },
  info: { label: 'Information', tone: 'info' },
  success: { label: 'Résolu', tone: 'good' },
};

function severityOf(item) {
  if (item.kind === 'attaquant') return 'critical';
  if (item.kind === 'piece') return item.verdict === 'preuve' ? 'critical' : item.verdict ? 'success' : 'warning';
  if (item.closes) return 'success';
  if (item.kind === 'signal' || item.kind === 'pression') return 'warning';
  return 'info';
}

const DEADLINE_CELL = { ultimatum: 'direction', autorite: 'risque', assureur: 'risque', cherifienne: 'communication', paie: 'continuite' };

function buildAlerts() {
  const fromFeed = platformFeed
    .filter((f) => !['decision', 'fin-journee', 'rendu'].includes(f.kind))
    .map((f) => ({
      id: `pf-${f.day}-${f.time}-${f.id}`,
      severity: severityOf(f),
      title: f.title,
      description: f.decoded ? `${f.text} — ${f.decoded}` : f.text,
      source: f.author,
      cellId: f.cellId,
      day: f.day,
      time: f.time,
      evidence: f.evidence || [],
      origin: 'Fil de la plateforme KASBAH',
    }));

  const fromDeadlines = deadlines.map((d) => ({
    id: `deadline-${d.id}`,
    severity: d.status === 'fait' ? 'success' : d.status === 'bloque' ? 'critical' : 'warning',
    title: `Échéance : ${d.object}`,
    description: `${d.when} — ${d.todo}${d.statusNote ? ` (${d.statusNote})` : ''}`,
    source: 'Plan de containment',
    cellId: DEADLINE_CELL[d.id],
    day: 'J3',
    time: '13:08',
    evidence: [],
    origin: 'Échéances à surveiller',
  }));

  const fromBlocked = containmentActions
    .filter((a) => a.status === 'bloque')
    .map((a) => ({
      id: `action-${a.id}`,
      severity: 'warning',
      title: `Action ${a.id} bloquée`,
      description: `${a.action} — ${a.condition || 'en attente d’une décision ou d’un tiers'}`,
      source: a.owner,
      cellId: a.cells[0] || 'continuite',
      day: 'J2', time: '~16:35', evidence: [], origin: 'Plan de containment',
    }));

  const fromObligations = notificationObligations
    .filter((o) => (o.update?.status || o.status) !== 'fait')
    .map((o) => ({
      id: `obligation-${o.id}`,
      severity: 'warning',
      title: `Obligation ouverte : ${o.recipient}`,
      description: `${o.deadline} — ${o.content}${o.update ? ` (${o.update.note})` : ''}`,
      source: o.owner,
      cellId: 'risque',
      day: 'J2', time: '10:30', evidence: [], origin: 'Tableau de risques',
    }));

  const fromInbound = inboundRequests
    .filter((r) => r.status !== 'fait')
    .map((r, i) => ({
      id: `inbound-${i}`,
      severity: 'warning',
      title: `Sans réponse : ${r.from}`,
      description: `${r.request} — ${r.when}${r.note ? ` (${r.note})` : ''}`,
      source: 'Communication',
      cellId: 'communication',
      day: r.when.split(' ')[0].startsWith('J') ? r.when.split(' ')[0] : 'J2',
      time: r.when.split(' ')[1] || '',
      evidence: [], origin: 'Demandes entrantes',
    }));

  const fromForensics = openPoints.map((p, i) => ({
    id: `forensics-open-${i}`,
    severity: 'info',
    title: `Point ouvert : ${p.title}`,
    description: p.detail,
    source: 'Cellule d’investigation',
    cellId: 'forensics',
    day: 'J1', time: '', evidence: p.evidence, origin: 'hypothesis_v3.pdf',
  }));

  return [...fromFeed, ...fromDeadlines, ...fromBlocked, ...fromObligations, ...fromInbound, ...fromForensics]
    .map((a) => ({ ...a, sortKey: sortKey(a.day, a.time) }))
    .sort((x, y) => y.sortKey - x.sortKey);
}

export const alertService = {
  list: () => request('/alerts', buildAlerts),
};

export const alertSeed = buildAlerts;
