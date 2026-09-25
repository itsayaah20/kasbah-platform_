// Contexte de l'exercice, tel qu'il ressort des documents du dossier Data/.
// Les horodatages de l'incident sont relatifs (J-21 … J3) : aucun document ne
// fournit de date absolue pour J-n, seuls J1 et J2 sont datés (collectes).

export const organization = {
  name: 'AtlasGrid',
  sector: "Opérateur d'énergie (production et distribution)",
  location: 'Casablanca',
  employees: 'environ 1 200 salariés',
  clients: 'Clients grands comptes et collectivités liés par des engagements de disponibilité',
  domain: 'atlasgrid.ma',
  source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf',
};

export const incident = {
  code: 'MIRAGE',
  title: 'Incident MIRAGE',
  qualification: 'Rançongiciel avec double extorsion',
  malware: 'Ransom:Win32/Mirage.A',
  attacker: 'SIROCCO',
  ransom: { amount: '20 BTC', delay: '48 h', note: 'LISEZMOI_MIRAGE.txt', deadline: 'J3 11h00' },
  // Escalade constatée sur la plateforme après la décision de temporiser (J3 12:12–12:16).
  ransomEscalation: { amount: '40 BTC', deadline: 'J3 minuit', leaks: 'Deux lots de données publiés', claimedVolume: '300 Go (annoncé, non corroboré)' },
  entryVector: 'Compte VPN du prestataire OasisNet (svc_oasisnet), sans MFA',
  patientZero: 'FIN-112',
  globalRisk: 'Critique',
  globalRiskBasis:
    'Qualitatif : rançongiciel actif, sauvegardes en ligne détruites (copie hors ligne de Settat intacte), exfiltration prouvée, données publiées — aucun score numérique dans les rapports.',
  provider: 'OasisNet',
  socProvider: 'CyberShield SOC',
  days: [
    { id: 'J1', date: '23/09/2026', label: 'Acte I — Signaux faibles' },
    { id: 'J2', date: '24/09/2026', label: "Acte II — L'ultimatum" },
    { id: 'J3', date: '25/09/2026', label: 'Acte III — Reconstruire' },
  ],
  situationAsOf: 'J3 13:08 (Acte III)',
  cell: { name: 'Cellule 5', site: 'Rabat', platform: 'KASBAH (kasbah.cybersup.ai)' },
  sources: ['KASBAH · Cellule.pdf (fil de la plateforme)', 'Plan_de_containment_complet.pdf', 'Tableau_de_risques_RisqueConformite.pdf', 'CyberShield SOC — Analyse de l_incident MIRAGE.pptx'],
};

export const legalFramework = [
  { id: 'loi-05-20', label: 'Loi 05-20', scope: 'Cybersécurité — déclaration à la DGSSI / maCERT' },
  { id: 'loi-09-08', label: 'Loi 09-08', scope: 'Données personnelles — CNDP' },
  { id: 'loi-07-03', label: 'Loi 07-03', scope: 'Atteintes aux STAD — code pénal' },
  { id: 'decret-2-21-406', label: 'Décret 2-21-406', scope: "Application de la loi 05-20 (art. 42)" },
  { id: 'loi-17-99', label: 'Loi 17-99', scope: 'Code des assurances (art. 20)' },
  { id: 'doc', label: 'DOC', scope: 'Dahir des obligations et contrats (art. 230, 231, 263, 269)' },
];
