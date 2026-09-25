import { LayoutDashboard, Siren, Filter, ScrollText, Crosshair, Grid3x3, Server, Bug, Users } from 'lucide-react';
import { Tabs } from '../../components/common/Controls';
import { useTabParam } from '../../hooks/useMisc';
import { SocOverview } from './SocOverview';
import { SocIncidents, SocTriage, SocEvents, SocIntel, SocMitre, SocAssets, SocVulns } from './SocTabs';
import { CellOverviewFooter } from '../shared';

export default function SocDashboard({ cell, data }) {
  const [tab, setTab] = useTabParam('overview');
  const tabs = [
    { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents', icon: Siren, count: data.incidents.length },
    { id: 'triage', label: 'Triage des pièces', icon: Filter, count: data.evidence.length },
    { id: 'events', label: 'Événements', icon: ScrollText },
    { id: 'intel', label: 'Threat Intel', icon: Crosshair, count: data.iocs.length },
    { id: 'mitre', label: 'MITRE ATT&CK', icon: Grid3x3 },
    { id: 'assets', label: 'Actifs', icon: Server, count: data.assets.length },
    { id: 'vulns', label: 'Faiblesses', icon: Bug, count: data.vulnerabilities.length },
    { id: 'team', label: 'Équipe & documents', icon: Users },
  ];
  return (
    <>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'overview' && <SocOverview data={data} />}
      {tab === 'incidents' && <SocIncidents data={data} />}
      {tab === 'triage' && <SocTriage data={data} />}
      {tab === 'events' && <SocEvents data={data} />}
      {tab === 'intel' && <SocIntel data={data} />}
      {tab === 'mitre' && <SocMitre data={data} />}
      {tab === 'assets' && <SocAssets data={data} />}
      {tab === 'vulns' && <SocVulns data={data} />}
      {tab === 'team' && <CellOverviewFooter cell={cell} />}
    </>
  );
}
