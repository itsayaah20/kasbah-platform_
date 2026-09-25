// Direction / Coordination — Note_Coordination_Urgent_upload.pdf (DC/2026/01)
// et cartographie du système d_information_cellule5.pdf. Registre des décisions :
// Plan_de_containment_complet.pdf (section 8).

export const coordinationNote = {
  ref: 'DC/2026/01',
  date: '24 septembre 2026',
  author: 'Reda El Ghardegue, chef de cellule adjoint',
  copy: 'Aya Belkhaouad',
  purpose: 'Construire une vision commune de l’incident : ce qui s’est passé, les mesures prises et les décisions qui restent à arbitrer.',
  caveat: 'Cette note demande un état de situation ; elle ne vaut pas autorisation d’exécuter une nouvelle mesure technique.',
  situation: [
    { element: 'Impact sur les services', known: 'A-13 : 23 serveurs chiffrés sur 40. Paie, facturation, fichiers et ERP touchés.', toClarify: 'État actuel, impacts métier et changements depuis l’inventaire.' },
    { element: 'Accès suspects et transferts', known: 'A-02 et A-10 : usages inhabituels de svc_oasisnet. A-03 : 117,8 Go sortants sur dix nuits.', toClarify: 'Périmètre des données concernées et liens entre les événements.' },
    { element: 'Sauvegardes et systèmes préservés', known: 'A-05 : politique modifiée, travaux ignorés, dépôts injoignables. A-13 : DC-02 et SCADA intacts.', toClarify: 'État vérifié et possibilités réelles de reprise.' },
    { element: 'Pression et communication', known: 'Note exigeant 20 BTC sous 48 h. Portail client indisponible. Salariés demandant une information claire.', toClarify: 'Vérifier les affirmations de l’attaquant.' },
  ],
  responseFormat: [
    { section: 'Situation à l’heure du retour', expected: 'Cellule, répondant, date, heure et fuseau. Faits confirmés avec références des pièces.' },
    { section: 'Actions et résultats', expected: 'Action, système, responsable, heure et état : proposée, validée, en cours, réalisée ou vérifiée.' },
    { section: 'Points à éclaircir', expected: 'Hypothèses, contradictions, informations manquantes, vérification prévue et personne chargée.' },
    { section: 'Arbitrage demandé', expected: 'Question, options, recommandation, bénéfice, risque et responsable proposé.' },
    { section: 'Prochaine mise à jour', expected: 'Heure du prochain retour et blocages nécessitant une autre cellule.' },
  ],
  consolidationTopics: ['Maintien ou coupure des services', 'Traitement des accès suspects', 'Reprise', 'Notifications', 'Communication'],
};

// Demandes adressées à chaque cellule par la note DC/2026/01.
// `reply` : document de réponse identifié dans Data/, sinon null.
export const cellRequests = [
  { cellId: 'soc', respondent: 'Yahya El Hama', expected: 'Un état actuel du périmètre et du confinement.', items: ['Systèmes touchés, suspects et opérationnels, avec l’heure de la dernière vérification', 'Point sur svc_oasisnet : accès, sessions ouvertes, état du VPN', 'Communications vers 45.137.184.62 et traitement de OUT-TEMP-443 — distinguer blocage demandé et vérifié', 'Pour chaque mesure : périmètre, heure, responsable, impact'], reply: null },
  { cellId: 'forensics', respondent: 'Achraf Khairouni', expected: 'Un état actuel du périmètre et du confinement.', items: ['Reconstituer les événements jusqu’au chiffrement en conservant dates et fuseaux', 'Recouper A-01, A-02, A-03, A-04, A-09, A-10, A-12', 'Vérifier volumes sortants, destination et nature des données', 'Preuves préservées, collectes restantes, anomalies d’horodatage, pistes écartées'], reply: null },
  { cellId: 'continuite', respondent: 'Malak Atouahri', expected: 'Des options de maintien d’activité et de reprise réalistes.', items: ['Conséquences pour paie, facturation, ERP, partages, portail', 'Ordre de reprise justifié', 'Sauvegardes accessibles, date, intégrité ; bandes hors ligne vérifiées séparément', 'Prérequis, ressources et estimation du délai de reprise'], reply: null },
  { cellId: 'risque', respondent: 'Amina Essafi', expected: 'Obligations, engagements et arbitrage rançon.', items: ['Autorités, conditions, délais, démarches assureur', 'Disponibilité 99,5 % invoquée par la Chérifienne des Mines', 'Responsabilités contractuelles d’OasisNet', 'Données exposées et éléments d’arbitrage sur la rançon'], reply: { doc: 'rc-retour-v3', when: 'J2 16:45' } },
  { cellId: 'communication', respondent: 'Hamza El Ouardi', expected: 'Messages interne, clients et presse.', items: ['Message interne pour les salariés', 'Réponse aux clients concernés', 'Message d’attente pour la presse', 'Recenser demandes reçues et réponses envoyées'], reply: null },
];

