import { useState } from 'react';
import { Moon, Sun, Timer, Bug, Trash2, Server, Rows3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAlerts } from '../context/AlertsContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/common/PageHeader';
import { Card, Callout } from '../components/common/Card';
import { Segmented, Switch } from '../components/common/Controls';
import { ConfirmDialog } from '../components/common/Modal';

function Row({ icon: Icon, title, desc, children }) {
  return (
    <div className="settings-row">
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <span className="stat-card__icon"><Icon size={16} /></span>
        <div><div style={{ fontWeight: 500 }}>{title}</div><div className="small muted">{desc}</div></div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme, settings, setSettings, resetOverrides } = useApp();
  const { resetAll, reload } = useAlerts();
  const { toast } = useToast();
  const [confirm, setConfirm] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <>
      <PageHeader breadcrumbs={[{ label: 'Tableau de bord', to: '/dashboard' }, { label: 'Paramètres' }]} eyebrow="Système" title="Paramètres" description="Préférences d’affichage et comportement de la couche de données." />
      <div className="stack" style={{ maxWidth: 860 }}>
        <Card title="Apparence">
          <Row icon={theme === 'dark' ? Moon : Sun} title="Thème" desc="Sombre (salle de crise) ou clair (impression, projection).">
            <Segmented value={theme} onChange={setTheme} ariaLabel="Thème" options={[{ value: 'dark', label: 'Sombre', icon: Moon }, { value: 'light', label: 'Clair', icon: Sun }]} />
          </Row>
          <Row icon={Rows3} title="Densité" desc="Espacement des tableaux.">
            <Segmented value={settings.density} onChange={(v) => { setSettings({ density: v }); document.documentElement.dataset.density = v; }} ariaLabel="Densité" options={[{ value: 'comfortable', label: 'Confortable' }, { value: 'compact', label: 'Compacte' }]} />
          </Row>
        </Card>

        <Card title="Couche de données">
          <Callout tone="info" icon={Server}>
            {apiUrl ? <>Backend connecté : <span className="mono">{apiUrl}</span>.</> : <>Mode local : les services lisent <span className="mono">src/data</span>. Définir <span className="mono">VITE_API_URL</span> pour brancher un backend sans modifier l’interface.</>}
          </Callout>
          <Row icon={Timer} title="Latence simulée" desc={`${settings.latency} ms par appel de service (affiche les états de chargement).`}>
            <input type="range" className="range" min={0} max={1500} step={50} value={settings.latency} onChange={(e) => setSettings({ latency: Number(e.target.value) })} aria-label="Latence simulée" style={{ width: 180 }} />
          </Row>
          <Row icon={Bug} title="Simuler des erreurs réseau" desc="Environ un appel sur trois échoue : démontre les états d’erreur et le bouton « Réessayer ».">
            <Switch checked={settings.simulateErrors} onChange={(v) => { setSettings({ simulateErrors: v }); toast(v ? 'Erreurs simulées activées' : 'Erreurs simulées désactivées', { tone: v ? 'warning' : 'good' }); if (!v) reload(); }} label="Simuler des erreurs" />
          </Row>
        </Card>

        <Card title="Données locales">
          <Row icon={Trash2} title="Réinitialiser les modifications" desc="Statuts d’actions modifiés, alertes lues / archivées / supprimées.">
            <button type="button" className="btn btn--danger btn--sm" onClick={() => setConfirm(true)}>Réinitialiser</button>
          </Row>
        </Card>
      </div>
      <ConfirmDialog open={confirm} danger title="Réinitialiser les données locales ?" message="Les données sources ne sont jamais modifiées ; seules vos modifications dans ce navigateur sont effacées." confirmLabel="Réinitialiser"
        onCancel={() => setConfirm(false)} onConfirm={() => { resetOverrides(); resetAll(); setConfirm(false); toast('Données locales réinitialisées'); }} />
    </>
  );
}
