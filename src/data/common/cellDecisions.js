// Les 12 décisions tracées par la cellule sur la plateforme KASBAH (« KASBAH · Cellule.pdf »).
// `choice` = option retenue ; `outcome` = réactions reçues dans le fil ensuite.
// `docRef` relie la décision au registre D1–D5 du Plan de containment quand il existe.

export const cellDecisions = [
  {
    id: 'patient-zero', docRef: 'D1', day: 'J1', time: '~15:30', cellId: 'soc', askedBy: 'Karim Bennis · DSI',
    title: 'Le poste patient zéro',
    question: 'FIN-112, premier poste infecté, est encore allumé et connecté. Que faites-vous de ce poste ?',
    options: ['L’isoler du réseau, mais le laisser sous tension', 'Le laisser connecté pour observer l’attaquant', 'L’éteindre immédiatement'],
    choice: 0,
    outcome: [{ from: 'Forensic', at: 'J1 16:05', text: 'Bon geste : propagation coupée, mémoire vive préservée pour capturer processus et connexions C2.', tone: 'good' }],
  },
  {
    id: 'couper-maintenir', docRef: 'D2', day: 'J2', time: '~12:25', cellId: 'continuite', askedBy: 'Karim Bennis · DSI',
    title: 'Couper ou maintenir',
    question: 'La propagation continue et de nouveaux partages sont touchés. Que décidez-vous pour les serveurs encore en service ?',
    options: ['Tout couper et isoler du réseau', 'Maintenir le service coûte que coûte', 'Isoler seulement les segments critiques'],
    choice: 2,
    note: 'Le Plan de containment proposait « tout couper » et laissait ce choix « à reporter » : la décision réellement tracée est l’isolement ciblé.',
    outcome: [
      { from: 'Karim Bennis · DSI', at: 'J2 15:58', text: 'Isolement ciblé acté : partages de fichiers et annuaire coupés, OT industriel et site public maintenus.', tone: 'good' },
      { from: 'Le RSSI', at: 'J2 15:58', text: 'Bon compromis, sous conditions : surveiller les segments maintenus, tenir une liste écrite de ce qui est isolé.', tone: 'warning' },
    ],
  },
  {
    id: 'comm-interne', docRef: null, day: 'J2', time: '~12:55', cellId: 'communication', askedBy: 'Représentant du personnel',
    title: 'Communication interne',
    question: 'La rumeur « les salaires ne seront pas versés » enfle sur l’intranet. Que communiquez-vous aux équipes ?',
    options: ['Communiquer clairement : incident en cours, salaires assurés', 'Rassurer sans détailler l’incident', 'Ne rien dire pour l’instant'],
    choice: 1,
    outcome: [
      { from: 'Représentant du personnel', at: 'J2 15:58', text: 'Ton rassurant mais vague : « ils ne nous disent pas tout ». Ça tient pour l’instant.', tone: 'warning' },
      { from: 'Représentant du personnel', at: 'J2 16:01', text: 'Après l’article mesuré, les équipes se calment.', tone: 'good' },
    ],
  },
  {
    id: 'ot', docRef: null, day: 'J2', time: '~13:30', cellId: 'continuite', askedBy: 'Service informatique · SOC',
    title: 'Le réseau industriel (OT)',
    question: 'Deuxième vague : la sonde OT détecte des tentatives de reconnaissance vers la passerelle. Rien n’est compromis. Que décidez-vous ?',
    options: ['Couper préventivement la passerelle OT', 'Renforcer la surveillance sans couper', 'Considérer que l’isolement suffit, ne rien changer'],
    choice: 1,
    outcome: [
      { from: 'Karim Bennis · DSI', at: 'J2 15:59', text: 'Surveillance de la passerelle renforcée, règles durcies ; couper à la moindre progression.', tone: 'good' },
      { from: 'Sonde réseau OT', at: 'J2 15:59', text: 'Nouvelle tentative de reconnaissance BLOQUÉE ; aucune session vers le segment industriel ; énergie / eau nominales.', tone: 'good' },
      { from: 'Le RSSI', at: 'J2 15:59', text: 'Pari tenable : si l’attaquant passe la passerelle, l’enjeu devient la sûreté physique.', tone: 'warning' },
    ],
  },
  {
    id: 'assureur', docRef: null, day: 'J2', time: '~14:45', cellId: 'risque', askedBy: 'Assureur cyber',
    title: 'Déclarer à l’assureur cyber',
    question: 'Le contrat impose de déclarer sous 48 h et d’obtenir un accord écrit avant toute dépense majeure (dont une rançon).',
    options: ['Déclarer le sinistre immédiatement', 'Constituer d’abord un dossier solide, puis déclarer', 'Attendre d’y voir plus clair avant de déclarer'],
    choice: 1,
    outcome: [
      { from: 'Assureur cyber', at: 'J2 16:01', text: 'Ne tardez pas trop : un dossier parfait déclaré hors délai peut être refusé. Déclarer a minima.', tone: 'warning' },
      { from: 'Assureur cyber', at: 'J2 16:42', text: 'Couverture confortée : notification dans les délais.', tone: 'good' },
    ],
  },
  {
    id: 'presse', docRef: 'D4', day: 'J2', time: '~15:10', cellId: 'communication', askedBy: 'Leïla Mansouri · Maghreb Éco',
    title: 'Communiquer à la presse',
    question: 'Maghreb Éco publie ce soir à 18 h. Répondez-vous à la journaliste ?',
    options: ['Répondre et donner notre version', 'Garder le silence', 'Démentir l’incident'],
    choice: 0,
    outcome: [
      { from: 'Leïla Mansouri', at: 'J2 16:01', text: 'Article équilibré : factuel, mesures engagées mentionnées, pas de sensationnel.', tone: 'good' },
      { from: 'Leïla Mansouri', at: 'J3 13:07', text: 'Article en ligne, ton équilibré et nuancé.', tone: 'good' },
    ],
  },
  {
    id: 'client', docRef: null, day: 'J2', time: '~15:50', cellId: 'communication', askedBy: 'Chérifienne des Mines',
    title: 'Répondre au client',
    question: 'La Chérifienne des Mines exige sous 24 h une attestation écrite indiquant si ses données ont été exposées.',
    options: ['Attester par écrit que ses données ne sont pas exposées', 'Rester factuel : dire ce qu’on sait, sans promettre', 'Proposer un geste commercial'],
    choice: 1,
    outcome: [
      { from: 'Chérifienne des Mines', at: 'J2 16:03', text: 'Réponse prudente notée : honnêteté appréciée, reste en alerte.', tone: 'warning' },
      { from: 'Assureur cyber', at: 'J2 16:03', text: 'La bonne approche : ne jamais garantir ce qui n’est pas établi.', tone: 'good' },
    ],
  },
  {
    id: 'autorite', docRef: 'D3', day: 'J2', time: '~16:05', cellId: 'risque', askedBy: 'L’Autorité',
    title: 'Notifier l’Autorité',
    question: 'L’Autorité exige des éléments sous 72 heures. Quelle est votre position ?',
    options: ['Notifier maintenant, en transparence', 'Attendre d’avoir une image complète'],
    choice: 0,
    outcome: [{ from: 'L’Autorité', at: 'J2 16:42', text: 'Notification reçue : qualification partielle, promptitude et transparence notées favorablement.', tone: 'good' }],
  },
  {
    id: 'rancon', docRef: 'D5', day: 'J3', time: '~12:00', cellId: 'direction', askedBy: 'Salima Idrissi · PDG',
    title: 'Payer ou ne pas payer',
    question: 'L’ultimatum de SIROCCO expire à 11 h 00. Quelle est la décision de la cellule ?',
    options: ['Payer la rançon', 'Ne pas payer', 'Temporiser / tenter de négocier'],
    choice: 2,
    outcome: [
      { from: 'Salima Idrissi · PDG', at: 'J3 12:12', text: 'Chaque heure gagnée est une heure d’exposition : fixer une limite ferme et une position de repli écrite.', tone: 'warning' },
      { from: 'SIROCCO', at: 'J3 12:12', text: 'Le prix double : 40 BTC, nouvelle échéance ce soir minuit.', tone: 'critical' },
    ],
  },
  {
    id: 'contre-attaque', docRef: null, day: 'J3', time: '~12:14', cellId: 'direction', askedBy: 'SIROCCO',
    title: 'SIROCCO contre-attaque',
    question: 'Prix doublé (40 BTC), échéance minuit, premier lot de données publié. Que faites-vous ?',
    options: ['Payer les 40 BTC exigés', 'Refuser et tenir la ligne, quoi qu’il arrive', 'Continuer à faire traîner encore'],
    choice: 2,
    outcome: [
      { from: 'SIROCCO', at: 'J3 12:16', text: 'Second lot publié immédiatement ; le prix ne baissera plus.', tone: 'critical' },
      { from: 'Salima Idrissi · PDG', at: 'J3 12:16', text: 'Il faut trancher : une position ferme dans l’heure, plus de zone grise.', tone: 'critical' },
    ],
  },
  {
    id: 'priorite', docRef: null, day: 'J3', time: '~12:58', cellId: 'continuite', askedBy: 'Karim Bennis · DSI',
    title: 'Priorité de restauration',
    question: 'Les ressources de restauration sont limitées. Que remontez-vous en priorité ?',
    options: ['La paie (PAIE-01) d’abord', 'La facturation clients (FACT-02) d’abord', 'Le cœur ERP d’abord (socle commun)'],
    choice: 1,
    note: 'Le PRA prévoyait ERP-DB / ERP-APP puis FACT-02 dans la phase « Revenu » ; la cellule a priorisé FACT-02.',
    outcome: [
      { from: 'Chérifienne des Mines', at: 'J3 13:01', text: 'Relation sauvée : suspension de toute démarche de résiliation.', tone: 'good' },
      { from: 'La DRH', at: 'J3 13:01', text: 'La paie passe après : colère des équipes à assumer si les salaires prennent du retard.', tone: 'warning' },
    ],
  },
  {
    id: 'sauvegarde', docRef: null, day: 'J3', time: '~13:05', cellId: 'continuite', askedBy: 'Karim Bennis · DSI',
    title: 'Quelle sauvegarde restaurer',
    question: 'Sauvegarde en ligne (rapide, peut-être atteinte) ou copie air-gap de Settat (lente, déconnectée, sûre) ?',
    options: ['Restaurer depuis l’air-gap de Settat (sûr, lent)', 'Restaurer en ligne, après analyse d’intégrité', 'Restaurer vite depuis la sauvegarde en ligne'],
    choice: 0,
    outcome: [{ from: 'Karim Bennis · DSI', at: 'J3 13:08', text: 'Le bon réflexe : on repart d’une copie déconnectée, on ne réintroduit rien.', tone: 'good' }],
  },
];