// Registre D1–D5 du Plan de containment, corrigé avec les choix réellement tracés sur la
// plateforme KASBAH (heures réalignées). Le détail des 12 décisions est dans cellDecisions.js.
export const decisions = [
  { id: 'D1', when: 'J1 ~15:30', subject: 'Poste patient zéro FIN-112', choice: 'Isoler du réseau, laisser sous tension', rationale: 'Stopper la propagation en préservant la mémoire vive ; validé par le Forensic (J1 16:05).', status: 'fait' },
  { id: 'D2', when: 'J2 ~12:25', subject: 'Couper ou maintenir les serveurs encore en service', choice: 'Isoler seulement les segments critiques', rationale: 'Choix tracé sur la plateforme (le plan proposait « tout couper »). Partages et annuaire coupés, OT et site public maintenus (DSI, 15:58) ; le RSSI juge le compromis bon sous conditions.', status: 'fait', options: ['Tout couper et isoler du réseau', 'Maintenir le service coûte que coûte', 'Isoler seulement les segments critiques ✓'] },
  { id: 'D3', when: 'J2 ~16:05', subject: 'Notifier l’Autorité', choice: 'Notifier maintenant, en transparence', rationale: 'Obligation réglementaire ; promptitude et transparence notées favorablement par l’Autorité (J2 16:42).', status: 'fait' },
  { id: 'D4', when: 'J2 ~15:10', subject: 'Communication presse', choice: 'Répondre et donner notre version à Maghreb Éco', rationale: 'Article équilibré (J2 16:01), équipes apaisées ; article en ligne au ton nuancé (J3 13:07).', status: 'fait' },
  { id: 'D5', when: 'J3 ~12:00', subject: 'Payer ou non la rançon', choice: 'Temporiser / tenter de négocier, puis continuer à faire traîner', rationale: 'SIROCCO double le prix (40 BTC, échéance minuit) et publie deux lots. La PDG exige une position ferme dans l’heure (J3 12:16). Risque/Conformité recommande de ne pas payer ; les copies hors ligne de Settat permettent de repartir sans payer.', status: 'bloque', options: ['Payer la rançon', 'Ne pas payer', 'Temporiser / tenter de négocier ✓'] },
];

// Décisions demandées à la Direction par Risque / Conformité (12:00)
export const decisionsRequested = [
  'Valider la déclaration à la DGSSI aujourd’hui et la notification CNDP (échéance interne ≤ 72 h).',
  'Acter le non-paiement de la rançon et le dépôt de plainte.',
  'Suspendre le compte OasisNet, exiger ses journaux et une mise en demeure contractuelle.',
  'Imposer la double validation + contre-appel sur tout virement jusqu’à la fin de la crise.',
  'Autoriser la communication clients (< 24 h) et salariés (ce soir).',
];

