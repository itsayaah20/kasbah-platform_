import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { cellService, getCellMeta } from '../services/cellService';
import { cellDashboardService } from '../services/cellDataService';
import { statisticsService } from '../services/statisticsService';
import { AsyncContent } from '../components/common/States';
import { Breadcrumbs } from '../components/common/PageHeader';
import { CellHero } from '../features/shared';
import { CountBarChart } from '../components/charts/CountBarChart';
import {
  ExfiltrationChart, CumulativeExfilChart, VpnSessionsChart, VerdictChart, MitreTacticChart, HypothesisChart,
  ActionStatusChart, RiskScoreChart, ActivityByCellChart, AlertsByCellChart, STATUS_COLORS, VERDICT_COLORS,
} from '../components/charts/Widgets';
import { riskLevel } from '../data/risque/compliance';
import { useApp } from '../context/AppContext';
import NotFound from './NotFound';

const LEVEL_COLOR = { critique: 'var(--critical)', eleve: 'var(--serious)', moyen: 'var(--warning)', faible: 'var(--good)' };

function SocStats({ stats }) {
  return (
    <div className="grid grid-2">
      <ExfiltrationChart data={stats.exfiltration} />
      <CumulativeExfilChart data={stats.exfiltration} height={260} />
      <VpnSessionsChart data={stats.vpnSessions} />
      <VerdictChart data={stats.verdictsByDay} />
      <div className="span-2"><MitreTacticChart data={stats.mitre} /></div>
    </div>
  );
}

function ForensicsStats({ stats, data }) {
  const byVerdict = ['preuve', 'a-confirmer', 'fausse-piste', 'bruit'].map((v) => ({
    label: { preuve: 'Preuve', 'a-confirmer': 'À confirmer', 'fausse-piste': 'Fausse piste', bruit: 'Bruit' }[v],
    value: data.evidence.filter((e) => e.verdict === v).length,
    color: VERDICT_COLORS[v] || 'var(--warning)',
  }));
  const timelineStatus = ['Fait', 'Hypothèse', 'Bruit', 'À qualifier'].map((s, i) => ({ label: s, value: [...data.timelineOverview, ...data.timelineCritical].filter((t) => t.status === s).length, color: ['var(--series-1)', 'var(--warning)', 'var(--neutral)', 'var(--info)'][i] }));
  return (
    <div className="grid grid-2">
      <div className="span-2"><HypothesisChart data={stats.hypotheses} height={280} /></div>
      <CountBarChart title="Pièces par verdict (avec pièces sans fiche)" subtitle="25 pièces référencées" data={byVerdict} />
      <CountBarChart title="Événements de la frise par statut" subtitle="Frise v3 (J-21 → J1)" data={timelineStatus} />
    </div>
  );
}

