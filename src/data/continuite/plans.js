// PCA_PRA_AtlasGrid_Cellule_Continuite.pdf et Plan_de_containment_complet.pdf
// (situation au soir du jour 2). `cells` rattache chaque porteur aux cellules de
// crise lorsque le porteur en est une (DSI, DRH, Exploitation… n'en sont pas).

export const ACTION_STATUS = {
  fait: { label: 'Fait', tone: 'good', desc: 'Réalisé et vérifié' },
  'en-cours': { label: 'En cours', tone: 'info', desc: 'Lancé' },
  'a-faire': { label: 'À faire', tone: 'neutral', desc: 'Décidé, pas lancé' },
  'a-confirmer': { label: 'À confirmer', tone: 'warning', desc: 'Réalisé selon nos informations, à vérifier' },
  bloque: { label: 'Bloqué', tone: 'critical', desc: 'En attente d’une décision ou d’un tiers' },
};

export const planDefinitions = [
  { term: 'PCA', def: 'Mesures permettant de maintenir les activités essentielles pendant la crise, au besoin en mode dégradé.' },
  { term: 'PRA', def: 'Mesures permettant de restaurer le SI et de revenir au fonctionnement normal après la crise.' },
  { term: 'DMIA', def: 'Durée maximale d’interruption admissible (équivalent RTO).' },
  { term: 'PDMA', def: 'Perte de données maximale admissible, exprimée en temps (équivalent RPO).' },
];

export const workingAssumptions = [
  { status: 'Fait', element: 'Rançongiciel MIRAGE attribué au groupe SIROCCO ; lenteurs, fichiers renommés.', consequence: 'Risque de chiffrement étendu des serveurs Windows / SQL Server.' },
  { status: 'Fait', element: 'OasisNet signale une maintenance « mal terminée » ce week-end, sans détail ni ticket.', consequence: 'Sauvegardes en ligne et accès VPN d’OasisNet considérés comme non fiables.' },
  { status: 'Fait', element: 'FIN-112 identifié comme premier poste touché (EDR désactivé avant chiffrement).', consequence: 'Poste à isoler ; comptes utilisés sur ce poste considérés compromis.' },
  { status: 'Hypothèse', element: 'L’annuaire AD est compromis ou exposé.', consequence: 'Aucune restauration applicative avant reconstruction d’un AD sain.' },
  { status: 'Hypothèse', element: 'Le réseau OT est réellement isolé du SI.', consequence: 'À vérifier en priorité ; protéger l’OT comme s’il était exposé.' },
  { status: 'Hypothèse', element: 'Les jobs Veeam récents sont intègres.', consequence: 'Deux scénarios de reprise prévus.' },
];

export const pcaTriggers = [
  'Chiffrement confirmé sur au moins un serveur',
  'Compromission suspectée d’un compte à privilèges',
  'Indisponibilité d’un actif vital ou critique au-delà de sa DMIA',
  'Doute sérieux sur l’intégrité des sauvegardes',
];

export const conservatoryMeasures = [
  { n: 1, measure: 'Vérifier et renforcer l’isolement OT : couper tout lien avec le SI, suspendre les accès distants, conduite locale renforcée.', asset: 'SCADA', why: 'Actif vital ; isolement déclaré mais non prouvé.', owner: 'Continuité + équipe OT' },
  { n: 2, measure: 'Isoler les sauvegardes : déconnecter VBR-01 et BKP-01/02, geler toute purge, bandes LTO-9 sous clé au site secondaire.', asset: 'Sauvegardes', why: 'Les attaquants détruisent les sauvegardes avant de chiffrer.', owner: 'Continuité + DSI' },
  { n: 3, measure: 'Restreindre le VPN d’administration : suspendre les comptes OasisNet, interventions validées et accompagnées.', asset: 'VPN-GW', why: 'Incident non expliqué chez OasisNet ; forts privilèges.', owner: 'DSI, sur décision Direction' },
  { n: 4, measure: 'Isoler FIN-112 sans l’éteindre (préservation de la mémoire).', asset: 'Postes / SI', why: 'Stopper la propagation en gardant les preuves.', owner: 'SOC + Forensic' },
  { n: 5, measure: 'Préserver les preuves : journaux VPN, EDR, pare-feu, Veeam ; ne rien réinstaller sans accord Forensic.', asset: 'Enquête, assurance', why: 'Obligation de préservation de la police cyber.', owner: 'Forensic' },
  { n: 6, measure: 'Ouvrir un canal hors bande : mobiles, contacts imprimés, messagerie externe de secours.', asset: 'Coordination', why: 'Exchange et IPBX reposent sur le SI attaqué.', owner: 'Continuité + Communication' },
];

