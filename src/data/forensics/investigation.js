// Cellule d'investigation — hypothesis.pdf (v1), hypothesis_v2.pdf, hypothesis_v3.pdf.
// v3 (23/09/2026, Acte I) est la version de référence.

// Degré de confiance par hypothèse (v3, section 6). Les pourcentages ne sont pas
// exclusifs : ils ne somment pas à 100.
export const hypotheses = [
  { id: 'H1', label: 'Identifiants svc_oasisnet volés côté OasisNet', confidence: 55, status: 'ouverte', justification: 'Compte prestataire ; l’usage démarre à J-21, avant tout signal côté AtlasGrid.', evidence: ['A-02'] },
  { id: 'H2', label: 'Badge du stagiaire IT = présence physique liée', confidence: 35, status: 'ouverte', justification: 'Fenêtre 02h–04h chevauchant VPN et EDR ; vol, clonage ou prêt du badge non exclus. Export badgeuse jamais transmis à la cellule.', evidence: ['A-14'] },
  { id: 'H3', label: 'Vol de session (contournement MFA)', confidence: 20, status: 'ouverte', justification: 'Expliquerait l’absence de MFA ; ni confirmé ni exclu par A-02.', evidence: ['A-02'] },
  { id: 'H4', label: 'Compte orphelin non désactivé', confidence: 15, status: 'ouverte', justification: 'Pattern trop régulier pour un simple oubli, sans exclusion formelle.', evidence: [] },
  { id: 'H5', label: 'Complicité interne', confidence: 10, status: 'ouverte', justification: 'Aucun indice direct ; le compte reste celui du prestataire.', evidence: [] },
  { id: 'H6', label: 'USB PAIE-SAUVE liée à Mirage', confidence: 8, status: 'bruit', justification: 'Ticket, session et horaire cohérents ; volume dérisoire face à l’exfiltration nocturne.', evidence: ['A-17'] },
  { id: 'H7', label: 'USB parking, vecteur physique', confidence: 2, status: 'bruit', justification: 'DLP formellement négatif, vérifié et non supposé.', evidence: ['A-19'] },
  { id: 'H8', label: 'Caméra = entrée physique', confidence: null, status: 'non-chiffrable', justification: 'Hors service cette nuit-là (déclaratif de Yassine, sans export) ; pas de base pour chiffrer.', evidence: [] },
];

// Frise v3 — Survenue (horodatage technique) vs Signalée (prise de connaissance).
export const timelineOverview = [
  { occurred: 'J-21 → J-1 (×8, ~02h–05h)', reported: '14h27', event: 'Connexions VPN nocturnes, sans MFA (A-02)', status: 'Fait' },
  { occurred: 'J-3, 01h12', reported: '16h22', event: 'Politique de rétention Veeam modifiée par svc_oasisnet (A-05)', status: 'Fait' },
  { occurred: 'J-3 (heure non précisée)', reported: '12h32', event: 'USB trouvée sur le parking', status: 'Bruit' },
];

export const timelineCritical = [
  { occurred: '02h00 à 04h00', reported: '15h37', event: 'Badge stagiaire IT, salle des serveurs', status: 'Hypothèse' },
  { occurred: '02h15 à 04h35', reported: '14h27', event: 'Dernière session VPN svc_oasisnet (A-02)', status: 'Fait' },
  { occurred: '03h12', reported: '11h52', event: 'Exécution de Mirage.A sur FIN-112 (A-01)', status: 'Fait' },
  { occurred: '03h13', reported: '11h52', event: 'Chiffrement de masse détecté (A-01)', status: 'Fait' },
  { occurred: '03h14', reported: '11h52', event: 'C2 bloqué puis contourné (A-01)', status: 'Fait' },
  { occurred: '03h15', reported: '11h52 / 16h22', event: 'EDR désactivé (A-01) et vssadmin delete shadows (A-05) — étiquetés J-1 et J1 pour la même minute', status: 'Fait' },
  { occurred: '17h20 à 17h24 (J-1)', reported: '16h02', event: 'USB « PAIE-SAUVE », service paie, la veille au soir (A-17)', status: 'Bruit' },
  { occurred: '06h41 (J1)', reported: '11h17', event: 'Email de hameçonnage reçu, après l’infection (A-11)', status: 'Fait' },
  { occurred: '11h32', reported: 'sans délai', event: 'Vague de tickets inhabituelle, plusieurs services', status: 'À qualifier' },
  { occurred: '14h47', reported: 'sans délai', event: 'Fichiers du partage comptable renommés en .mirage', status: 'Fait' },
  { occurred: '15h15', reported: 'sans délai', event: 'Export du journal Veeam généré', status: 'Fait' },
  { occurred: '15h22', reported: 'sans délai', event: 'Mail « Migration Exchange » signalé', status: 'À qualifier' },
  { occurred: '15h28', reported: '16h22', event: 'Dépôts BKP-01 et BKP-02 injoignables (A-05)', status: 'Fait' },
  { occurred: '16h54', reported: 'sans délai', event: 'A-20 confirme le mail légitime (FP-8)', status: 'Fait' },
];