// Cartographie simplifiée du SI (zones fonctionnelles)
export const siZones = [
  { id: 'admin', label: 'Administration distante', items: ['VPN-GW / FortiGate'], note: 'Équipe interne et OasisNet', tone: 'serious' },
  { id: 'identity', label: 'Identités et droits', items: ['DC-01 / DC-02', 'Active Directory'], note: 'Utilisé par les applications*', tone: 'serious' },
  { id: 'client', label: 'Service client exposé', items: ['WEB-CLI-01', 'Portail de facturation'], note: 'Lien à FACT-02 à préciser*', tone: 'neutral' },
  { id: 'workplace', label: 'Postes et collaboration', items: ['FIN-112, RH-031', 'MSG-01, INTRA-01, IPBX-01', 'FILER-RBT-02 / FILER-CASA-01'], note: 'SI interne', tone: 'neutral' },
  { id: 'business', label: 'Applications métiers', items: ['ERP-APP-01 / ERP-DB-01', 'PAIE-01', 'FACT-02'], note: 'SI interne', tone: 'neutral' },
  { id: 'backup', label: 'Reprise des données', items: ['VBR-01 / BKP-01/02 (Veeam)', 'En ligne : quotidien / OasisNet', 'Hors ligne : LTO-9 trimestriel'], note: 'Couverture à vérifier*', tone: 'serious' },
  { id: 'protection', label: 'Protection des systèmes', items: ['Microsoft Defender for Endpoint', 'Console centrale / interne'], note: 'Détection', tone: 'neutral' },
  { id: 'ot', label: 'Exploitation industrielle', items: ['SCADA-HMI-*', 'Réseau OT déclaré isolé'], note: 'Gestion interne séparée', tone: 'good' },
];

export const dependencies = [
  { id: 1, name: 'Annuaire et comptes privilégiés', concern: 'Plusieurs systèmes utilisent les mêmes identités ; un compte compromis ouvre plusieurs ressources.', toCheck: 'Applications liées à l’annuaire, droits des comptes de service, séparation des comptes d’administration.' },
  { id: 2, name: 'OasisNet et accès distants', concern: 'OasisNet administre une partie du SI et les sauvegardes en ligne.', toCheck: 'Droits attribués, protection des accès VPN, séparation des accès aux sauvegardes.' },
  { id: 3, name: 'Services métiers et sauvegardes', concern: 'Si les sauvegardes en ligne sont perdues, les bandes trimestrielles entraînent une perte importante.', toCheck: 'Services couverts, date des copies, intégrité des bandes, tests de restauration.' },
  { id: 4, name: 'Application ERP et base SQL', concern: 'ERP-APP-01 dépend de ERP-DB-01 ; la perte de la base bloque l’application.', toCheck: 'Sauvegardes cohérentes de l’application et de la base, comptes de service.' },
  { id: 5, name: 'Portail client et facturation', concern: 'Un lien entre le portail exposé et la facturation interne pourrait étendre un incident (hypothèse).', toCheck: 'Échanges entre WEB-CLI-01 et FACT-02, comptes utilisés, restrictions.' },
  { id: 6, name: 'OT et services de support', concern: 'Le réseau industriel est déclaré isolé ; accès de maintenance ou moyens partagés possibles.', toCheck: 'Accès de maintenance, identités propres à l’OT, fonctionnement dégradé.' },
];

export const priorities = [
  'Placer la continuité de l’exploitation industrielle en premier.',
  'Maîtriser les comptes privilégiés.',
  'Disposer de sauvegardes fiables.',
];

// Contribution attendue de chaque cellule (cartographie, page 2)
export const cellContributions = {
  communication: 'S’appuyer sur les impacts identifiés pour préparer une information claire ; faire valider les messages par la Direction.',
  continuite: 'Examiner les priorités métier, les conséquences d’un arrêt et les possibilités de reprise, notamment à partir des sauvegardes.',
  risque: 'Apprécier les risques et engagements associés aux actifs : contrats clients, responsabilités d’OasisNet, obligations applicables.',
  soc: 'Utiliser la cartographie et la criticité pour orienter la surveillance, qualifier les alertes et identifier les systèmes concernés.',
  forensics: 'Relier les éléments techniques aux systèmes recensés, vérifier les hypothèses et préciser les dépendances utiles à l’investigation.',
};