export const degradedModes = [
  { activity: 'Conduite du réseau électrique', system: 'SCADA (si doute)', mode: 'Conduite locale par les opérateurs, astreintes renforcées, consignes papier, interdiction de toute connexion externe.', holds: 'Tant que l’OT reste sain', owner: 'Direction de l’exploitation' },
  { activity: 'Facturation clients', system: 'FACT-02, WEB-CLI-01', mode: 'Suspension des émissions ; facturation manuelle des grands comptes prioritaires ; page d’indisponibilité et numéro dédié.', holds: '48 h, puis manuel', owner: 'Direction financière' },
  { activity: 'Achats et stocks', system: 'ERP', mode: 'Bons de commande papier numérotés ; inventaire manuel des pièces critiques ; saisie a posteriori.', holds: '3 à 5 jours', owner: 'Achats / logistique' },
  { activity: 'Paie', system: 'PAIE-01', mode: 'Reconduction de la paie du mois précédent via la banque ; régularisation après reprise.', holds: 'Jusqu’à l’échéance', owner: 'DRH' },
  { activity: 'Coordination interne', system: 'MSG-01, IPBX-01, INTRA-01', mode: 'Mobiles, messagerie de secours, points physiques, annuaire de crise imprimé.', holds: 'Immédiat', owner: 'Cellule Continuité' },
  { activity: 'Documents métiers', system: 'Serveurs de fichiers', mode: 'Versions imprimées ou hors ligne des procédures, contrats et contacts.', holds: '3 jours', owner: 'Chaque direction' },
];

export const continuityCommPlan = [
  { audience: 'Salariés', message: 'Ne pas rallumer les postes isolés, utiliser les canaux de secours, procédures dégradées.', channel: 'SMS, affichage, managers', when: 'Dès H+2' },
  { audience: 'Clients grands comptes', message: 'Fourniture d’énergie maintenue (si confirmé) ; facturation et portail perturbés ; interlocuteur dédié.', channel: 'Téléphone, e-mail de secours', when: 'Avant l’échéance SLA' },
  { audience: 'OasisNet', message: 'Demande écrite d’informations, gel des opérations sur les sauvegardes, restriction des accès.', channel: 'E-mail + appel', when: 'Immédiat' },
  { audience: 'Assureur cyber', message: 'Déclaration du sinistre, mesures de préservation des preuves.', channel: 'Selon la police', when: 'Dans les délais contractuels' },
  { audience: 'Autorité de régulation', message: 'Notification d’incident majeur (loi 05-20) ; délais à confirmer par Risque/Conformité.', channel: 'Canal officiel', when: 'Selon la réglementation' },
];

export const exitCriteria = [
  'L’attaquant est considéré comme expulsé (confirmation Forensic et SOC).',
  'Un annuaire sain est reconstruit et les comptes à privilèges sont réinitialisés.',
  'Les sauvegardes utilisées sont antérieures à la compromission et non altérées.',
  'La Direction valide le passage au PRA, système par système.',
];

export const recoveryPrinciples = [
  'Pas de reprise sans feu vert Forensic : restaurer trop tôt réinstalle l’attaquant.',
  'Reconstruire plutôt que nettoyer les systèmes socles (annuaire en particulier).',
  'Restaurer depuis une sauvegarde antérieure à la date de compromission.',
  'Reprise progressive dans un réseau cloisonné, puis ouverture contrôlée.',
];

