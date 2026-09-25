import { request } from './api';
import { logbook } from '../data/common/logbook';
import { platformFeed } from '../data/common/platformFeed';
import { cellDecisions } from '../data/common/cellDecisions';
import { messages } from '../data/communication/messages';
import { documents } from '../data/common/documents';
import { cells } from '../data/common/cells';
import { cellMembers } from '../data/common/people';
import { sortKey } from '../utils/time';

const responsibleOf = (cellId) => {
  const cell = cells.find((c) => c.id === cellId);
  return cellMembers.find((m) => m.id === cell?.responsibleId)?.name || null;
};

const VERDICT_STATUS = { preuve: 'Preuve', bruit: 'Bruit', 'fausse-piste': 'Fausse piste' };
const FEED_STATUS = { 'à analyser': 'À qualifier', 'à recouper': 'À recouper', 'à traiter': 'À traiter', 'ne pas répondre seul': 'Attaquant', consigne: 'Consigne' };
const KIND_MAP = { piece: 'evidence', signal: 'signal', decision: 'decision', attaquant: 'signal', pression: 'signal', interne: 'signal', consigne: 'signal', 'fin-journee': 'signal', rendu: 'document' };

function buildActivities() {
  const fromFeed = platformFeed.map((f) => {
    const decision = f.decisionId && f.kind === 'decision' ? cellDecisions.find((d) => d.id === f.decisionId) : null;
    return {
      id: `feed-${f.id}`,
      kind: KIND_MAP[f.kind] || 'signal',
      actor: f.author,
      cellId: f.cellId,
      action: f.kind === 'piece' && f.evidence?.length ? `${f.evidence[0]} — ${f.title}` : f.title,
      day: f.day,
      time: f.time,
      status: f.kind === 'piece' && f.verdict ? VERDICT_STATUS[f.verdict] : decision ? 'Décision' : f.closes ? 'Piste écartée' : FEED_STATUS[f.status] || (f.kind === 'fin-journee' ? 'Fin de journée' : f.kind === 'rendu' ? 'Rendu' : 'Tracé'),
      details: f.kind === 'piece' && f.verdict
        ? `Justification de la cellule : ${f.justification}${f.confidence ? ` (confiance : ${f.confidence})` : ''}`
        : decision ? `Choix : ${decision.options[decision.choice]}` : (f.decoded ? `${f.text} — ${f.decoded}` : f.text),
      evidence: f.evidence || [],
      source: 'Plateforme KASBAH',
    };
  });

  const fromLog = logbook.map((l, i) => ({
    id: `log-${i}`, kind: 'logbook',
    actor: l.source, cellId: l.cellId, action: l.event, day: l.day, time: l.time,
    status: l.decision ? 'Décision' : 'Tracé',
    details: `Main courante du Plan de containment (heure du document : ${l.docTime || l.time})`,
    evidence: l.evidence || [],
  }));

  const fromMessages = messages.map((m) => ({
    id: `msg-${m.id}`, kind: 'message',
    actor: 'Cellule de communication de crise', cellId: 'communication', action: m.subject, day: m.day,
    time: m.depositedAt ? m.depositedAt.split(' ')[1] : '',
    status: m.status === 'deposited' ? 'Déposé' : m.status === 'superseded' ? 'Remplacé' : 'Envoyé',
    details: m.body[0], evidence: m.evidence, dayInferred: !m.depositedAt && m.dayInferred,
  }));

  const deposited = new Set(['Rendu_communication.pdf', 'communique_crise.pdf']);
  const fromDocs = documents.filter((d) => !deposited.has(d.original)).map((d) => ({
    id: `doc-${d.id}`, kind: 'document',
    actor: responsibleOf(d.cellId) || 'Cellule', cellId: d.cellId, action: `Document produit : ${d.title}`, day: d.day,
    time: d.original.startsWith('cartographie') ? '15:57' : '',
    status: 'Déposé', details: `${d.kind} · ${d.original}`, evidence: [], docId: d.id, dayInferred: !d.original.startsWith('cartographie'),
  }));

  return [...fromFeed, ...fromLog, ...fromMessages, ...fromDocs]
    .map((a) => ({ ...a, sortKey: sortKey(a.day, a.time) }))
    .sort((x, y) => y.sortKey - x.sortKey);
}

export const activityService = {
  list: () => request('/activities', buildActivities),
};

export const activitySeed = buildActivities;
