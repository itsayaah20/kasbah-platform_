import { useState } from 'react';
import { Copy, ImageOff, Link2, Scale } from 'lucide-react';
import { Modal } from '../common/Modal';
import { VerdictBadge, Badge } from '../common/Badge';
import { KeyValue } from '../common/Card';
import { Tabs } from '../common/Controls';
import { useToast } from '../../context/ToastContext';

export function EvidenceModal({ evidence, onClose }) {
  const [tab, setTab] = useState('analyse');
  const { toast } = useToast();
  if (!evidence) return null;
  const e = evidence;

  const copyHash = () => navigator.clipboard?.writeText(e.sha256).then(() => toast('Empreinte copiée', { description: e.ref, tone: 'info' }));
  const copyLink = () => navigator.clipboard?.writeText(`${window.location.origin}/pieces?ref=${e.ref}`).then(() => toast('Lien copié', { tone: 'info' }));

  return (
    <Modal
      open
      onClose={() => { setTab('analyse'); onClose(); }}
      size="lg"
      title={<span className="row" style={{ gap: 10 }}><span className="chip">{e.ref}</span>{e.title}</span>}
      labelledBy={`${e.ref} ${e.title}`}
      subtitle={<span className="row-wrap"><VerdictBadge verdict={e.verdict} size="sm" /> {e.tool} · {e.date}</span>}
      footer={(
        <>
          <button type="button" className="btn" onClick={copyLink}><Link2 size={14} /> Copier le lien</button>
          <button type="button" className="btn btn--primary" onClick={onClose}>Fermer</button>
        </>
      )}
    >
      <p className="secondary" style={{ marginBottom: 16 }}>{e.summary}</p>
      {e.cellVerdict && (
        <div className={`callout ${e.cellVerdict.verdict !== e.verdict && e.verdict !== 'a-confirmer' ? 'callout--warning' : ''}`} style={{ marginBottom: 16 }}>
          <Scale size={16} />
          <div className="grow">
            <div className="row-wrap">
              <strong>Verdict de la cellule ({e.cellVerdict.at}) :</strong>
              <VerdictBadge verdict={e.cellVerdict.verdict} size="sm" />
              {e.cellVerdict.confidence && <Badge size="sm">confiance : {e.cellVerdict.confidence}</Badge>}
              {e.cellVerdict.verdict !== e.verdict && e.verdict !== 'a-confirmer' && <Badge size="sm" tone="warning">≠ fiche : {e.verdict === 'fausse-piste' ? 'fausse piste' : e.verdict}</Badge>}
            </div>
            <div className="small" style={{ marginTop: 6 }}>« {e.cellVerdict.justification} »</div>
            {e.cellVerdict.rssi && <div className="small muted" style={{ marginTop: 4 }}>Le RSSI : {e.cellVerdict.rssi}</div>}
          </div>
        </div>
      )}
      {!e.hasSheet && e.indicators && (
        <div className="stack">
          <div className="table-wrap card card--inset">
            <table className="table table--compact">
              <thead><tr><th>Élément</th><th>Observation</th><th>Interprétation</th></tr></thead>
              <tbody>{e.indicators.map(([a, b, c], i) => <tr key={i}><td className="strong nowrap">{a}</td><td className="mono small">{b}</td><td>{c}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="callout"><Badge size="sm">{e.platform ? 'Capture plateforme' : 'Sans fiche'}</Badge><div>{e.justification}</div></div>
        </div>
      )}
      {e.hasSheet ? (
        <>
          <Tabs value={tab} onChange={setTab} tabs={[
            { id: 'analyse', label: 'Analyse' },
            { id: 'capture', label: 'Capture' },
            { id: 'custody', label: 'Traçabilité' },
          ]} />
          {tab === 'analyse' && (
            <div className="stack">
              <div className="table-wrap card card--inset">
                <table className="table table--compact">
                  <thead><tr><th>Indicateur</th><th>Observation</th><th>Interprétation</th></tr></thead>
                  <tbody>{e.indicators.map(([a, b, c], i) => <tr key={i}><td className="strong nowrap">{a}</td><td className="mono small">{b}</td><td>{c}</td></tr>)}</tbody>
                </table>
              </div>
              <div>
                <h4 style={{ marginBottom: 6 }}>Justification du verdict</h4>
                <p className="secondary">{e.justification}</p>
              </div>
              <div>
                <h4 style={{ marginBottom: 6 }}>Actions recommandées</h4>
                <ul className="bullet-list">{e.actions.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
              {e.techniques.length > 0 && <div className="row-wrap"><span className="small muted">Techniques ATT&CK :</span>{e.techniques.map((t) => <span key={t} className="chip">{t}</span>)}</div>}
            </div>
          )}
          {tab === 'capture' && (
            e.image ? (
              <figure style={{ margin: 0 }}>
                <img className="evidence-img" src={`/evidence/${e.image}`} alt={`Capture de la pièce ${e.ref} : ${e.title}`} loading="lazy" />
                <figcaption className="tiny muted" style={{ marginTop: 8 }}>Figure 1 — capture extraite de la fiche de traçabilité ({e.day === 'J1' ? 'Fiche_tracabilite_Day1.docx' : 'Tracabilite JOUR2.docx'}).</figcaption>
              </figure>
            ) : <div className="state"><span className="state__icon"><ImageOff size={18} /></span><div className="state__title">Aucune capture disponible</div></div>
          )}
          {tab === 'custody' && (
            <div className="stack">
              <KeyValue items={[
                ['Référence', e.ref],
                ['Source / outil', e.tool],
                ['Date', e.date],
                ['Empreinte SHA-256', <span key="h" className="row" style={{ gap: 6, alignItems: 'flex-start' }}><span className="hash">{e.sha256}</span><button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={copyHash} aria-label="Copier l’empreinte"><Copy size={13} /></button></span>],
                ['Hôtes', e.hosts?.length ? e.hosts.join(', ') : null],
              ]} />
              <ol className="custody">
                {e.custody.map((c, i) => (
                  <li key={i}>
                    <span className="custody__n">{i + 1}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.step} <span className="muted" style={{ fontWeight: 400 }}>· {c.actor}</span></div>
                      <div className="small secondary">{c.action}</div>
                      <div className="tiny muted mono">{c.when}</div>
                    </div>
                  </li>
                ))}
                <li>
                  <span className="custody__n">{e.custody.length + 1}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>Qualification <span className="muted" style={{ fontWeight: 400 }}>· Analyste (étudiant)</span></div>
                    <div className="small secondary">Qualification : <VerdictBadge verdict={e.verdict} size="sm" /></div>
                  </div>
                </li>
              </ol>
            </div>
          )}
        </>
      ) : !e.indicators && (
        <div className="callout"><Badge size="sm">Sans fiche</Badge><div>{e.justification}</div></div>
      )}
    </Modal>
  );
}
