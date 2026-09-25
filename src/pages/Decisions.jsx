import { useState } from 'react';
import { Gavel, Info } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { decisionService } from '../services/decisionService';
import { allCells } from '../services/cellService';
import { PageHeader } from '../components/common/PageHeader';
import { AsyncContent } from '../components/common/States';
import { Callout } from '../components/common/Card';
import { Segmented, Select } from '../components/common/Controls';
import { DecisionCard } from '../components/cards/DecisionCard';
import { StatCard } from '../components/cards/StatCard';

export default function Decisions() {
  const state = useAsync(() => decisionService.list(), []);
  const [cell, setCell] = useState('all');
  const [day, setDay] = useState('all');

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Décisions' }]}
        eyebrow="Monitoring"
        title="Décisions de la cellule"
        description="Les 12 décisions tracées sur la plateforme KASBAH : la question posée, les options, le choix retenu et les réactions qui ont suivi."
      />
      <AsyncContent state={state}>
        {(decisions) => {
          const list = decisions.filter((d) => (cell === 'all' || d.cellId === cell) && (day === 'all' || d.day === day));
          return (
            <div className="stack">
              <div className="grid grid-kpi">
                <StatCard label="Décisions tracées" value={decisions.length} sub="Actes I à III" icon={Gavel} provenance="real" source="KASBAH · Cellule.pdf" />
                <StatCard label="Acte I" value={decisions.filter((d) => d.day === 'J1').length} sub="Signaux faibles" />
                <StatCard label="Acte II" value={decisions.filter((d) => d.day === 'J2').length} sub="L’ultimatum" />
                <StatCard label="Acte III" value={decisions.filter((d) => d.day === 'J3').length} sub="Reconstruire" />
              </div>
              <Callout tone="info" icon={Info}>Les heures précédées de « ~ » sont situées entre deux messages horodatés du fil : la plateforme n’affiche pas l’heure exacte du choix.</Callout>
              <div className="filter-bar">
                <Segmented value={day} onChange={setDay} ariaLabel="Acte" options={[{ value: 'all', label: 'Tous' }, { value: 'J1', label: 'Acte I' }, { value: 'J2', label: 'Acte II' }, { value: 'J3', label: 'Acte III' }]} />
                <Select value={cell} onChange={setCell} ariaLabel="Cellule" options={[{ value: 'all', label: 'Toutes les cellules' }, ...allCells.map((c) => ({ value: c.id, label: c.fullName }))]} />
              </div>
              <div className="grid grid-2">{list.map((d) => <DecisionCard key={d.id} decision={d} />)}</div>
            </div>
          );
        }}
      </AsyncContent>
    </>
  );
}