// PRA 5.2 — ordre de reprise. start/end en jours relatifs à H0 pour le diagramme.
export const recoveryPhases = [
  { phase: 0, label: 'Préparation', window: 'H0 à J+1', start: 0, end: 1, systems: 'Environnement isolé, sauvegardes', goal: 'Zone saine et sauvegarde vérifiée', gate: 'Test de restauration réussi hors production' },
  { phase: 1, label: 'Socle', window: 'J+1 à J+2', start: 1, end: 2, systems: 'DC-01, DC-02, console EDR', goal: 'Annuaire sain, EDR actif partout', gate: 'Mots de passe à privilèges et comptes de service réinitialisés' },
  { phase: 2, label: 'Communication', window: 'J+2', start: 2, end: 2.5, systems: 'MSG-01, IPBX-01', goal: 'Rendre les outils de coordination', gate: 'Serveurs restaurés, scannés et surveillés' },
  { phase: 3, label: 'Revenu', window: 'J+2 à J+3', start: 2, end: 3, systems: 'ERP-DB-01, ERP-APP-01, FACT-02, puis WEB-CLI-01', goal: 'Relancer la chaîne de facturation', gate: 'Cohérence vérifiée par la finance ; portail en dernier' },
  { phase: 4, label: 'Métiers', window: 'J+3 à J+5', start: 3, end: 5, systems: 'FILER-RBT-02, FILER-CASA-01, PAIE-01', goal: 'Documents et paie', gate: 'Paie priorisée si l’échéance est proche' },
  { phase: 5, label: 'Secondaires', window: 'J+5 et après', start: 5, end: 6.5, systems: 'INTRA-01, postes utilisateurs', goal: 'Retour complet', gate: 'Postes réinstallés ou contrôlés' },
  { phase: 6, label: 'Tiers', window: 'Après validation', start: 6.5, end: 7.5, systems: 'VPN-GW / accès OasisNet', goal: 'Rétablir l’infogérance', gate: 'Explications écrites, MFA, accès journalisés' },
];

export const serviceChecks = [
  'Sauvegarde source antérieure à la compromission et intègre.',
  'Système restauré en réseau isolé, analysé par l’EDR, sans IOC connu.',
  'Correctifs appliqués, comptes locaux et de service renouvelés.',
  'Test fonctionnel validé par le responsable métier.',
  'Décision de remise en service horodatée dans la main courante.',
];

export const recoveryScenarios = [
  { id: 'A', title: 'Veeam sain', condition: 'Jobs récents intacts et antérieurs à la compromission.', dataLoss: 'Environ 24 h', lossHours: 24, actions: 'Reprise selon le calendrier PRA ; ressaisie limitée des opérations du dernier jour à partir des traces papier.' },
  { id: 'B', title: 'Veeam compromis', condition: 'Sauvegardes en ligne chiffrées, supprimées ou douteuses.', dataLoss: 'Jusqu’à 3 mois (dernière bande LTO-9)', lossHours: 2160, actualLoss: 'Réalisé : environ 6 semaines (dernière copie J-42), restauration 5 à 10 jours', actualLossHours: 1008, actions: 'Reprise depuis LTO ; reconstitution à partir des documents papier, e-mails clients, relevés bancaires ; délais allongés ; information Direction, assureur, clients.' },
];

export const majorGap = 'Si les sauvegardes Veeam sont inutilisables, la seule copie saine est la bande LTO-9 trimestrielle : la PDMA réelle peut atteindre 3 mois, très au-delà des 24 h visées. Constat J3 : c’est ce scénario qui s’est produit, avec une dernière copie à J-42 (environ six semaines de pertes), jamais testée.';

export const pointsToConfirm = [
  'Étanchéité réelle du réseau OT (comptes partagés, accès OasisNet, supports amovibles).',
  'Intégrité et date des dernières sauvegardes Veeam réussies.',
  'Nature exacte de l’incident OasisNet et comptes utilisés pendant le week-end.',
  'Lien entre l’ERP et FACT-02 (alimentation des données de facturation).',
  'Périmètre exact de l’engagement de disponibilité de 99,5 %.',
  'Date de la prochaine paie.',
];

