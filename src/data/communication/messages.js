// Cellule de communication de crise — 10 documents de Data/Communication.
// Les corps de message sont repris des fichiers sources. Aucune date d'envoi
// n'y figure (sauf les communiqués, datés du 24/09/2026) : `day` est déduit de
// l'événement traité et signalé comme tel.

export const AUDIENCES = {
  interne: { label: 'Cellule de crise', icon: 'Shield' },
  salaries: { label: 'Salariés', icon: 'Users' },
  clients: { label: 'Clients', icon: 'Building2' },
  presse: { label: 'Presse', icon: 'Newspaper' },
  public: { label: 'Public', icon: 'Megaphone' },
};

export const messages = [
  {
    id: 'msg-badge', docId: 'com-badge', audience: 'interne', kind: 'Alerte',
    subject: 'Alerte — Anomalie de contrôle d’accès', day: 'J1', dayInferred: true,
    status: 'superseded', supersededBy: 'msg-badge2',
    topics: ['Badge stagiaire IT', 'Clé PAIE-SAUVE', 'Caméras 02h–04h', 'Connexions sans MFA'],
    evidence: ['A-14', 'A-17'],
    body: [
      'La DRH nous signale une utilisation inhabituelle du badge attribué au stagiaire IT durant la nuit du week-end, entre 02h00 et 04h00, avec un accès signalé du côté de la salle des serveurs.',
      'Une clé USB nommée « PAIE-SAUVE » a été retrouvée au sol à proximité de la zone concernée ; elle aurait été branchée hier soir sur un poste du service paie. Les caméras de surveillance ont été indisponibles entre 02h00 et 04h00. Les logs de cette même période font apparaître plusieurs connexions sans authentification MFA.',
      'Point important : ces éléments sont actuellement corrélés temporellement, mais nous ne pouvons pas encore affirmer qu’ils ont une origine commune ni attribuer l’activité à une personne précise.',
      'Actions prioritaires : préserver et analyser les logs 02h00–04h00 ; identifier les comptes connectés sans MFA ; analyser la clé USB sans la connecter à un système de production ; vérifier les journaux de la badgeuse ; analyser la cause de l’indisponibilité des caméras ; préserver les éléments nécessaires à l’analyse forensique.',
      'La cellule de communication reste en attente des résultats de l’analyse technique afin de préparer une communication officielle et factuelle.',
    ],
  },
  {
    id: 'msg-badge2', docId: 'com-badge2', audience: 'interne', kind: 'Point de situation',
    subject: 'Point de situation — Mise hors de cause du stagiaire IT', day: 'J2', dayInferred: true,
    status: 'sent', closes: 'FP-2',
    topics: ['Stagiaire hors de cause', 'Lecteur en maintenance', 'Présomption d’innocence'],
    evidence: ['A-14'],
    body: [
      'L’anomalie liée au badge est totalement écartée : le lecteur de la salle des serveurs était en maintenance durant tout le week-end, et les horodatages enregistrés correspondaient à des relectures de cache non fiables.',
      'L’alibi du stagiaire est confirmé : il était officiellement en congé, justificatif à l’appui. Le stagiaire est totalement hors de cause, et la piste initiale (FP-2) est officiellement levée.',
      'Conformément à nos consignes de communication de crise, aucune accusation hâtive n’ayant été rendue publique, notre réputation et la présomption d’innocence de notre collaborateur ont été préservées.',
      'Nous poursuivons nos investigations techniques sur les autres aspects de l’intrusion (analyse de la clé USB et des accès réseau).',
    ],
  },
  {
    id: 'msg-usb', docId: 'com-usb', audience: 'interne', kind: 'Point de situation',
    subject: 'Point de situation — Écart de la piste « PAIE-SAUVE »', day: 'J2', dayInferred: true,
    status: 'sent', closes: 'FP-6',
    topics: ['Ticket #4471', '44 Mo', '118 Go exfiltrés', 'Ultimatum 20 BTC'],
    evidence: ['A-17', 'A-03'],
    body: [
      'La piste de la clé « PAIE-SAUVE » est officiellement fermée (FP-6 écartée) : il s’agit d’une sauvegarde manuelle légitime effectuée par la gestionnaire de paie avant la clôture du mois, tracée par le ticket #4471 et réalisée en fin de journée, pendant les heures ouvrées.',
      'Le transfert représente un volume de 44 Mo sans aucune sortie réseau constatée. Cette manipulation n’a aucun lien avec l’exfiltration nocturne massive de 118 Go constatée par ailleurs. L’hypothèse d’un initié malveillant sur ce point est donc levée.',
      'Nos efforts de communication et d’investigation doivent se concentrer sur les autres vecteurs de l’attaque en cours, notamment face à l’ultimatum des 20 BTC.',
    ],
  },
  {
    id: 'msg-suspect', docId: 'com-suspect', audience: 'interne', kind: 'Signalement',
    subject: 'Signalement — Courriel financier suspect (Réf. A-23)', day: 'J2', dayInferred: true,
    status: 'sent',
    topics: ['Fraude au président', '480 000 dirhams', 'Aucun paiement effectué'],
    evidence: ['A-23'],
    body: [
      'Nature du signalement (A-23) : un courriel présenté comme provenant de la PDG demande un virement urgent de 480 000 dirhams vers un nouveau fournisseur à l’étranger, avec une consigne de confidentialité.',
      'L’adresse de l’expéditeur présente des anomalies et le ton de la demande interpelle. Le collaborateur n’a effectué aucun paiement et a mis l’opération en attente de vérification.',
      'Prochaine étape : analyser rapidement la légitimité de cette demande avec la direction financière et les équipes de sécurité. Tant que les vérifications ne sont pas bouclées, la plus grande prudence est de mise sur tous les ordres de virement inhabituels.',
    ],
  },
  {
    id: 'msg-paiement', docId: 'com-paiement', audience: 'salaries', kind: 'Message interne',
    subject: 'Point d’information interne — Situation des systèmes et versement des salaires', day: 'J2', dayInferred: true,
    status: 'sent', signedBy: 'Le comité de direction et la Cellule de communication de crise',
    topics: ['Rumeur sur les salaires', 'Canaux officiels'],
    evidence: [],
    body: [
      'Une rumeur infondée circule concernant le versement des salaires de ce mois-ci, prétendument impacté par l’incident informatique. Le comité de direction tient à vous rassurer : cette rumeur est totalement fausse.',
      'Les équipes financières et techniques travaillent activement pour rétablir l’ensemble de nos services. Le versement des salaires n’est en aucun cas menacé et sera effectué dans les délais habituels.',
      'Nous vous invitons à faire preuve de vigilance face aux bruits de couloir et à privilégier les canaux de communication officiels de l’entreprise.',
    ],
  },
  {
    id: 'msg-facturation', docId: 'com-facturation', audience: 'clients', kind: 'Réponse client',
    subject: 'Réponse — Indisponibilité du portail de facturation', day: 'J1', dayInferred: true,
    status: 'sent',
    topics: ['Portail de facturation', 'Fichiers .mirage', 'Clôture comptable'],
    evidence: [],
    body: [
      'Nous accusons réception de votre signalement concernant l’indisponibilité du portail de facturation AtlasGrid et comprenons l’impact sur vos opérations de clôture comptable.',
      'Nos équipes ont identifié la cause : plusieurs fichiers présents sur le partage comptable ont été chiffrés et renommés avec l’extension « .mirage », les rendant inaccessibles.',
      'Cet événement est en cours d’investigation afin de déterminer précisément son périmètre, son origine et les systèmes concernés. Des mesures de confinement ont été engagées ; nos équipes travaillent sur les possibilités de restauration et le rétablissement progressif des services.',
      'Nous vous communiquerons une nouvelle mise à jour dès que nous disposerons d’éléments confirmés concernant la restauration et le délai de rétablissement.',
    ],
  },
  {
    id: 'msg-chefdesmines', docId: 'com-chefdesmines', audience: 'clients', kind: 'Réponse client',
    subject: 'RE: Exigence de garanties — Point sur la sécurité de vos données', day: 'J2', dayInferred: true,
    status: 'sent', recipient: 'Chérifienne des Mines',
    topics: ['Confinement', 'Aucune exfiltration avérée à ce stade', 'Mise à jour dès demain'],
    evidence: [],
    body: [
      'Nous accusons réception de votre message et comprenons votre exigence de transparence et de garanties concernant la protection de vos données contractuelles.',
      'Dès la détection de l’incident, nos équipes, accompagnées d’experts en cybersécurité, ont appliqué des mesures de confinement strictes. Les réseaux critiques et de supervision continuent de fonctionner en toute sécurité.',
      'Nos investigations se poursuivent pour cartographier précisément le périmètre des données touchées. À ce stade, aucune fuite ou exfiltration avérée de vos informations contractuelles n’a pu être mise en évidence.',
      'Nous nous engageons à revenir vers vous dès demain avec une mise à jour consolidée et officielle dès que l’analyse forensique complète sera stabilisée.',
    ],
  },
  {
    id: 'msg-article', docId: 'com-article', audience: 'presse', kind: 'Droit de réponse',
    subject: 'RE: Demande d’information — Incident de sécurité AtlasGrid', day: 'J2', dayInferred: true,
    status: 'sent', recipient: 'Mme Mansouri',
    topics: ['Rançongiciel confirmé', 'Situation sous contrôle', 'Pas de fuite avérée confirmée'],
    evidence: ['A-16'],
    body: [
      'Nous vous confirmons qu’AtlasGrid fait effectivement face à un incident technique de type rançongiciel, détecté sur une partie de notre infrastructure.',
      'Dès les premières minutes, nos équipes, en lien avec des experts en cybersécurité, ont activé nos protocoles de défense et de confinement. Les mesures d’isolation ont permis de stopper la propagation, et les travaux de restauration progressifs sont en cours.',
      'Concernant vos informations relatives à un vol de données, nos investigations se poursuivent. À ce stade, nous ne pouvons confirmer de fuite avérée et la plus grande rigueur est de mise.',
      'Nous vous remercions de bien vouloir refléter ces éléments factuels et mesurés dans votre article.',
    ],
  },
  {
    id: 'msg-rendu', docId: 'com-rendu', audience: 'public', kind: 'Communiqué officiel',
    subject: 'Communiqué — Incident technique maîtrisé et sécurisation des infrastructures', day: 'J2', dayInferred: false,
    status: 'deposited', depositedAt: 'J2 16:40', variant: 'A',
    topics: ['OasisNet nommé', 'OT/SCADA intact (air-gap)', 'Coopération autorités'],
    evidence: [],
    body: [
      'AtlasGrid fait face à un incident de cybersécurité de type rançongiciel, ayant touché une partie de ses serveurs administratifs et de gestion. Dès la détection, nos protocoles de confinement ont été activés.',
      'Les premiers éléments mettent en évidence une vulnérabilité potentielle au niveau des accès distants et des mécanismes d’administration, dont une partie est gérée par notre prestataire OasisNet. Des cloisonnements d’accès insuffisants au niveau de cet environnement prestataire auraient pu contribuer à l’exposition de l’infrastructure. Une exigence de transparence totale a été transmise à OasisNet.',
      'Les services énergétiques et de supervision (réseau OT/SCADA) restent totalement opérationnels et intacts, grâce à une architecture de type air-gap. La situation est sous contrôle technique.',
      'AtlasGrid collabore étroitement avec les autorités compétentes et les régulateurs. Une cellule d’information dédiée reste active pour les clients.',
    ],
  },
  {
    id: 'msg-communique', docId: 'com-communique-crise', audience: 'public', kind: 'Communiqué officiel',
    subject: 'Communiqué — Incident de cybersécurité (ce que nous savons à ce stade)', day: 'J2', dayInferred: false,
    status: 'deposited', depositedAt: 'J2 16:46', variant: 'B',
    topics: ['Aucune conclusion sur un tiers', 'Transferts non autorisés', 'Sources citées'],
    evidence: [],
    body: [
      'AtlasGrid fait face à un incident de cybersécurité de type rançongiciel. Le poste à l’origine de la propagation a été identifié et isolé. Une investigation est en cours, appuyée par des experts externes.',
      'L’accès initial est passé par un compte d’administration distante compromis. L’origine de cette compromission fait l’objet d’une investigation ; nous ne tirerons aucune conclusion, y compris sur l’implication d’un tiers, avant que les éléments ne soient établis. Nos analyses ont mis en évidence des transferts de données non autorisés sur plusieurs nuits précédant l’incident.',
      'Certains outils, dont le portail de facturation, sont temporairement perturbés. Nous informerons individuellement toute partie dont les données seraient identifiées comme concernées.',
      'Le réseau de supervision industrielle fonctionne normalement. Aucune intrusion n’y est confirmée à ce stade ; nous ne pouvons cependant pas garantir un résultat définitif tant que l’investigation se poursuit.',
      'Base de cette communication : journaux techniques collectés par la cellule d’investigation (accès distant, pare-feu, EDR) et constats du prestataire de sécurité, arrêtés au 24 septembre 2026.',
    ],
  },
];