// Fenêtre nocturne J-1 : convergence de trois sources indépendantes (v1).
// Heures exprimées en minutes depuis minuit pour le tracé.
export const nightConvergence = [
  { source: 'Badge (DRH)', label: 'Badge stagiaire IT', start: 120, end: 240, status: 'Hypothèse', note: 'Horodatages non fiables (A-14)' },
  { source: 'VPN (A-02)', label: 'Session svc_oasisnet', start: 135, end: 275, status: 'Fait', note: '1,8 Go sortis' },
  { source: 'Proxy (A-03)', label: 'Exfiltration FILER-RBT', start: 135, end: 275, status: 'Fait', note: '9,3 Go (J-1 02:15–04:35)' },
  { source: 'EDR (A-01 / A-12)', label: 'Exécution Mirage.A → note', start: 192, end: 196, status: 'Fait', note: '03:12:09 → 03:15:40' },
  { source: 'Veeam (A-05)', label: 'vssadmin delete shadows', start: 195, end: 196, status: 'Fait', note: '03:15 (T1490)' },
];

export const synthesis = [
  { phase: 'Accès initial', status: 'Fait', basis: 'svc_oasisnet, sans MFA, actif depuis J-21 (A-02)' },
  { phase: 'Sabotage des sauvegardes', status: 'Fait', basis: 'Rétention modifiée à J-3, clichés supprimés à 03h15 (A-05)' },
  { phase: 'Impact', status: 'Fait', basis: 'Mirage.A, chiffrement, fichiers .mirage, EDR désactivé (A-01)' },
  { phase: 'Phishing → FIN-112', status: 'Hypothèse réfutée', basis: 'Email reçu après l’infection (A-11 confronté à A-01)' },
  { phase: 'Présence physique', status: 'Hypothèse ouverte', basis: 'Badge non confirmé, caméra hors service (déclaratif)' },
];

export const assetStates = [
  { asset: 'Compte svc_oasisnet (VPN OasisNet)', state: 'Compromis', basis: 'Sans MFA depuis J-21, non révoqué à la rédaction (A-02)' },
  { asset: 'FIN-112 (poste, direction financière)', state: 'Compromis, isolé', basis: 'Débranché du réseau, laissé sous tension (A-01)' },
  { asset: 'Partage comptable (direction financière)', state: 'Chiffrement actif', basis: 'Propagation en cours, isolement partiel (signal 14h47)' },
  { asset: 'Sauvegardes en ligne (VBR-01, BKP-01, BKP-02)', state: 'Neutralisées', basis: 'Rétention modifiée, clichés supprimés, dépôts injoignables (A-05)' },
  { asset: 'Sauvegarde hors ligne / immuable', state: 'Inconnu', basis: 'Non vérifiée dans ce dossier', update: 'Vérifiée J3 12:12 : copie LTO-9 de Settat intacte, J-42, jamais testée (A-06)' },
  { asset: 'RH-031', state: 'Non affecté', basis: 'Alertes PUA anciennes et bénignes (A-01)' },
  { asset: 'PAIE-STA-3 (poste paie)', state: 'Non affecté', basis: 'Copie USB autorisée et tracée (A-17)' },
  { asset: 'Supervision SCADA', state: 'Non renseigné', basis: 'Hors périmètre des pièces traitées' },
];

