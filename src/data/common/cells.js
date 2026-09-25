// Les 6 cellules de crise (un dossier par cellule dans Data/).
// `color` : slot catégoriel fixe (validé daltonisme), jamais recyclé.

export const cells = [
  {
    id: 'soc', name: 'SOC', fullName: 'SOC / Détection', icon: 'Radar', color: 'var(--series-1)',
    dataFolder: 'Data/SOC',
    responsibleId: 'yahya-el-hama',
    mission: 'Détecter, qualifier et tracer les signaux : triage des pièces, corrélation des journaux, périmètre et confinement.',
    responsibilities: ['Qualification des 21 fiches de traçabilité (preuve / bruit / fausse piste)', 'Surveillance DC-02, MSG-01 et passerelle IT/OT', 'Recherche des IOC sur le parc', 'Chronologie et fil des annonces'],
    headline: 'Attaque confirmée, DSI aligné, cinq questions ouvertes (J2 14:41)',
    headlineSource: 'CyberShield SOC — diapositive 2',
  },
  {
    id: 'forensics', name: 'Forensics', fullName: 'Forensique / Investigation', icon: 'Microscope', color: 'var(--series-2)',
    dataFolder: 'Data/forensics',
    responsibleId: 'achraf-khairouni',
    mission: 'Reconstituer l’attaque, distinguer faits et hypothèses, préserver les preuves et donner le feu vert à la reprise.',
    responsibilities: ['Reconstitution du vecteur et de la chronologie', 'Hypothèses chiffrées d’entrée', 'Préservation (mémoire FIN-112, journaux)', 'Validation écrite de fin de containment'],
    headline: 'Vecteur distant confirmé ; présence physique : hypothèse ouverte',
    headlineSource: 'hypothesis_v3.pdf — synthèse',
  },
  {
    id: 'continuite', name: 'Continuité', fullName: 'Continuité d’activité', icon: 'LifeBuoy', color: 'var(--series-3)',
    dataFolder: 'Data/continuité d’activité',
    responsibleId: 'malak-atouahri',
    mission: 'Maintenir les activités essentielles en mode dégradé (PCA) et organiser la reprise (PRA) ; mesurer l’impact métier de chaque coupure.',
    responsibilities: ['Analyse d’impact (DMIA / PDMA)', 'Modes dégradés par activité', 'Ordre de reprise et scénarios de sauvegarde', 'Plan de containment et main courante'],
    headline: 'Attaquant coupé de ses accès connus ; risque principal désormais lié aux données',
    headlineSource: 'Plan de containment — conclusion',
  },
  {
    id: 'risque', name: 'Risque / Conformité', fullName: 'Risque / Conformité', icon: 'Scale', color: 'var(--series-4)',
    dataFolder: 'Data/Conformité',
    responsibleId: 'amina-essafi',
    mission: 'Évaluer les risques, identifier les obligations légales et contractuelles, préparer l’arbitrage sur la rançon.',
    responsibilities: ['Registre des risques (P × I)', 'Obligations DGSSI, CNDP, assureur, police', 'Engagements clients (SLA 99,5 %) et OasisNet', 'Éléments d’arbitrage rançon'],
    headline: 'Violation de données personnelles et incident notifiable',
    headlineSource: 'Tableau de risques — synthèse',
  },
  {
    id: 'direction', name: 'Direction', fullName: 'Direction / Coordination', icon: 'Compass', color: 'var(--series-6)',
    dataFolder: 'Data/coordination',
    responsibleId: 'aya-belkhaouad',
    mission: 'Consolider les retours des cellules, préparer les arbitrages pour la Direction générale, cartographier le SI.',
    responsibilities: ['Note de coordination DC/2026/01', 'Cartographie et criticité des actifs (C1–C4)', 'Registre des décisions', 'Priorités communes'],
    headline: 'Consolidation des retours pour arbitrage : coupure, accès, reprise, notifications',
    headlineSource: 'Note DC/2026/01',
  },
  {
    id: 'communication', name: 'Communication', fullName: 'Communication de crise', icon: 'Megaphone', color: 'var(--series-5)',
    dataFolder: 'Data/Communication',
    responsibleId: 'hamza-el-ouardi',
    mission: 'Informer salariés, clients, presse et public avec des messages factuels, cohérents et validés.',
    responsibilities: ['Messages internes et points de situation', 'Réponses clients et presse', 'Communiqués officiels', 'Préservation de la présomption d’innocence'],
    headline: 'Incident public ; réponses clients et presse envoyées',
    headlineSource: 'Main courante J2 15:01–15:03',
  },
];

// Flux entre cellules explicitement décrits dans les documents.
export const cellRelations = [
  { from: 'direction', to: 'soc', kind: 'Demande', label: 'Note DC/2026/01 : état du périmètre et du confinement', source: 'Note_Coordination_Urgent_upload.pdf' },
  { from: 'direction', to: 'forensics', kind: 'Demande', label: 'Note DC/2026/01 : reconstitution et recoupement des pièces', source: 'Note_Coordination_Urgent_upload.pdf' },
  { from: 'direction', to: 'continuite', kind: 'Demande', label: 'Note DC/2026/01 : options de maintien et de reprise', source: 'Note_Coordination_Urgent_upload.pdf' },
  { from: 'direction', to: 'risque', kind: 'Demande', label: 'Note DC/2026/01 : obligations, engagements, rançon', source: 'Note_Coordination_Urgent_upload.pdf' },
  { from: 'direction', to: 'communication', kind: 'Demande', label: 'Note DC/2026/01 : messages interne, clients, presse', source: 'Note_Coordination_Urgent_upload.pdf' },
  { from: 'risque', to: 'direction', kind: 'Retour', label: 'Retour à la note DC/2026/01 (J2 16:45)', source: 'Retour_Risque_Conformite_DC-2026-01_v3.pdf' },
  { from: 'continuite', to: 'communication', kind: 'Faits', label: 'La Continuité fournit les faits, la Communication rédige', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { from: 'communication', to: 'direction', kind: 'Validation', label: 'La Direction valide avant tout envoi', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { from: 'continuite', to: 'direction', kind: 'Proposition', label: 'La Continuité propose et chiffre l’impact, la Direction arbitre (D2)', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { from: 'forensics', to: 'continuite', kind: 'Feu vert', label: 'Pas de reprise sans feu vert Forensic', source: 'PCA_PRA_AtlasGrid_Cellule_Continuite.pdf' },
  { from: 'soc', to: 'forensics', kind: 'Pièces', label: 'Fiches de traçabilité et bilan du fil SOC repris par l’investigation', source: 'hypothesis_v3.pdf' },
  { from: 'soc', to: 'continuite', kind: 'Pièces', label: 'Inventaire d’impact A-13 transmis au pôle Continuité', source: 'suivi soc pb.pdf' },
  { from: 'soc', to: 'communication', kind: 'Signal', label: 'A-16 : l’incident est public, à transmettre à la Communication', source: 'Tracabilite JOUR2.docx' },
  { from: 'risque', to: 'communication', kind: 'Consigne', label: 'Réponse client factuelle, sans aveu de faute ; aucun délai non validé', source: 'Retour_Risque_Conformite_DC-2026-01_v3.pdf' },
  { from: 'direction', to: 'continuite', kind: 'Partage', label: 'Cartographie et criticité partagées pour le point de 12h00', source: 'cartographie du système d_information_cellule5.pdf' },
];

// Rythme de coordination (PCA 4.1)
export const coordinationRhythm = 'Point de situation toutes les 2 heures entre Continuité, SOC, Forensic, Risque/Conformité et Communication ; chaque décision est horodatée dans la main courante.';