// Comparaison des deux communiqués officiels datés du 24/09/2026. Ordre établi par la
// plateforme : Rendu_communication.pdf déposé à J2 16:40, communique_crise.pdf à 16:46 (version finale).
export const communiqueComparison = [
  { topic: 'Rôle d’OasisNet', a: 'Nommé : « cloisonnements d’accès insuffisants » chez le prestataire', b: '« Nous ne tirerons aucune conclusion, y compris sur l’implication d’un tiers »' },
  { topic: 'Vol de données', a: 'Non mentionné', b: '« Transferts de données non autorisés […] sur plusieurs nuits »' },
  { topic: 'Réseau OT / SCADA', a: '« Totalement opérationnels et intacts »', b: '« Aucune intrusion confirmée à ce stade » ; pas de garantie définitive' },
  { topic: 'Impact clients', a: 'Cellule d’information dédiée', b: 'Portail de facturation perturbé ; information individuelle des parties concernées' },
  { topic: 'Sources', a: 'Non citées', b: 'Journaux accès distant, pare-feu, EDR arrêtés au 24/09/2026' },
];

// Règles de communication issues des documents (note DC/2026/01, PCA 4.4, Risque / Conformité)
export const communicationRules = [
  { rule: 'La Continuité fournit les faits, la Communication rédige, la Direction valide avant tout envoi.', source: 'PCA / PRA, section 4.4' },
  { rule: 'Ne promettre aucun délai de rétablissement sans validation de Continuité et de la Direction.', source: 'Note DC/2026/01' },
  { rule: 'Rester cohérent, éviter toute accusation non étayée, soumettre à validation avant diffusion.', source: 'Note DC/2026/01' },
  { rule: 'Réponse client factuelle, sans aveu de faute ni spéculation sur les données.', source: 'Retour Risque / Conformité v3' },
  { rule: 'Indiquer pour chaque message les faits annonçables, les consignes utiles et l’heure du prochain point.', source: 'Note DC/2026/01' },
];

