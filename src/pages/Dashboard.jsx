import { Link, useNavigate } from 'react-router-dom';
import { Boxes, ServerCrash, CloudUpload, FileSearch, BellRing, ListChecks, Hourglass, ArrowRight, ShieldAlert, Clock3, Gavel, Gauge, Timer } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { statisticsService } from '../services/statisticsService';
import { cellService } from '../services/cellService';
import { activityService } from '../services/activityService';
import { useAlerts } from '../context/AlertsContext';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/cards/StatCard';
import { CellCard } from '../components/cards/CellCard';
import { Card } from '../components/common/Card';
import { AsyncContent } from '../components/common/States';
import { ActionStatusBadge, StatusBadge } from '../components/common/Badge';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { AlertCard } from '../components/alerts/AlertCard';
import { ExfiltrationChart, ServerStateBar, ActivityByCellChart, ActionStatusChart, VerdictChart } from '../components/charts/Widgets';
import { incident } from '../data/common/incident';
import { deadlines } from '../data/continuite/plans';
import { metricsService } from '../services/metricsService';
import { formatDuration } from '../utils/format';

async function loadDashboard() {
  const [stats, cells, activities, metrics] = await Promise.all([statisticsService.overview(), cellService.list(), activityService.list(), metricsService.overview()]);
  return { stats, cells, activities, metrics };
}