// ---- Plan de containment (soir J2) ----

// Heures réalignées sur la plateforme KASBAH (le plan les note une heure plus tôt).
export const deadlines = [
  { id: 'ultimatum', when: 'J3 minuit (initialement J3 11h00)', object: 'Ultimatum SIROCCO : publication des données', todo: 'Position ferme de la Direction sur la rançon ; clients concernés informés avant publication', status: 'bloque', statusNote: 'Après temporisation : 40 BTC, deux lots publiés (J3 12:12–12:16)' },
  { id: 'autorite', when: '72 h après la demande (J2 16:01)', object: 'Éléments demandés par l’Autorité', todo: 'Nature, périmètre, catégories de données, mesures engagées', status: 'en-cours', statusNote: 'Notification reçue J2 16:42' },
  { id: 'assureur', when: '48 h (police d’assurance)', object: 'Déclaration à l’assureur cyber', todo: 'Déclaration a minima puis compléments', status: 'fait', statusNote: 'Couverture confortée J2 16:42' },
  { id: 'cherifienne', when: '24 h après J1 15:12', object: 'Réponse à la Chérifienne des Mines', todo: 'Explication écrite et délai de rétablissement', status: 'fait', statusNote: 'Réponse prudente notée J2 16:03 ; relation sauvée J3 13:01' },
  { id: 'paie', when: 'Date de paie du mois', object: 'Versement des salaires', todo: 'Reconduction de la paie M-1 lancée avec la DRH', status: 'a-faire', statusNote: 'Restauration priorisée sur FACT-02 : paie après (DRH, J3 13:01)' },
];

export const iocBlocklist = [
  { type: 'IP (C2)', value: '45.137.184.62:443', source: 'A-01, A-09', action: 'Blocage entrant et sortant sur tous les pare-feu' },
  { type: 'IP (VPN)', value: '196.200.114.41 · 102.118.53.17', source: 'A-02', action: 'Blocage et recherche dans tous les journaux' },
  { type: 'Domaines', value: 'atlasgrid-it.info · atlasgrid-finance.co', source: 'A-11, A-23', action: 'Blocage DNS, messagerie et proxy ; purge des courriels' },
  { type: 'Compte', value: 'svc_oasisnet', source: 'A-02, A-04, A-05, A-09', action: 'Désactivation immédiate' },
  { type: 'Compte', value: 'admin_local', source: 'A-01', action: 'Désactivation ou changement de mot de passe sur tous les postes' },
  { type: 'Fichier', value: 'C:\\Windows\\svhost32.exe (SHA256 3f9a4b1e…e0c71e)', source: 'A-01', action: 'Blocage EDR et recherche sur tout le parc' },
  { type: 'Règle pare-feu', value: 'OUT-TEMP-443', source: 'A-09', action: 'Export puis suppression' },
  { type: 'Extension / note', value: '.mirage · LISEZMOI_MIRAGE.txt', source: 'A-04, A-13', action: 'Détection de tout nouveau fichier chiffré' },
];

const a = (id, group, action, owner, cells, impact, status, extra = {}) => ({ id, group, action, owner, cells, impact, status, ...extra });