// Demandes entrantes recensées dans la main courante et le fil SOC
export const inboundRequests = [
  { from: 'Chérifienne des Mines', when: 'J1 15:12', request: 'Portail de facturation inaccessible (SLA 99,5 %) : explication écrite et rétablissement sous 24 h', response: 'msg-facturation', status: 'fait', note: null },
  { from: 'Chérifienne des Mines', when: 'J2 15:46', request: 'Attestation écrite : nos données ont-elles été exposées ? Menace de résiliation', response: 'msg-chefdesmines', status: 'fait', note: 'Décision « rester factuel » : réponse prudente notée (J2 16:03), relation sauvée (J3 13:01)' },
  { from: 'Presse — Leïla Mansouri, Maghreb Éco', when: 'J2 15:06', request: 'Publication à 18h00 d’un article sur un possible vol de données ; réponse avant 17h00', response: 'msg-article', status: 'fait', note: 'Décision « répondre et donner notre version » : article équilibré (J2 16:01)' },
  { from: 'Représentant du personnel', when: 'J1 15:57', request: 'Une communication claire avant ce soir, même courte', response: null, status: 'fait', note: 'Traité par le message salariés du J2' },
  { from: 'Représentant du personnel', when: 'J2 12:36', request: 'Rumeur « les salaires ne seront pas versés » ; menace de débrayage', response: 'msg-paiement', status: 'fait', note: 'Décision « rassurer sans détailler » : ton jugé vague (J2 15:58)' },
  { from: 'Un salarié de la direction financière', when: 'J1 12:17', request: '« Je crois que j’ai cliqué… » : que faire ? discrétion demandée', response: null, status: 'a-faire', note: 'Aucune réponse tracée dans le dossier' },
  { from: 'Clients présents dans l’extrait A-07', when: 'Avant J3 11h00', request: 'Information avant publication par SIROCCO', response: null, status: 'a-faire', note: 'M5' },
];
