import { request } from './api';
import { platformFeed, closedLeads } from '../data/common/platformFeed';
import { socIncidents } from '../data/soc/threatIntel';
import { risks, riskLevel } from '../data/risque/compliance';
import { containmentActions } from '../data/continuite/plans';
import { evidence } from '../data/common/evidence';
import { dayIndex, minutesOf } from '../utils/time';

// Indicateurs de performance calculés à partir des horodatages du fil de la plateforme.
// Hypothèse explicite : J1, J2 et J3 sont des jours calendaires consécutifs (23, 24 et
// 25/09/2026), donc 1 jour = 1 440 minutes. Les heures « ~ » sont des estimations.

const toMinutes = (stamp) => {
  const [day, time] = stamp.split(' ');
  const d = dayIndex(day);
  const t = minutesOf(time);
  return d == null || t == null ? null : d * 1440 + t;
};
const minutesBetween = (a, b) => {
  const x = toMinutes(a);
  const y = toMinutes(b);
  return x == null || y == null ? null : y - x;
};
const mean = (v) => (v.length ? v.reduce((s, x) => s + x, 0) / v.length : null);
const median = (v) => {
  if (!v.length) return null;
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// MTTR des signaux écartés : du premier message qui ouvre la piste (même pièce) à sa clôture « FP-n ».
function leadResolutions() {
  return closedLeads.map((lead) => {
    const ref = lead.evidence[0];
    const opening = platformFeed.find((f) => f.evidence?.includes(ref));
    const openedAt = opening ? `${opening.day} ${opening.time}` : null;
    return {
      code: lead.code,
      title: lead.title,
      ref,
      openedAt,
      openedBy: opening?.title || null,
      closedAt: lead.at,
      minutes: openedAt ? minutesBetween(openedAt, lead.at) : null,
      overnight: openedAt ? openedAt.split(' ')[0] !== lead.at.split(' ')[0] : false,
    };
  }).filter((l) => l.minutes != null).sort((a, b) => a.minutes - b.minutes);
}

function buildMetrics() {
  const leads = leadResolutions();
  const leadMinutes = leads.map((l) => l.minutes);
  const sameDay = leads.filter((l) => !l.overnight).map((l) => l.minutes);

  const resolvedIncidents = socIncidents.filter((i) => i.resolved);
  const incidentMinutes = resolvedIncidents.map((i) => minutesBetween(i.openedAt, i.resolvedAt));

  // Temps de confinement du rançongiciel : confirmation (A-01) → isolement de FIN-112 validé,
  // puis → confinement ciblé de l'ensemble du SI.
  const ransomware = socIncidents.find((i) => i.id === 'INC-001');
  const isolationValidated = platformFeed.find((f) => f.title === 'Isolement propre');
  const mttc = {
    patientZero: minutesBetween(ransomware.openedAt, `${isolationValidated.day} ${isolationValidated.time}`),
    patientZeroTo: `${isolationValidated.day} ${isolationValidated.time}`,
    network: minutesBetween(ransomware.openedAt, ransomware.containedAt),
    networkTo: ransomware.containedAt,
    from: ransomware.openedAt,
  };

  const done = containmentActions.filter((a) => a.status === 'fait').length;
  const qualified = evidence.filter((e) => e.cellVerdict).length;

  // Security Risk Score : criticité cumulée du registre rapportée au maximum possible.
  // Score = Σ(P × I) / (nombre de risques × 16) × 100. 100 = tous les risques à P4 × I4.
  const sum = risks.reduce((s, r) => s + r.score, 0);
  const max = risks.length * 16;
  const score = Math.round((sum / max) * 100);
  const contributions = risks
    .map((r) => ({ id: r.id, title: r.title, score: r.score, level: riskLevel(r.score).level, points: Math.round((r.score / max) * 1000) / 10 }))
    .sort((a, b) => b.score - a.score);

  return {
    assumption: 'J1, J2 et J3 sont des jours calendaires consécutifs (23, 24 et 25/09/2026). Les heures précédées de « ~ » sont estimées.',
    mttr: {
      meanMin: mean(leadMinutes),
      medianMin: median(leadMinutes),
      sameDayMeanMin: mean(sameDay),
      count: leads.length,
      items: leads,
      incidentMeanMin: mean(incidentMinutes),
      incidentItems: resolvedIncidents.map((i, k) => ({ id: i.id, title: i.title, openedAt: i.openedAt, resolvedAt: i.resolvedAt, minutes: incidentMinutes[k] })),
      method: 'Moyenne, pour chaque piste écartée (FP-n), du délai entre le premier message citant la pièce et le message de clôture.',
    },
    mttc,
    resolution: {
      incidents: { resolved: resolvedIncidents.length, total: socIncidents.length, rate: Math.round((resolvedIncidents.length / socIncidents.length) * 100), items: socIncidents },
      leads: { closed: leads.length },
      qualification: { qualified, total: evidence.length, rate: Math.round((qualified / evidence.length) * 100) },
      actions: { done, total: containmentActions.length, rate: Math.round((done / containmentActions.length) * 100) },
      method: 'Incidents dont la menace est neutralisée (contenus) / incidents identifiés par le SOC.',
    },
    riskScore: {
      score,
      sum,
      max,
      count: risks.length,
      level: score >= 75 ? 'critique' : score >= 50 ? 'élevé' : score >= 25 ? 'moyen' : 'faible',
      contributions,
      method: 'Σ(P × I) des 11 risques du registre / (11 × 16) × 100. Situation arrêtée J2 ~10:30 (Tableau de risques).',
    },
  };
}

export const metricsService = {
  overview: () => request('/metrics', buildMetrics),
};

export const metricsSeed = buildMetrics;
