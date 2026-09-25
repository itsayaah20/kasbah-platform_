import { request } from './api';
import { evidence } from '../data/common/evidence';
import { serverInventory } from '../data/common/assets';
import { exfiltrationNights, vpnSessions } from '../data/soc/telemetry';
import { mitreTactics } from '../data/soc/threatIntel';
import { risks, riskLevel } from '../data/risque/compliance';
import { containmentActions, ACTION_STATUS } from '../data/continuite/plans';
import { hypotheses } from '../data/forensics/investigation';
import { cells } from '../data/common/cells';
import { documents } from '../data/common/documents';
import { alertSeed } from './alertService';
import { activitySeed } from './activityService';
import { countBy } from '../utils/format';

// Agrégats calculés à partir des données sources, jamais saisis à la main.
function buildStatistics() {
  const sheets = evidence.filter((e) => e.hasSheet);
  const verdicts = countBy(sheets, 'verdict');
  const verdictsByDay = ['J1', 'J2'].map((day) => {
    const d = sheets.filter((e) => e.day === day);
    return { day, preuve: d.filter((e) => e.verdict === 'preuve').length, bruit: d.filter((e) => e.verdict === 'bruit').length, 'fausse-piste': d.filter((e) => e.verdict === 'fausse-piste').length };
  });

  const activities = activitySeed();
  const alerts = alertSeed();
  const activityByCell = cells.map((c) => ({ cellId: c.id, name: c.name, count: activities.filter((a) => a.cellId === c.id).length }));
  const alertsByCell = cells.map((c) => {
    const own = alerts.filter((a) => a.cellId === c.id);
    return { cellId: c.id, name: c.name, critical: own.filter((a) => a.severity === 'critical').length, warning: own.filter((a) => a.severity === 'warning').length, info: own.filter((a) => a.severity === 'info').length, success: own.filter((a) => a.severity === 'success').length };
  });

  const actionStatus = Object.keys(ACTION_STATUS).map((s) => ({ status: s, label: ACTION_STATUS[s].label, count: containmentActions.filter((a) => a.status === s).length }));
  const actionGroups = [...new Set(containmentActions.map((a) => a.group))].map((group) => {
    const g = containmentActions.filter((a) => a.group === group);
    const row = { group };
    Object.keys(ACTION_STATUS).forEach((s) => { row[s] = g.filter((a) => a.status === s).length; });
    return row;
  });

  const riskLevels = ['critique', 'eleve', 'moyen', 'faible'].map((lvl) => ({ level: lvl, count: risks.filter((r) => riskLevel(r.score).level === lvl).length }));

  let cumul = 0;
  const exfilCumulative = exfiltrationNights.map((n) => {
    cumul += n.gb;
    return { ...n, cumulative: Math.round(cumul * 10) / 10 };
  });

  const qualified = evidence.filter((e) => e.cellVerdict && e.verdict !== 'a-confirmer');
  const verdictAgreement = [
    { label: 'Même verdict que la fiche', value: qualified.filter((e) => e.cellVerdict.verdict === e.verdict).length, color: 'var(--good)' },
    { label: 'Verdict différent', value: qualified.filter((e) => e.cellVerdict.verdict !== e.verdict).length, color: 'var(--warning)' },
  ];
  const confidence = ['sûr', 'à confirmer', null].map((c) => ({ label: c ? `Confiance : ${c}` : 'Non précisée', value: evidence.filter((e) => e.cellVerdict && (e.cellVerdict.confidence || null) === c).length, color: c === 'sûr' ? 'var(--series-3)' : c ? 'var(--series-4)' : 'var(--neutral)' }));

  return {
    verdictAgreement, confidence,
    verdicts, verdictsByDay,
    servers: serverInventory,
    exfiltration: exfilCumulative,
    vpnSessions,
    mitre: mitreTactics.map((t) => ({ tactic: t.label, count: t.techniques.length, inChain: t.inChain })),
    risks: risks.map((r) => ({ id: r.id, title: r.title, score: r.score, p: r.p, i: r.i, level: riskLevel(r.score).level })),
    riskLevels,
    actionStatus, actionGroups,
    hypotheses: hypotheses.filter((h) => h.confidence != null),
    activityByCell, alertsByCell,
    documentsByCell: cells.map((c) => ({ name: c.name, count: documents.filter((d) => d.cellId === c.id).length })),
    totals: { activities: activities.length, alerts: alerts.length, documents: documents.length, evidence: sheets.length, actions: containmentActions.length },
  };
}

export const statisticsService = {
  overview: () => request('/statistics', buildStatistics),
};
