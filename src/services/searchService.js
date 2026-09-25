import { evidence } from '../data/common/evidence';
import { assets } from '../data/common/assets';
import { iocs } from '../data/soc/threatIntel';
import { risks } from '../data/risque/compliance';
import { cellMembers, stakeholders } from '../data/common/people';
import { documents } from '../data/common/documents';
import { cells } from '../data/common/cells';
import { mitreTactics } from '../data/soc/threatIntel';
import { normalize } from '../utils/format';
import { cellDecisions } from '../data/common/cellDecisions';

// Index de recherche globale (incident, IP, hôte, IOC, compte, technique…).
const index = [
  ...cells.map((c) => ({ type: 'Cellule', label: c.fullName, sub: c.mission, to: `/cellules/${c.id}` })),
  ...evidence.map((e) => ({ type: 'Pièce', label: `${e.ref} — ${e.title}`, sub: e.summary, to: `/pieces?ref=${e.ref}` })),
  ...assets.map((a) => ({ type: 'Actif', label: a.name, sub: `${a.label}${a.stateNote ? ` · ${a.stateNote}` : ''}`, to: `/cellules/direction?tab=actifs&q=${encodeURIComponent(a.name)}` })),
  ...iocs.map((i) => ({ type: 'IOC', label: i.value, sub: `${i.type} · ${i.role}`, to: `/cellules/soc?tab=intel` })),
  ...risks.map((r) => ({ type: 'Risque', label: `${r.id} — ${r.title}`, sub: `Criticité ${r.score}`, to: `/cellules/risque?tab=registre` })),
  ...mitreTactics.flatMap((t) => t.techniques.map((tech) => ({ type: 'Technique', label: `${tech.id} ${tech.name}`, sub: t.label, to: '/cellules/soc?tab=mitre' }))),
  ...cellMembers.map((m) => ({ type: 'Personne', label: m.name, sub: m.role, to: '/utilisateurs' })),
  ...stakeholders.map((s) => ({ type: 'Acteur', label: s.name, sub: s.role, to: '/utilisateurs?tab=acteurs' })),
  ...documents.map((d) => ({ type: 'Document', label: d.title, sub: d.original, to: '/rapports' })),
  ...cellDecisions.map((d) => ({ type: 'Décision', label: d.title, sub: `Choix : ${d.options[d.choice]}`, to: '/decisions' })),
].map((item) => ({ ...item, haystack: normalize(`${item.label} ${item.sub}`) }));

export function search(query, limit = 12) {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  return index.filter((item) => terms.every((t) => item.haystack.includes(t))).slice(0, limit);
}
