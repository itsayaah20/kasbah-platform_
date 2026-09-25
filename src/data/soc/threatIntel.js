// Incidents, IOC, techniques ATT&CK, faiblesses et KPI : dossier CyberShield SOC
// (diapositives 4, 9, 10, 12, 13). Identifiants et sévérités des incidents sont
// « une qualification proposée, à valider » selon le dossier lui-même.

// `openedAt` / `resolvedAt` : horodatages du fil de la plateforme KASBAH. Un incident est
// « résolu » quand la menace est neutralisée (contenu), pas seulement qualifiée.
export const socIncidents = [
  { id: 'INC-001', title: 'Rançongiciel MIRAGE via compte prestataire svc_oasisnet', severity: 'critical', status: 'Confinement ciblé (J2 15:58), reprise depuis Settat en cours', phase: 'Confinement', resolved: false, openedAt: 'J1 11:52', openedBy: 'A-01 : rançongiciel confirmé', containedAt: 'J2 15:58', containedBy: 'Isolement ciblé acté (DSI)', evidence: ['A-01', 'A-02', 'A-03', 'A-05', 'A-09', 'A-10', 'A-12', 'A-13'] },
  { id: 'INC-002', title: 'Campagne de phishing « migration de messagerie »', severity: 'high', status: 'En investigation, réinitialisation du compte hameçonné à confirmer', phase: 'Investigation', resolved: false, openedAt: 'J1 11:17', openedBy: 'Signal SOC', evidence: ['A-11'] },
  { id: 'INC-003', title: 'Fraude au président, virement de 480 000 MAD', severity: 'high', status: 'Contenu, virement bloqué, banque prévenue', phase: 'Contenu', resolved: true, openedAt: 'J2 12:16', openedBy: 'Signalement du salarié', resolvedAt: 'J2 13:16', resolvedBy: 'DSI : virement bloqué (FP-11)', evidence: ['A-23'] },
  { id: 'INC-004', title: 'Compte d’un ex-DSI encore actif via jeton mobile', severity: 'medium', status: 'Qualifié sans lien (FP-4), révocation des jetons annoncée mais non confirmée', phase: 'Ouvert', resolved: false, openedAt: 'J2 12:01', openedBy: 'Signal SOC', evidence: ['A-15'] },
  { id: 'INC-005', title: 'Clé USB piégée « HELPDESK » sur le parking', severity: 'low', status: 'Contenu, jamais branchée', phase: 'Contenu', resolved: true, openedAt: 'J1 12:32', openedBy: 'Signal SOC', resolvedAt: 'J1 15:02', resolvedBy: 'Analyse sandbox : sans lien (FP-7)', evidence: ['A-19'] },
];

export const iocs = [
  { type: 'IP', value: '45.137.184.62', role: 'C2 et destination d’exfiltration', evidence: ['A-01', 'A-03', 'A-09', 'A-12'] },
  { type: 'IP', value: '196.200.114.41 · 102.118.53.17', role: 'Sources VPN de l’attaquant', evidence: ['A-02'] },
  { type: 'IP', value: '193.42.55.108', role: 'Serveur d’envoi du phishing', evidence: ['A-11'] },
  { type: 'Domaine', value: 'atlasgrid-it.info', role: 'Typosquatting de atlasgrid.ma', evidence: ['A-11'] },
  { type: 'URL', value: 'hxxps://atlasgrid-it[.]info/owa/login', role: 'Faux portail OWA', evidence: ['A-11'] },
  { type: 'Domaine', value: 'cdn-sync-eu.storage-blob[.]net', role: 'SNI de l’exfiltration', evidence: ['A-03'] },
  { type: 'Domaine', value: 'atlasgrid-finance.co', role: 'Sosie de la fraude BEC', evidence: ['A-23'] },
  { type: 'Fichier', value: 'C:\\Windows\\svhost32.exe', role: 'Mirage.A (SHA256 3f9a4b1e…e0c71e)', evidence: ['A-01', 'A-12'] },
  { type: 'Artefact', value: '*.mirage · LISEZMOI_MIRAGE.txt', role: 'Extension et note de rançon', evidence: ['A-04', 'A-12'] },
  { type: 'TLS', value: 'JA3 a0e9f5d2b3c1e847f6… (tronqué)', role: 'Empreinte de l’implant', evidence: ['A-03', 'A-09'] },
  { type: 'Compte', value: 'svc_oasisnet · admin_local', role: 'Comptes compromis', evidence: ['A-02', 'A-10'] },
  { type: 'Hash', value: 'c1d55a…9b20 (tronqué)', role: 'HelpDesk.exe, clé USB', evidence: ['A-19'] },
];
export const iocReputationNote = 'Réputation VirusTotal, AbuseIPDB ou OTX : absente des rapports (N/A). Seul 7z.exe a un résultat VirusTotal (0/72, bénin, A-22).';

