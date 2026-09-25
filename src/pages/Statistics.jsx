import { useState } from 'react';
import { ServerCrash, CloudUpload, FileSearch, ListChecks, Activity, BellRing, Scale, Lightbulb } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { statisticsService } from '../services/statisticsService';
import { metricsService } from '../services/metricsService';
import { RiskScoreCard, LeadDurationChart } from '../components/charts/Performance';
import { Callout } from '../components/common/Card';
import { formatDuration } from '../utils/format';
import { Timer, ShieldCheck, Gauge, Info } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent } from '../components/common/States';
import { Segmented } from '../components/common/Controls';
import { StatCard } from '../components/cards/StatCard';
import { CountBarChart } from '../components/charts/CountBarChart';
import {
  ExfiltrationChart, CumulativeExfilChart, VpnSessionsChart, VerdictChart, MitreTacticChart, HypothesisChart, ActionStatusChart,
  RiskScoreChart, ActivityByCellChart, AlertsByCellChart,
} from '../components/charts/Widgets';

export default function Statistics() {
  const state = useAsync(async () => {
    const [s, m] = await Promise.all([statisticsService.overview(), metricsService.overview()]);
    return { ...s, metrics: m };
  }, []);
  const [section, setSection] = useState('all');
  const show = (s) => section === 'all' || section === s;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Statistiques' }]}
        eyebrow="Analytics"
        title="Statistiques & analytics"
        description="Tous les graphiques sont calculés à partir des données du dossier. Chaque carte offre une vue tableau (icône en haut à droite)."
        actions={<Segmented value={section} onChange={setSection} ariaLabel="Section" options={[
          { value: 'all', label: 'Tout' }, { value: 'performance', label: 'Performance' }, { value: 'menace', label: 'Menace' }, { value: 'reponse', label: 'Réponse' }, { value: 'organisation', label: 'Organisation' },
        ]} />}
      />
      <AsyncContent state={state}>
        {(s) => (
          <div className="stack" style={{ gap: 20 }}>
            <div className="grid grid-kpi">
              <StatCard label="Serveurs chiffrés" value="57,5 %" sub="23 sur 40" icon={ServerCrash} tone="critical" provenance="real" />
              <StatCard label="Exfiltration moyenne / nuit" value="11,8" unit="Go" sub="117,8 Go / 10 nuits" icon={CloudUpload} tone="critical" provenance="derived" />
              <StatCard label="Taux de pièces écartées" value="57 %" sub="12 sur 21 fiches" icon={FileSearch} tone="info" provenance="derived" />
              <StatCard label="Actions containment faites" value={`${Math.round(((s.actionStatus.find((a) => a.status === 'fait')?.count || 0) / s.totals.actions) * 100)} %`} sub={`${s.actionStatus.find((a) => a.status === 'fait')?.count} sur ${s.totals.actions}`} icon={ListChecks} tone="good" provenance="derived" />
              <StatCard label="Activités tracées" value={s.totals.activities} sub="Toutes cellules" icon={Activity} provenance="derived" />
              <StatCard label="Alertes générées" value={s.totals.alerts} sub="Dérivées des sources" icon={BellRing} tone="warning" provenance="derived" />
            </div>

            {show('performance') && (
              <>
                <div className="section-title"><h2>Performance de la réponse</h2></div>
                <div className="grid grid-kpi">
                  <StatCard label="MTTR (pistes écartées)" value={formatDuration(s.metrics.mttr.meanMin)} sub={`Médiane ${formatDuration(s.metrics.mttr.medianMin)} · ${s.metrics.mttr.count} pistes · même jour : ${formatDuration(s.metrics.mttr.sameDayMeanMin)}`} icon={Timer} tone="info" provenance="derived" />
                  <StatCard label="Taux de résolution des incidents" value={`${s.metrics.resolution.incidents.rate} %`} sub={`${s.metrics.resolution.incidents.resolved} / ${s.metrics.resolution.incidents.total} contenus · délai moyen ${formatDuration(s.metrics.mttr.incidentMeanMin)}`} icon={ShieldCheck} tone="warning" provenance="derived" />
                  <StatCard label="Confinement du patient zéro" value={formatDuration(s.metrics.mttc.patientZero)} sub={`${s.metrics.mttc.from} → ${s.metrics.mttc.patientZeroTo} (isolement validé)`} icon={Timer} tone="good" provenance="derived" />
                  <StatCard label="Confinement du réseau" value={formatDuration(s.metrics.mttc.network)} sub={`${s.metrics.mttc.from} → ${s.metrics.mttc.networkTo} (isolement ciblé)`} icon={Timer} tone="warning" provenance="derived" />
                  <StatCard label="Security Risk Score" value={s.metrics.riskScore.score} unit="/ 100" sub={`Niveau ${s.metrics.riskScore.level} · Σ(P × I) = ${s.metrics.riskScore.sum} / ${s.metrics.riskScore.max}`} icon={Gauge} tone="critical" provenance="derived" />
                  <StatCard label="Pièces qualifiées" value={`${s.metrics.resolution.qualification.rate} %`} sub={`${s.metrics.resolution.qualification.qualified} / ${s.metrics.resolution.qualification.total} avec un verdict de la cellule`} icon={ShieldCheck} tone="good" provenance="derived" />
                </div>
                <div className="grid grid-2">
                  <LeadDurationChart mttr={s.metrics.mttr} />
                  <RiskScoreCard risk={s.metrics.riskScore} />
                </div>
                <Callout tone="info" icon={Info}>
                  <strong>Méthodes.</strong> MTTR : {s.metrics.mttr.method} Taux de résolution : {s.metrics.resolution.method} Hypothèse : {s.metrics.assumption} Les deux pistes clôturées le lendemain (FP-2, FP-6) tirent la moyenne vers le haut : la médiane est plus représentative.
                </Callout>
              </>
            )}

            {show('menace') && (
              <>
                <div className="section-title"><h2>Menace et impact</h2></div>
                <div className="grid grid-2">
                  <ExfiltrationChart data={s.exfiltration} />
                  <CumulativeExfilChart data={s.exfiltration} height={260} />
                  <VpnSessionsChart data={s.vpnSessions} />
                  <MitreTacticChart data={s.mitre} />
                </div>
              </>
            )}

            {show('reponse') && (
              <>
                <div className="section-title"><h2>Réponse et investigation</h2></div>
                <div className="grid grid-2">
                  <VerdictChart data={s.verdictsByDay} />
                  <ActionStatusChart data={s.actionGroups} />
                  <HypothesisChart data={s.hypotheses} />
                  <RiskScoreChart data={s.risks} />
                  <CountBarChart title="Verdicts de la cellule vs fiches de traçabilité" subtitle="Pièces qualifiées sur la plateforme (écarts : A-19, A-21, A-24, A-40)" data={s.verdictAgreement} labelWidth={180} />
                  <CountBarChart title="Confiance déclarée par la cellule" subtitle="Sur les verdicts posés sur la plateforme" data={s.confidence} labelWidth={180} />
                </div>
              </>
            )}

            {show('organisation') && (
              <>
                <div className="section-title"><h2>Organisation de crise</h2></div>
                <div className="grid grid-3">
                  <ActivityByCellChart data={s.activityByCell} />
                  <AlertsByCellChart data={s.alertsByCell} />
                  <CountBarChart title="Documents par cellule" subtitle="27 fichiers dans Data/" data={s.documentsByCell.map((d, i) => ({ label: d.name, value: d.count, color: `var(--series-${[1, 2, 3, 4, 6, 5][i]})` }))} height={240} />
                </div>
              </>
            )}
            <p className="tiny muted row" style={{ gap: 6 }}><Scale size={12} /> Réel = lu dans une pièce · Dérivé = calculé à partir des données · N/A = absent des sources. <Lightbulb size={12} /> Le Security Risk Score et le MTTR sont dérivés : leur formule est affichée dans la section Performance.</p>
          </div>
        )}
      </AsyncContent>
    </>
  );
}