// Déclarations contredites par les preuves (v3, section 4)
export const contradictions = [
  { who: 'OasisNet, prestataire d’infogérance', claim: '« Maintenance planifiée [qui] s’est mal terminée ce week-end » ; « rien n’indique que cela [les] concerne directement ».', refutedBy: 'A-02 : huit connexions nocturnes du compte du prestataire, sans MFA, depuis J-21.', evidence: ['A-02'] },
  { who: 'Karim Bennis, Directeur des SI (J1 12:52)', claim: '« Incident d’exploitation banal ».', refutedBy: 'A-01, déjà qualifiée preuve : exécution d’un rançongiciel avec désactivation délibérée des défenses.', evidence: ['A-01'] },
];

export const readingCorrection = {
  title: 'Correction de lecture : le phishing n’est pas le vecteur initial',
  text: 'L’en-tête A-11 est reçu à 06h41, le journal EDR A-01 situe l’exécution à 03h12, plus de trois heures avant. Un employé déclare avoir saisi ses identifiants « hier soir » (J1 12h17), ce qui ne coïncide pas avec l’horodatage technique : l’écart est signalé tel quel plutôt que lissé.',
};

export const decisionFin112 = {
  choice: 'Isoler FIN-112 du réseau sans l’éteindre',
  quote: '« Débranché du réseau mais laissé allumé, on coupe la propagation tout en préservant la mémoire vive. Je peux encore capturer les processus actifs et les connexions C2 avant qu’elles ne s’effacent. C’est le bon geste. »',
  rejected: ['Couper l’alimentation (effacerait la session C2 active)', 'Laisser connecté pour observer l’attaquant'],
};

export const openPoints = [
  { title: 'Aucune session VPN à J-3 dans A-02', detail: 'A-05 attribue la modification de rétention (J-3 01h12) à svc_oasisnet, mais les sessions A-02 sautent de J-4 à J-1. Canal utilisé ce jour-là inconnu.', evidence: ['A-02', 'A-05'] },
  { title: 'A-05 daté avant son propre contenu', detail: 'Export généré à J1 15h15 mais listant un événement à 15h28.', evidence: ['A-05'] },
  { title: 'Étiquette de jour non concordante à 03h15', detail: 'A-01 : [J-1] 03:15:22 ; A-05 : J1 03:15. Résolu ensuite par A-12 (J-1 03:15:07).', evidence: ['A-01', 'A-05', 'A-12'] },
  { title: 'Écart 12,5 Go / 117,8 Go', detail: 'A-02 ne mesure que le tunnel VPN ; A-03 couvre l’exfiltration réelle (confirmé côté SOC).', evidence: ['A-02', 'A-03'] },
  { title: 'Vague de tickets de 11h32 non qualifiée', detail: 'Lenteurs, partages, impressions : propagation ou cause étrangère, rien ne permet de trancher.', evidence: [] },
  { title: 'Badge (A-14) : export non reçu', detail: 'Demande à formuler auprès de Yassine ; ne pas interroger le stagiaire hors procédure RH.', evidence: ['A-14'] },
  { title: 'Vidéosurveillance : panne non datée', detail: 'Réponse orale de Yassine, sans ticket ni journal ; début de panne inconnu.', evidence: [] },
];

export const reportVersions = [
  { version: 'v1', file: 'hypothesis.pdf', title: 'Hypothèses d’intrusion — physique vs distant', date: '23/09/2026', changes: ['Vecteur distant (VPN OasisNet) confirmé', 'Table de corrélation temporelle de la nuit J-1', 'Quatre hypothèses d’entrée physique'] },
  { version: 'v2', file: 'hypothesis_v2.pdf', title: 'Reconstitution de l’attaque', date: '23/09/2026', changes: ['Frise Survenue / Signalée', 'Reprise des verdicts de la fiche de traçabilité', 'Hypothèses chiffrées'] },
  { version: 'v3', file: 'hypothesis_v3.pdf', title: 'Reconstitution de l’attaque', date: '23/09/2026', changes: ['Caméra : réponse orale de Yassine intégrée', 'Section « Affirmations contredites »', 'Tableau d’état des actifs', 'Points ouverts consolidés'] },
];