export const mitreTactics = [
  { id: 'initial', label: 'Accès initial', inChain: true, techniques: [
    { id: 'T1078', name: 'Valid Accounts', evidence: ['A-02'] },
    { id: 'T1133', name: 'External Remote Services', evidence: ['A-02'] },
  ] },
  { id: 'evasion', label: 'Évasion défensive', inChain: true, techniques: [
    { id: 'T1036.005', name: 'Masquerading', evidence: ['A-01'] },
    { id: 'T1562.001', name: 'Disable or Modify Tools', evidence: ['A-01'] },
    { id: 'T1562.004', name: 'Modify System Firewall', evidence: ['A-09'] },
    { id: 'T1070.001', name: 'Clear Windows Event Logs', evidence: ['A-10'] },
  ] },
  { id: 'c2', label: 'C2 · Exfiltration', inChain: true, techniques: [
    { id: 'T1071.001', name: 'Web Protocols', evidence: ['A-09'] },
    { id: 'T1041', name: 'Exfiltration Over C2 Channel', evidence: ['A-02'] },
  ] },
  { id: 'impact', label: 'Impact', inChain: true, techniques: [
    { id: 'T1486', name: 'Data Encrypted for Impact', evidence: ['A-01', 'A-12'] },
    { id: 'T1490', name: 'Inhibit System Recovery', evidence: ['A-05', 'A-12'] },
  ] },
  { id: 'outside', label: 'Hors chaîne', inChain: false, techniques: [
    { id: 'T1566.002', name: 'Spearphishing Link', evidence: ['A-11'] },
    { id: 'T1091', name: 'Removable Media', evidence: ['A-19'] },
    { id: 'T1656', name: 'Impersonation', evidence: ['A-23'] },
  ] },
];

export const vulnerabilities = [
  { title: 'MFA non appliqué au compte VPN prestataire', severity: 'critical', evidence: ['A-02'], remediation: 'MFA imposé sur tous les comptes VPN' },
  { title: 'Sauvegardes modifiables, aucune copie immuable', severity: 'critical', evidence: ['A-05'], remediation: 'Copie hors ligne ou immuable' },
  { title: 'Compte admin_local partagé, LAPS non vérifié', severity: 'high', evidence: ['A-01', 'A-10'], remediation: 'Réinitialiser et déployer LAPS' },
  { title: 'Règle pare-feu tierce sans journalisation', severity: 'high', evidence: ['A-09'], remediation: 'Revue des règles, droits retirés' },
  { title: 'Proxy : destinations « non classées » permises', severity: 'high', evidence: ['A-03'], remediation: 'Bloquer « non classé » aux serveurs' },
  { title: 'Jetons non révoqués au départ d’un salarié', severity: 'medium', evidence: ['A-15'], remediation: 'Révoquer sessions et jetons' },
  { title: 'Aucune alerte sur l’effacement de journal 1102', severity: 'medium', evidence: ['A-10'], remediation: 'Règle SIEM sur l’événement 1102' },
  { title: 'Ports RDP 3389 et SMB 445 sondés d’Internet', severity: 'unknown', evidence: ['A-21'], remediation: 'Confirmer leur non-exposition' },
  { title: 'Caméra datacenter hors service, badgeuse non fiable', severity: 'low', evidence: ['A-14'], remediation: 'Remise en service et contrôle' },
];
export const vulnerabilityNote = 'Aucune CVE dans les rapports. Sévérité proposée par l’analyse, à valider · CVE, CVSS et date de détection : N/A.';

export const socKpis = [
  { id: 'servers', label: 'Serveurs chiffrés', value: '23 / 40', sub: '57,5 % du parc', source: 'A-13, inventaire SCCM J2 10:00', provenance: 'real' },
  { id: 'exfil', label: 'Données exfiltrées', value: '117,8 Go', sub: '10 nuits', source: 'A-03, proxy Zscaler, J-10 → J-1', provenance: 'real' },
  { id: 'c2', label: 'Sessions C2', value: '2 118', sub: 'J-3 → J-1', source: 'A-09, pare-feu FGT-RBT-01', provenance: 'real' },
  { id: 'fraud', label: 'Fraude bloquée', value: '480 000 MAD', sub: 'Confirmé J2 13:16', source: 'A-23, confirmé par le DSI', provenance: 'real' },
  { id: 'backup', label: 'Dernière sauvegarde fiable', value: 'J-4', sub: 'Veeam VBR-01', source: 'A-05', provenance: 'real' },
  { id: 'dwell', label: 'Présence de l’attaquant', value: '≥ 21 jours', sub: '1re session VPN J-21', source: 'J-21 → J-1', provenance: 'derived' },
  { id: 'mttd', label: 'MTTD (impact → confirmation)', value: '≈ 32 h 40', sub: 'J-1 03:12 → J1 11:52', source: 'Si J-1 = veille de J1', provenance: 'derived' },
  { id: 'triage', label: 'Pièces écartées au triage', value: '12 / 21', sub: '57 %', source: '(8 bruits + 4 fausses pistes) / 21 fiches', provenance: 'derived' },
  { id: 'mttr', label: 'MTTR, taux de résolution', value: 'N/A', sub: 'Aucun horaire de confinement documenté', source: '—', provenance: 'na' },
  { id: 'score', label: 'Security Risk Score /100', value: 'N/A', sub: 'Aucun référentiel de score', source: '—', provenance: 'na' },
];

export const socOpenQuestions = [
  'Comment les identifiants du prestataire ont-ils été obtenus ?',
  'Pourquoi le MFA n’était-il pas appliqué à ce compte ?',
  'Pourquoi le journal VPN montre-t-il si peu de sessions face aux 90 connexions nocturnes ?',
  'DC-02 est-il vraiment sain ?',
  'Existe-t-il une sauvegarde hors ligne exploitable ?',
];

export const responsePhases = ['Contenir', 'Préserver', 'Éradiquer', 'Restaurer', 'Informer'];
