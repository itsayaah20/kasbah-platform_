import { request } from './api';
import * as soc from '../data/soc/threatIntel';
import * as telemetry from '../data/soc/telemetry';
import { attackChronology, socFeed } from '../data/soc/feed';
import * as forensics from '../data/forensics/investigation';
import * as continuite from '../data/continuite/plans';
import * as risque from '../data/risque/compliance';
import * as direction from '../data/direction/coordination';
import * as communication from '../data/communication/messages';
import { assets, serverInventory } from '../data/common/assets';
import { evidence, evidenceStats } from '../data/common/evidence';
import { logbook } from '../data/common/logbook';
import { cellDecisions } from '../data/common/cellDecisions';
import { metricsSeed } from './metricsService';
import { formatDuration } from '../utils/format';

// Les KPI « N/A » du dossier SOC sont remplacés par les valeurs calculées (provenance « dérivé »).
function socKpisWithMetrics() {
  const m = metricsSeed();
  return soc.socKpis.map((k) => {
    if (k.id === 'mttr') return { ...k, label: 'MTTR · taux de résolution', value: `${formatDuration(m.mttr.meanMin)} · ${m.resolution.incidents.rate} %`, sub: `Médiane ${formatDuration(m.mttr.medianMin)} sur ${m.mttr.count} pistes ; ${m.resolution.incidents.resolved}/${m.resolution.incidents.total} incidents contenus`, source: 'Fil de la plateforme KASBAH', provenance: 'derived' };
    if (k.id === 'score') return { ...k, value: `${m.riskScore.score} / 100`, sub: `Σ(P × I) = ${m.riskScore.sum} sur ${m.riskScore.max} possibles`, source: 'Registre des risques R1–R11', provenance: 'derived' };
    return k;
  });
}

// Un endpoint par cellule : chaque tableau de bord ne reçoit que ses données.
export const socService = {
  dashboard: () => request('/cells/soc/dashboard', () => ({
    kpis: socKpisWithMetrics(), metrics: metricsSeed(), incidents: soc.socIncidents, iocs: soc.iocs, iocNote: soc.iocReputationNote,
    mitre: soc.mitreTactics, vulnerabilities: soc.vulnerabilities, vulnerabilityNote: soc.vulnerabilityNote,
    openQuestions: soc.socOpenQuestions, phases: soc.responsePhases,
    vpnSessions: telemetry.vpnSessions, exfiltration: telemetry.exfiltrationNights, exfilMeta: telemetry.exfiltrationMeta,
    volumeBySource: telemetry.volumeBySource, attackSequence: telemetry.attackSequence, accountProfile: telemetry.accountProfile,
    c2: telemetry.c2Stats, backupJobs: telemetry.backupJobs,
    chronology: attackChronology, feed: socFeed,
    servers: serverInventory, assets: assets.filter((a) => a.state),
    evidence: evidence.filter((e) => e.hasSheet), evidenceStats,
  })),
};

export const forensicsService = {
  dashboard: () => request('/cells/forensics/dashboard', () => ({
    ...forensics,
    evidence,
    preservation: continuite.evidenceToPreserve,
  })),
};

export const continuiteService = {
  dashboard: () => request('/cells/continuite/dashboard', () => ({
    ...continuite,
    bia: assets.filter((a) => a.bia),
    logbook,
  })),
};

export const risqueService = {
  // riskLevel est une fonction utilitaire : elle reste côté client, hors de la réponse.
  // eslint-disable-next-line no-unused-vars
  dashboard: () => request('/cells/risque/dashboard', () => { const { riskLevel, ...payload } = risque; return payload; }),
};

export const directionService = {
  dashboard: () => request('/cells/direction/dashboard', () => ({
    ...direction,
    cellDecisions,
    assets: assets.filter((a) => a.criticity),
    deadlines: continuite.deadlines,
    actions: continuite.containmentActions,
    logbook,
  })),
};

export const communicationService = {
  dashboard: () => request('/cells/communication/dashboard', () => ({
    ...communication,
    actions: continuite.containmentActions.filter((a) => a.cells.includes('communication')),
    commPlan: continuite.continuityCommPlan,
  })),
};

export const cellDashboardService = {
  soc: socService.dashboard,
  forensics: forensicsService.dashboard,
  continuite: continuiteService.dashboard,
  risque: risqueService.dashboard,
  direction: directionService.dashboard,
  communication: communicationService.dashboard,
};