export default function Dashboard() {
  const state = useAsync(loadDashboard, []);
  const { alerts, unreadCount, markRead } = useAlerts();
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        eyebrow={<><ShieldAlert size={13} /> Incident {incident.code} · {incident.qualification}</>}
        title={user ? `Bonjour ${user.name.split(' ')[0]}, voici la situation` : 'Situation de crise'}
        description={`${incident.malware} revendiqué par ${incident.attacker}. Entrée : ${incident.entryVector}. Situation arrêtée : ${incident.situationAsOf}.`}
        actions={(
          <>
            <Link to="/alertes" className="btn"><BellRing size={15} /> Centre d’alertes</Link>
            <Link to="/statistiques" className="btn btn--primary">Analytics <ArrowRight size={15} /></Link>
          </>
        )}
      />

      <AsyncContent state={state}>
        {({ stats, cells, activities, metrics }) => {
          const actionsDone = stats.actionStatus.find((s) => s.status === 'fait')?.count || 0;
          const openCritical = alerts.filter((a) => a.severity === 'critical' && !a.archived);
          const lastByCell = (id) => activities.find((a) => a.cellId === id && a.time);
          return (
            <div className="stack" style={{ gap: 20 }}>
              <div className="callout callout--critical">
                <Hourglass size={16} />
                <div className="grow">
                  <strong>Ultimatum {incident.attacker} : {incident.ransomEscalation.amount} avant {incident.ransomEscalation.deadline}.</strong> Après la décision de temporiser (J3), la rançon initiale de {incident.ransom.amount} a doublé et {incident.ransomEscalation.leaks.toLowerCase()}. Décision finale (payer ou non) :{' '}
                  <ActionStatusBadge status="bloque" size="sm" /> — la reprise se fait depuis la copie hors ligne de Settat (J-42). Risque global : <strong>{incident.globalRisk}</strong> <span className="muted">(qualitatif)</span>.
                </div>
              </div>

              <div className="grid grid-kpi">
                <StatCard label="Cellules mobilisées" value="6" sub="SOC, Forensics, Continuité, Risque, Direction, Communication" icon={Boxes} provenance="real" onClick={() => navigate('/cellules')} />
                <StatCard label="Serveurs chiffrés" value="23" unit="/ 40" sub="57,5 % du parc · SCCM J2 10:00" icon={ServerCrash} tone="critical" provenance="real" source="A-13" />
                <StatCard label="Données exfiltrées" value="117,8" unit="Go" sub="10 nuits, J-10 → J-1" icon={CloudUpload} tone="critical" provenance="real" source="A-03" />
                <StatCard label="Pièces qualifiées" value={stats.totals.evidence} sub={`${stats.verdicts.preuve} preuves · ${stats.verdicts.bruit + stats.verdicts['fausse-piste']} écartées`} icon={FileSearch} tone="info" provenance="real" onClick={() => navigate('/pieces')} />
                <StatCard label="Alertes non lues" value={unreadCount} sub={`${openCritical.length} critiques au total`} icon={BellRing} tone="warning" provenance="derived" onClick={() => navigate('/alertes')} />
                <StatCard label="Actions réalisées" value={actionsDone} unit={`/ ${stats.totals.actions}`} sub="Plan de containment" icon={ListChecks} tone="good" provenance="derived" onClick={() => navigate('/cellules/continuite?tab=containment')} />
                <StatCard label="Security Risk Score" value={metrics.riskScore.score} unit="/ 100" sub={`Niveau ${metrics.riskScore.level} · registre R1–R11`} icon={Gauge} tone="critical" provenance="derived" onClick={() => navigate('/statistiques')} />
                <StatCard label="MTTR · résolution" value={formatDuration(metrics.mttr.meanMin)} sub={`Médiane ${formatDuration(metrics.mttr.medianMin)} · ${metrics.resolution.incidents.rate} % d’incidents résolus`} icon={Timer} tone="info" provenance="derived" onClick={() => navigate('/statistiques')} />
                <StatCard label="Décisions tracées" value="12" sub="Plateforme KASBAH, actes I à III" icon={Gavel} tone="info" provenance="real" onClick={() => navigate('/decisions')} />
              </div>

              <div className="grid grid-main-side">
                <ExfiltrationChart data={stats.exfiltration} />
                <Card title="État du parc serveurs" subtitle="Inventaire SCCM (A-13) · 40 serveurs" footer={<span>{stats.servers.note}</span>}>
                  <ServerStateBar servers={stats.servers} />
                  <div style={{ marginTop: 16 }} className="stack-sm">
                    <div className="small muted">Chiffrés nommés</div>
                    <div className="row-wrap">{stats.servers.encryptedNamed.map((s) => <span key={s} className="chip">{s}</span>)}<span className="chip">+{stats.servers.encryptedUnnamed} non nommés</span></div>
                    <div className="small muted" style={{ marginTop: 6 }}>Intacts</div>
                    <div className="row-wrap">{['DC-02', 'WEB-PUB-01', 'SCADA-HMI-*'].map((s) => <span key={s} className="chip">{s}</span>)}</div>
                  </div>
                </Card>
              </div>

              <div>
                <div className="section-title"><h2>Les 6 cellules</h2><Link to="/cellules" className="btn btn--ghost btn--sm">Tout voir <ArrowRight size={13} /></Link></div>
                <div className="grid grid-3">
                  {cells.map((c) => {
                    const own = alerts.filter((a) => a.cellId === c.id && !a.archived);
                    const last = lastByCell(c.id);
                    return (
                      <CellCard key={c.id} cell={c} alerts={own.length} criticalAlerts={own.filter((a) => a.severity === 'critical').length} activities={stats.activityByCell.find((x) => x.cellId === c.id)?.count || 0} lastActivity={last ? `${last.day} ${last.time}` : null} />
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-3">
                <ActionStatusChart data={stats.actionGroups} />
                <ActivityByCellChart data={stats.activityByCell} />
                <VerdictChart data={stats.verdictsByDay} />
              </div>

              <div className="grid grid-main-side">
                <Card title="Dernières activités" subtitle="Fil de la plateforme, main courante, décisions" actions={<Link to="/activites" className="btn btn--ghost btn--sm">Tout voir</Link>}>
                  <ActivityTimeline items={activities.filter((a) => a.time).slice(0, 9)} />
                </Card>
                <div className="stack">
                  <Card title="Échéances à surveiller" subtitle="Plan de containment, mis à jour avec la plateforme" flush>
                    <ul className="list" style={{ padding: '0 18px 8px' }}>
                      {deadlines.map((d) => (
                        <li key={d.id} className="row between" style={{ alignItems: 'flex-start', gap: 10 }}>
                          <div className="grow">
                            <div style={{ fontWeight: 500 }}>{d.object}</div>
                            <div className="small muted row" style={{ gap: 5 }}><Clock3 size={12} /> {d.when}</div>
                          </div>
                          <ActionStatusBadge status={d.status} size="sm" />
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card title="Alertes critiques récentes" flush actions={<StatusBadge tone="critical" size="sm">{openCritical.length}</StatusBadge>}>
                    {openCritical.slice(0, 4).map((a) => (
                      <AlertCard key={a.id} alert={a} compact onOpen={() => { markRead(a.id); navigate(`/alertes?id=${encodeURIComponent(a.id)}`); }} />
                    ))}
                  </Card>
                </div>
              </div>
            </div>
          );
        }}
      </AsyncContent>
    </>
  );
}