function ContinuiteStats({ stats, data, overrides }) {
  const actions = data.containmentActions.map((a) => ({ ...a, status: overrides[a.id] || a.status }));
  const statusData = ['fait', 'en-cours', 'a-confirmer', 'a-faire', 'bloque'].map((s) => ({ label: { fait: 'Fait', 'en-cours': 'En cours', 'a-confirmer': 'À confirmer', 'a-faire': 'À faire', bloque: 'Bloqué' }[s], value: actions.filter((a) => a.status === s).length, color: STATUS_COLORS[s] }));
  const levels = ['Vital', 'Critique', 'Important', 'Secondaire'].map((l, i) => ({ label: l, value: data.bia.filter((b) => b.bia.level.startsWith(l)).length, color: ['var(--critical)', 'var(--serious)', 'var(--warning)', 'var(--good)'][i] }));
  const owners = Object.entries(actions.reduce((acc, a) => { acc[a.owner] = (acc[a.owner] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value, color: 'var(--series-3)' }));
  return (
    <div className="grid grid-2">
      <ActionStatusChart data={stats.actionGroups} />
      <CountBarChart title="Actions par statut" subtitle="Inclut les modifications locales éventuelles" data={statusData} height={260} />
      <CountBarChart title="Actifs par niveau d’impact (BIA)" subtitle="PCA / PRA, section 3" data={levels} />
      <CountBarChart title="Actions par porteur" subtitle="Top 8 des porteurs du plan" data={owners} labelWidth={170} />
    </div>
  );
}

function RisqueStats({ stats, data }) {
  const levels = ['critique', 'eleve', 'moyen', 'faible'].map((l) => ({ label: { critique: 'Critique', eleve: 'Élevé', moyen: 'Moyen', faible: 'Faible' }[l], value: data.risks.filter((r) => riskLevel(r.score).level === l).length, color: LEVEL_COLOR[l] }));
  const before = data.notificationObligations.filter((o) => o.status === 'fait').length;
  const after = data.notificationObligations.filter((o) => (o.update?.status || o.status) === 'fait').length;
  const probs = [4, 3, 2, 1].map((p) => ({ label: `Probabilité ${p}`, value: data.risks.filter((r) => r.p === p).length, color: 'var(--series-4)' }));
  return (
    <div className="grid grid-2">
      <div className="span-2"><RiskScoreChart data={stats.risks} /></div>
      <CountBarChart title="Risques par niveau" data={levels} />
      <CountBarChart title="Obligations « Fait »" subtitle="Évolution entre J2 ~10:30 et le soir de J2" data={[{ label: 'J2 ~10:30', value: before, color: 'var(--neutral)' }, { label: 'Soir J2', value: after, color: 'var(--good)' }]} />
      <CountBarChart title="Risques par probabilité" data={probs} />
    </div>
  );
}

function DirectionStats({ stats, data }) {
  const crit = ['C1', 'C2', 'C3', 'C4'].map((c, i) => ({ label: c, value: data.assets.filter((a) => a.criticity === c).length, color: ['var(--critical)', 'var(--serious)', 'var(--warning)', 'var(--good)'][i] }));
  const dec = [['fait', 'Fait'], ['a-confirmer', 'À confirmer'], ['bloque', 'Bloqué']].map(([s, l]) => ({ label: l, value: data.decisions.filter((d) => d.status === s).length, color: STATUS_COLORS[s] }));
  return (
    <div className="grid grid-2">
      <CountBarChart title="Actifs par niveau de criticité" subtitle="Cartographie Direction (C1–C4)" data={crit} />
      <CountBarChart title="Décisions par statut" subtitle="Registre D1–D5" data={dec} />
      <ActivityByCellChart data={stats.activityByCell} />
      <AlertsByCellChart data={stats.alertsByCell} />
    </div>
  );
}

function CommunicationStats({ data }) {
  const aud = [['interne', 'Cellule de crise'], ['salaries', 'Salariés'], ['clients', 'Clients'], ['presse', 'Presse'], ['public', 'Public']].map(([k, l], i) => ({ label: l, value: data.messages.filter((m) => m.audience === k).length, color: `var(--series-${i + 1})` }));
  const st = [['sent', 'Envoyé', 'var(--good)'], ['draft', 'Projet', 'var(--warning)'], ['superseded', 'Remplacé', 'var(--neutral)']].map(([k, l, c]) => ({ label: l, value: data.messages.filter((m) => m.status === k).length, color: c }));
  const inbound = [['fait', 'Traitées', 'var(--good)'], ['a-faire', 'À traiter', 'var(--warning)']].map(([k, l, c]) => ({ label: l, value: data.inboundRequests.filter((r) => r.status === k).length, color: c }));
  return (
    <div className="grid grid-3">
      <CountBarChart title="Messages par audience" data={aud} />
      <CountBarChart title="Messages par statut" data={st} />
      <CountBarChart title="Demandes entrantes" data={inbound} />
    </div>
  );
}

const STATS = { soc: SocStats, forensics: ForensicsStats, continuite: ContinuiteStats, risque: RisqueStats, direction: DirectionStats, communication: CommunicationStats };

async function load(id) {
  const [cell, data, stats] = await Promise.all([cellService.get(id), cellDashboardService[id](), statisticsService.overview()]);
  return { cell, data, stats };
}

export default function CellStatistics() {
  const { id } = useParams();
  const { overrides } = useApp();
  const state = useAsync(() => load(id), [id]);
  if (!getCellMeta(id)) return <NotFound />;
  const View = STATS[id];
  return (
    <AsyncContent state={state}>
      {({ cell, data, stats }) => (
        <>
          <Breadcrumbs items={[{ label: 'Cellules', to: '/cellules' }, { label: cell.fullName, to: `/cellules/${id}` }, { label: 'Statistiques' }]} />
          <CellHero cell={cell} />
          <View stats={stats} data={data} overrides={overrides} />
        </>
      )}
    </AsyncContent>
  );
}