export const containmentActions = [
  a('1', 'Phase 1 — Containment immédiat (H0 à H+2)', 'Maintenir FIN-112 isolé, sous tension, en attente de capture mémoire.', 'SOC / Forensic', ['soc', 'forensics'], 'Un poste de la direction financière indisponible.', 'fait'),
  a('2', 'Phase 1 — Containment immédiat (H0 à H+2)', 'Exporter puis supprimer la règle OUT-TEMP-443 ; bloquer les IP de l’attaquant.', 'SOC', ['soc'], 'Aucun.', 'a-confirmer'),
  a('3', 'Phase 1 — Containment immédiat (H0 à H+2)', 'Désactiver svc_oasisnet et suspendre tous les accès VPN prestataires.', 'DSI, sur décision Direction', ['direction'], 'Infogérance OasisNet arrêtée : interventions sur site, accompagnées.', 'a-confirmer'),
  a('4', 'Phase 1 — Containment immédiat (H0 à H+2)', 'Isoler du réseau les 23 serveurs chiffrés, sans les éteindre.', 'DSI', [], 'Aucun supplémentaire : déjà inutilisables.', 'a-confirmer'),
  a('5', 'Phase 1 — Containment immédiat (H0 à H+2)', 'Couper tout lien SI / OT (dont agent SCCM) ; conduite locale renforcée.', 'Équipe OT', [], 'Pas d’impact sur la production si l’OT est sain.', 'en-cours'),
  a('6', 'Phase 1 — Containment immédiat (H0 à H+2)', 'Déconnecter VBR-01 et BKP-01/02 ; bandes LTO-9 sous clé.', 'Continuité / DSI', ['continuite'], 'Plus aucune sauvegarde automatique jusqu’à la reprise.', 'a-confirmer'),
  a('7', 'Phase 1 — Containment immédiat (H0 à H+2)', 'Bloquer atlasgrid-it.info et atlasgrid-finance.co ; réinitialiser le compte hameçonné.', 'SOC', ['soc'], 'Aucun.', 'a-confirmer'),
  a('8', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Rechercher sur tout le parc : connexions vers 45.137.184.62, svhost32.exe, règles pare-feu récentes.', 'SOC', ['soc'], 'Aucun.', 'en-cours'),
  a('9', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Réinitialiser les mots de passe des comptes à privilèges et de service ; révoquer les sessions.', 'DSI', [], 'Reconnexion nécessaire pour administrateurs et applications.', 'a-faire'),
  a('10', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Bloquer RDP et SMB entre postes de travail (mouvement latéral).', 'DSI', [], 'Partages entre postes indisponibles.', 'a-faire'),
  a('11', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Activer la protection anti-altération de l’EDR et lancer une analyse complète.', 'SOC', ['soc'], 'Ralentissements temporaires.', 'a-faire'),
  a('12', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Surveillance renforcée de DC-02 et de MSG-01.', 'SOC', ['soc'], 'Aucun.', 'en-cours'),
  a('13', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Ne pas restaurer DC-01 ni repartir de DC-02 : annuaire à reconstruire à neuf.', 'DSI / Forensic', ['forensics'], 'Authentification dégradée jusqu’à la reconstruction.', 'a-faire'),
  a('14', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Désactiver le compte de l’ancien DSI a.elomrani ; revue des comptes d’anciens salariés.', 'DSI / RH', [], 'Aucun.', 'a-faire'),
  a('15', 'Phase 2 — Couper l’attaquant de l’intérieur (H+2 à H+24)', 'Surveiller la passerelle IT/OT et appliquer le critère de coupure.', 'Équipe OT / SOC', ['soc'], 'Aucun tant que rien n’est franchi.', 'en-cours'),

  a('P1', 'Continuité pendant le containment', 'Déclencher officiellement le PCA.', 'Direction', ['direction'], null, 'a-confirmer', { holds: '—' }),
  a('P2', 'Continuité pendant le containment', 'Conduite locale renforcée du réseau électrique, consignes papier.', 'Exploitation', [], null, 'en-cours', { holds: 'Tant que l’OT est sain' }),
  a('P3', 'Continuité pendant le containment', 'Suspension des émissions de factures ; facturation manuelle des grands comptes prioritaires.', 'Direction financière', [], null, 'a-faire', { holds: '48 h puis manuel' }),
  a('P4', 'Continuité pendant le containment', 'Bons de commande papier numérotés ; inventaire manuel des pièces critiques.', 'Achats', [], null, 'a-faire', { holds: '3 à 5 jours' }),
  a('P5', 'Continuité pendant le containment', 'Reconduction de la paie M-1 via la banque.', 'DRH', [], null, 'a-faire', { holds: 'Date de paie' }),
  a('P6', 'Continuité pendant le containment', 'Canal de communication hors bande (mobiles, annuaire imprimé).', 'Continuité', ['continuite'], null, 'a-confirmer', { holds: 'Immédiat' }),
  a('P7', 'Continuité pendant le containment', 'Double validation de tout nouveau bénéficiaire de virement (suite A-23).', 'Direction financière', [], null, 'a-faire', { holds: 'Permanent' }),

  a('R1', 'Préparation de la reprise', 'Vérifier la date et l’intégrité de la dernière bande LTO-9.', 'Continuité', ['continuite'], null, 'fait', { condition: 'Confirmé J3 12:12 (RSSI) : copie de Settat intacte, J-42, jamais testée' }),
  a('R2', 'Préparation de la reprise', 'Préparer un environnement de reconstruction isolé.', 'DSI', [], null, 'a-faire', { condition: 'Après containment' }),
  a('R3', 'Préparation de la reprise', 'Reconstruire l’annuaire à neuf (pas depuis DC-02).', 'DSI', [], null, 'a-faire', { condition: 'Feu vert Forensic' }),
  a('R4', 'Préparation de la reprise', 'Restaurer messagerie et téléphonie.', 'DSI', [], null, 'a-faire', { condition: 'Annuaire sain' }),
  a('R5', 'Préparation de la reprise', 'Restaurer ERP, facturation, puis portail client.', 'DSI / Finance', [], null, 'a-faire', { condition: 'Données vérifiées' }),
  a('R6', 'Préparation de la reprise', 'Restaurer fichiers et paie.', 'DSI / DRH', [], null, 'a-faire', { condition: 'Selon échéance de paie' }),
  a('R7', 'Préparation de la reprise', 'Rétablir l’accès OasisNet avec MFA et bastion.', 'DSI / Direction', ['direction'], null, 'bloque', { condition: 'Explications écrites d’OasisNet' }),

  a('M1', 'Communication et obligations', 'Notification à l’Autorité.', 'Risque / Conformité', ['risque'], null, 'fait', { note: 'Accusé de réception J2 16:42' }),
  a('M2', 'Communication et obligations', 'Compléments à l’Autorité sous 72 h.', 'Risque / Conformité', ['risque'], null, 'en-cours', { note: 'Nature, périmètre, données, mesures' }),
  a('M3', 'Communication et obligations', 'Déclaration à l’assureur cyber.', 'Risque / Conformité', ['risque'], null, 'fait', { note: 'Couverture confirmée' }),
  a('M4', 'Communication et obligations', 'Réponse à la Chérifienne des Mines.', 'Communication', ['communication'], null, 'fait', { note: 'Réponse prudente, honnête' }),
  a('M5', 'Communication et obligations', 'Information des clients présents dans l’extrait de fuite (A-07).', 'Communication', ['communication'], null, 'a-faire', { note: 'Avant J3 11h00' }),
  a('M6', 'Communication et obligations', 'Évaluer l’information de la CNDP (loi 09-08).', 'Risque / Conformité', ['risque'], null, 'a-faire', { note: 'Si données personnelles confirmées' }),
  a('M7', 'Communication et obligations', 'Demande écrite formelle à OasisNet (usage de svc_oasisnet, incident de supervision).', 'Continuité', ['continuite'], null, 'en-cours', { note: 'Réponses toujours évasives' }),
  a('M8', 'Communication et obligations', 'Consignes aux salariés sur les modes dégradés.', 'Communication', ['communication'], null, 'a-confirmer', { note: 'Message rassurant mais vague (J2 15:58), apaisé après l’article (16:01)' }),
  a('M9', 'Communication et obligations', 'Remercier le salarié ayant signalé la fraude au président.', 'Communication', ['communication'], null, 'a-faire', { note: 'Bon réflexe à valoriser' }),
];

export const evidenceToPreserve = [
  'Journaux VPN FortiGate (A-02) et pare-feu, y compris la configuration de OUT-TEMP-443 (A-09).',
  'Historique Veeam et configuration de la politique de rétention (A-05).',
  'Mémoire vive et disque de FIN-112 ; échantillon de svhost32.exe.',
  'Copie des notes de rançon et métadonnées NTFS de FILER-RBT-02 (A-04).',
  'En-têtes du courriel d’hameçonnage (A-11).',
];

export const cutDecision = {
  proposal: 'Tout couper et isoler du réseau.',
  why: 'L’attaquant dispose de comptes à privilèges ; isoler seulement certains segments risque de laisser un chemin ouvert. Chaque heure de propagation coûte des serveurs encore sains.',
  cost: 'Limité : l’essentiel de l’activité est déjà en mode dégradé (paie, facturation, ERP chiffrés).',
  continues: 'La production d’énergie (OT isolé) et le site public, hébergé hors domaine.',
  rejected: '« Maintenir coûte que coûte » laisserait le chiffrement atteindre les derniers serveurs sains.',
  // Décision réellement tracée sur la plateforme (J2 ~12:25), différente de la proposition du plan.
  actual: 'Isoler seulement les segments critiques',
  actualDetail: 'Isolement ciblé acté (DSI, J2 15:58) : partages de fichiers et annuaire coupés ; OT industriel et site public maintenus sous surveillance. Le RSSI juge le compromis bon, sous conditions : surveiller les segments maintenus et tenir une liste écrite de ce qui est isolé.',
};

// Constat final sur les sauvegardes (A-06, RSSI J3 12:12) et décisions de reprise tracées.
export const backupFindings = {
  online: 'Sauvegarde en ligne OasisNet hors service depuis J-3 (A-05, A-06).',
  offline: 'Copie LTO-9 hors ligne du site de Settat intacte, physiquement coupée du réseau.',
  lastCopy: 'J-42 (environ six semaines)',
  volume: '38 To',
  tested: 'Jamais testée en restauration réelle (aucun procès-verbal)',
  restoreTime: '5 à 10 jours',
  scenario: 'B',
  restoreDecision: 'Restaurer depuis l’air-gap de Settat (sûr, lent) — « le bon réflexe » (DSI, J3 13:08)',
  priorityDecision: 'Facturation clients (FACT-02) d’abord — relation Chérifienne sauvée, paie après (J3 13:01)',
};

export const otCutCriterion = [
  'Surveillance continue de la passerelle IT/OT et de tout flux entre les deux réseaux.',
  'Coupure immédiate, sans nouvelle délibération : tout flux, connexion ou compte suspect détecté sur la passerelle ou côté OT.',
  'Responsable désigné du « bouton de coupure », joignable en permanence, avec un suppléant.',
  'Conduite locale des installations prête à être activée par les opérateurs.',
];

export const containmentEndCriteria = [
  { criterion: 'Plus aucune communication vers les IP de l’attaquant', check: 'Aucune session pendant au moins 48 h (pare-feu).' },
  { criterion: 'Plus aucun nouveau fichier chiffré', check: 'Aucune nouvelle extension .mirage (EDR, serveurs de fichiers).' },
  { criterion: 'Plus aucune connexion suspecte', check: 'Aucune authentification anormale (heure, pays, compte désactivé).' },
  { criterion: 'OT confirmé isolé et sain', check: 'Contrôle par l’équipe OT, aucun flux avec le SI.' },
  { criterion: 'Preuves préservées', check: 'Validation écrite du Forensic.' },
];

export const containmentOpenPoints = [
  'Choix exact retenu pour la décision D2 (couper ou maintenir). → Tranché sur la plateforme : isolement des seuls segments critiques.',
  'Date et intégrité de la dernière bande LTO-9. → Vérifié J3 12:12 : intacte, J-42, jamais testée (A-06).',
  'Volume et nature réels des données exfiltrées (12,5 Go observés, 300 Go annoncés).',
  'Analyse de l’export A-15 (compte a.elomrani) : IP identiques à celles de l’attaquant ?',
  'Étanchéité réelle du réseau OT et rôle de la passerelle IT/OT.',
  'Explications d’OasisNet sur l’usage de son compte de service.',
];

export const containmentConclusion = 'Au soir du deuxième jour, l’attaquant est coupé de ses accès connus, le réseau industriel est protégé par un critère de coupure clair, et les obligations de notification sont respectées. Le risque principal n’est plus technique mais lié aux données : SIROCCO détient une partie des données clients et menace de les publier.';
