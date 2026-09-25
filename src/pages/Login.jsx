import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { allMembers } from '../services/userService';
import { allCells, getCellMeta } from '../services/cellService';
import { KasbahMark } from '../components/common/CellIcon';
import { UserAvatar } from '../components/common/Controls';
import { incident, organization } from '../data/common/incident';

// Connexion de démonstration : aucun mot de passe n'est vérifié ; le profil
// choisi détermine l'utilisateur affiché. À remplacer par l'authentification du backend.
export default function Login() {
  const { session, login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [cellId, setCellId] = useState('direction');
  const [memberId, setMemberId] = useState('aya-belkhaouad');

  if (session) return <Navigate to="/dashboard" replace />;

  const members = allMembers.filter((m) => m.cellId === cellId);

  const submit = (e) => {
    e.preventDefault();
    login(memberId);
    navigate(location.state?.from || '/dashboard', { replace: true });
  };

  return (
    <div className="login">
      <section className="login__aside">
        <div className="row" style={{ gap: 12 }}>
          <KasbahMark size={40} />
          <div>
            <div className="brand-name" style={{ fontSize: 18 }}>KASBAH</div>
            <div className="muted small">Plateforme de pilotage de crise</div>
          </div>
        </div>
        <div className="login__pitch">
          <div className="page-header__eyebrow"><span className="incident-chip__dot" /> Exercice {incident.code} en cours</div>
          <h1 style={{ fontSize: 30, lineHeight: 1.15 }}>Six cellules, un seul tableau de situation.</h1>
          <p className="secondary" style={{ marginTop: 12, maxWidth: 440 }}>
            {organization.name}, {organization.sector.toLowerCase()} à {organization.location}. {incident.qualification} revendiqué par {incident.attacker}.
          </p>
          <div className="login__cells">
            {allCells.map((c) => (
              <span key={c.id} className="row small secondary" style={{ gap: 8 }}>
                <span className="cell-dot" style={{ background: c.color }} />{c.fullName}
              </span>
            ))}
          </div>
        </div>
        <div className="tiny muted">Données issues du dossier d’exercice MIRAGE — données fictives.</div>
      </section>

      <section className="login__form-wrap">
        <form className="card login__form" onSubmit={submit}>
          <div>
            <h2 style={{ fontSize: 18 }}>Connexion</h2>
            <p className="muted small" style={{ marginTop: 4 }}>Choisissez votre cellule et votre profil.</p>
          </div>

          <div className="field">
            <label htmlFor="cell">Cellule</label>
            <select id="cell" className="select" value={cellId} onChange={(e) => { setCellId(e.target.value); setMemberId(allMembers.find((m) => m.cellId === e.target.value)?.id); }}>
              {allCells.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
            </select>
          </div>

          <div className="field">
            <span className="small secondary" style={{ fontWeight: 500 }}>Profil</span>
            <div className="login__profiles" role="radiogroup" aria-label="Profil">
              {members.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={memberId === m.id} className={`login__profile ${memberId === m.id ? 'is-active' : ''}`} onClick={() => setMemberId(m.id)}>
                  <UserAvatar name={m.name} size="sm" color={memberId === m.id ? getCellMeta(m.cellId).color : undefined} />
                  <span className="grow" style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontWeight: 500 }}>{m.name}</span>
                    <span className="tiny muted">{m.role}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn--primary" style={{ height: 40 }} disabled={!memberId}>
            Accéder à la plateforme <ArrowRight size={15} />
          </button>
          <div className="row tiny muted" style={{ gap: 6 }}><ShieldCheck size={13} /> Authentification simulée côté frontend, prête pour un fournisseur d’identité.</div>
        </form>
      </section>
    </div>
  );
}
